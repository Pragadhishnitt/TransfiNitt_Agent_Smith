"""
Interviewer Agent - Generates main interview questions
"""

from models.schemas import InterviewState
from typing import List
from groq import Groq
import config

class InterviewerAgent:
    """Generates engaging, context-aware interview questions"""
    
    def __init__(self):
        self.groq_client = Groq(api_key=config.GROQ_API_KEY)
    
    async def generate_next_question(
        self,
        state: InterviewState,
        collected_insights: List[str]
    ) -> str:
        """
        Generate the next main interview question based on:
        1. Research topic
        2. What's been discussed so far
        3. Insights collected
        """
        
        # Build context from conversation
        discussed_topics = []
        for msg in state.conversation_history:
            if msg["role"] == "assistant":
                discussed_topics.append(msg["content"])
        
        recent_topics = discussed_topics[-3:] if discussed_topics else []
        
        # Get recent user insights
        recent_insights = collected_insights[-5:] if collected_insights else []
        
        prompt = f"""You are an ENGAGING market researcher conducting an interview.

Research Topic: {state.research_topic}

Progress: Question {state.current_question_count}/{state.max_questions}

What you've already asked:
{chr(10).join([f"- {topic}" for topic in recent_topics])}

Insights collected so far:
{chr(10).join([f"- {insight}" for insight in recent_insights])}

Your task: Generate the NEXT natural follow-up question.

RULES:
1. STAY ON TOPIC - Only ask about: {state.research_topic}
2. Build on what they've shared - reference their previous responses
3. Ask open-ended questions (who, what, when, where, why, how)
4. Be conversational and WARM - show genuine curiosity
5. Keep questions SHORT (1-2 sentences MAX)
6. Add emotional engagement:
   - "I'm curious..."
   - "I'd love to understand..."
   - "That's fascinating! Tell me more about..."
7. Ask for SPECIFICS - examples, stories, concrete details
8. Create natural conversation flow

GOOD questions:
- "That's interesting! Can you walk me through a specific example of when that happened?"
- "I'm curious - what made you choose that approach over others?"
- "Tell me more about how that impacts your daily routine?"

BAD questions (NEVER use):
- "How do you feel about that?" (too vague)
- "Can you tell me more?" (lazy)
- "What else?" (unengaging)

Generate ONE natural, engaging follow-up question:"""
        
        try:
            response = self.groq_client.chat.completions.create(
                model=config.GROQ_FAST_MODEL,
                messages=[{"role": "user", "content": prompt}],
                max_tokens=120,
                temperature=0.4
            )
            
            question = response.choices[0].message.content.strip()
            
            # Remove quotes if LLM added them
            if question.startswith('"') and question.endswith('"'):
                question = question[1:-1]
            
            return question
        
        except Exception as e:
            print(f"âš ï¸ Question generation error: {e}")
            return "Could you tell me more about your experience with that?"

# Singleton instance
interviewer_agent = InterviewerAgent()