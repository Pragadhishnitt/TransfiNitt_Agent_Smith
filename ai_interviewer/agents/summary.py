"""
Summary Agent - Generates final interview summaries
"""

from models.schemas import InterviewState, AnalyzedResponse, InterviewSummary
from typing import List
from groq import Groq
import config
import json

class SummaryAgent:
    """Generates comprehensive interview summaries"""
    
    def __init__(self):
        self.groq_client = Groq(api_key=config.GROQ_API_KEY)
    
    async def generate_summary(
        self,
        state: InterviewState,
        analyzed_responses: List[AnalyzedResponse],
        early_termination: bool = False,
        termination_reason: str = None
    ) -> InterviewSummary:
        """
        Generate final summary including:
        1. Overall summary of conversation
        2. Key themes identified
        3. Average sentiment
        4. Total insights collected
        """
        
        # Collect all insights
        all_insights = []
        sentiment_scores = []
        
        for response in analyzed_responses:
            all_insights.extend(response.key_insights)
            
            # Convert sentiment to numeric score
            if response.sentiment.value == "positive":
                sentiment_scores.append(0.8)
            elif response.sentiment.value == "negative":
                sentiment_scores.append(0.2)
            else:
                sentiment_scores.append(0.5)
        
        # Calculate average sentiment
        avg_sentiment = sum(sentiment_scores) / len(sentiment_scores) if sentiment_scores else 0.5
        
        # Extract user responses for summary
        user_responses = [
            msg["content"] 
            for msg in state.conversation_history 
            if msg["role"] == "user"
        ]
        
        # Generate summary using Groq
        summary_text = await self._generate_summary_text(
            user_responses,
            all_insights,
            state.research_topic,
            early_termination,
            termination_reason
        )
        
        # Extract key themes
        key_themes = await self._extract_key_themes(all_insights, user_responses)
        
        return InterviewSummary(
            session_id=state.session_id,
            template_id=state.template_id,
            summary=summary_text,
            key_themes=key_themes,
            average_sentiment_score=round(avg_sentiment, 2),
            total_insights_count=len(all_insights),
            questions_asked=state.current_question_count,
            total_exchanges=len(state.conversation_history),
            terminated_early=early_termination,
            termination_reason=termination_reason
        )
    
    async def _generate_summary_text(
        self,
        user_responses: List[str],
        insights: List[str],
        research_topic: str,
        early_termination: bool,
        termination_reason: str
    ) -> str:
        """Generate summary text using Groq"""
        
        responses_text = "\n".join(user_responses)
        insights_text = "\n".join([f"- {insight}" for insight in insights[:20]])  # Top 20
        
        if early_termination:
            prefix = f"⚠️ Interview terminated early: {termination_reason}\n\n"
            prompt = f"""Generate a brief summary (2-3 sentences) of this INCOMPLETE interview.

Research Topic: {research_topic}

User Responses:
{responses_text}

Key Insights:
{insights_text}

Note: This interview was terminated early. Focus on what was discussed before termination.
Summarize the main points covered:"""
        else:
            prefix = ""
            prompt = f"""Generate a comprehensive summary (3-4 sentences) of this interview.

Research Topic: {research_topic}

User Responses:
{responses_text}

Key Insights:
{insights_text}

Summarize the main findings, patterns, and user perspectives:"""
        
        try:
            response = self.groq_client.chat.completions.create(
                model=config.GROQ_QUALITY_MODEL,
                messages=[{"role": "user", "content": prompt}],
                max_tokens=200,
                temperature=0.0
            )
            
            summary = response.choices[0].message.content.strip()
            return prefix + summary
        
        except Exception as e:
            print(f"⚠️ Summary generation error: {e}")
            if early_termination:
                return f"{prefix}Interview was terminated before completion. Limited insights were gathered about {research_topic}."
            return f"Interview completed successfully. User shared their perspectives on {research_topic}."
    
    async def _extract_key_themes(
        self,
        insights: List[str],
        user_responses: List[str]
    ) -> List[str]:
        """Extract key themes using Groq"""
        
        if not insights and not user_responses:
            return ["general feedback", "user experience"]
        
        combined_text = "\n".join(insights) + "\n" + "\n".join(user_responses)
        
        prompt = f"""Extract 3-5 key themes from this interview data.

Interview Data:
{combined_text[:2000]}  

Return ONLY a JSON array of theme strings:
["theme1", "theme2", "theme3"]

Themes should be:
- Concise (2-4 words)
- Specific to what was discussed
- Actionable for researchers"""
        
        try:
            response = self.groq_client.chat.completions.create(
                model=config.GROQ_QUALITY_MODEL,
                messages=[{"role": "user", "content": prompt}],
                max_tokens=100,
                temperature=0.0
            )
            
            themes_text = response.choices[0].message.content.strip()
            
            # Parse JSON
            themes = json.loads(themes_text)
            return themes[:5]  # Max 5 themes
        
        except Exception as e:
            print(f"⚠️ Theme extraction error: {e}")
            # Fallback: Extract from insights
            if insights:
                return [insight.split(":")[0] for insight in insights[:5]]
            return ["user preferences", "experience feedback", "usage patterns"]

# Singleton instance
summary_agent = SummaryAgent()