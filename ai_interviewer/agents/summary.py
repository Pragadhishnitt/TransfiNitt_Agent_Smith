from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import JsonOutputParser
from pydantic import BaseModel, Field
from typing import List, Dict
from collections import Counter

import config
from models.schemas import InterviewSummary, InterviewState, AnalyzedResponse

# Pydantic model for the structured output from the narrative summary LLM call.
class GeneratedSummary(BaseModel):
    overview: str = Field(description="A brief, 2-3 sentence overview of the participant's key perspective.")
    main_themes: List[str] = Field(description="A list of the main themes or patterns that emerged during the conversation.")
    notable_quotes: List[str] = Field(description="A list of 2-3 notable, paraphrased quotes that capture the participant's voice.")
    researcher_recommendations: str = Field(description="Actionable recommendations or areas for further inquiry for the researcher.")

class SummaryAgent:
    """
    Generates a final, comprehensive summary of the interview after it concludes.
    """
    def __init__(self):
        # Summarization requires understanding the full context and nuances of the
        # entire conversation, making it a task for the complex LLM.
        self.llm = ChatGoogleGenerativeAI(
            model=config.COMPLEX_LLM_MODEL,
            temperature=0.5, # Slightly higher temp for more creative summary generation
            google_api_key=config.GEMINI_API_KEY,
            convert_system_message_to_human=True
        )

    async def generate_summary(
        self,
        state: InterviewState,
        responses_data: List[AnalyzedResponse]
    ) -> InterviewSummary:
        """
        Generates a comprehensive interview summary using the full conversation history.
        """
        # --- Data Aggregation ---
        sentiments = [r.sentiment.value for r in responses_data if r.sentiment]
        sentiment_distribution = dict(Counter(sentiments))

        all_insights = []
        for r in responses_data:
            if r.key_insights:
                all_insights.extend(r.key_insights)
        unique_insights = list(set(all_insights))[:10]

        # --- Narrative Summary Generation using LLM ---
        narrative_summary_obj = await self._generate_narrative_summary(
            state.research_topic,
            state.conversation_history,
            unique_insights
        )
        
        # Combine the structured parts into a readable string summary
        narrative_summary_text = f"Overview: {narrative_summary_obj.overview}\n\n"
        narrative_summary_text += "Main Themes:\n- " + "\n- ".join(narrative_summary_obj.main_themes) + "\n\n"
        narrative_summary_text += "Notable Quotes:\n- \"" + "\"\n- \"".join(narrative_summary_obj.notable_quotes) + "\"\n\n"
        narrative_summary_text += f"Researcher Recommendations: {narrative_summary_obj.researcher_recommendations}"

        return InterviewSummary(
            session_id=state.session_id,
            respondent_id=state.respondent_id,
            template_id=state.template_id,
            research_topic=state.research_topic,
            total_questions=state.current_question_count,
            key_insights=unique_insights,
            sentiment_distribution=sentiment_distribution,
            conversation_summary=narrative_summary_text
        )

    async def _generate_narrative_summary(
        self,
        research_topic: str,
        conversation_history: List[Dict[str, str]],
        key_insights: List[str]
    ) -> GeneratedSummary:
        """Generates a structured, narrative summary of the interview."""
        parser = JsonOutputParser(pydantic_object=GeneratedSummary)

        prompt = ChatPromptTemplate.from_messages([
            ("system", f"""You are a professional market research analyst. Your task is to synthesize an interview about "{research_topic}" into a structured summary.
            Based on the full conversation transcript and key insights, generate a JSON object that includes:
            1.  `overview`: A brief, 2-3 sentence overview of the participant's key perspective.
            2.  `main_themes`: A list of the main themes or patterns that emerged.
            3.  `notable_quotes`: A list of 2-3 notable, paraphrased quotes that capture the participant's voice.
            4.  `researcher_recommendations`: Actionable recommendations or areas for further inquiry for the researcher.

            Be professional, objective, and insightful.
            {parser.get_format_instructions()}
            """),
            ("user", f"""Full Conversation Transcript:
            {self._format_conversation(conversation_history)}

            Key Insights already identified: {", ".join(key_insights)}

            Now, generate the structured summary:""")
        ])

        chain = prompt | self.llm | parser
        summary_dict = await chain.ainvoke({})
        return GeneratedSummary(**summary_dict)

    def _format_conversation(self, history: List[Dict[str, str]]) -> str:
        """Formats the full conversation for the final summary analysis."""
        formatted = []
        for msg in history:
            role = "Interviewer (Q)" if msg["role"] == "assistant" else "Respondent (A)"
            formatted.append(f"{role}: {msg['content']}")
        return "\n".join(formatted)

# Singleton instance
summary_agent = SummaryAgent()
