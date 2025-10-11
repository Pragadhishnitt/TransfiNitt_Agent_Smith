from supabase import create_client, Client
from typing import Optional, List, Dict, Any
from datetime import datetime
import config

class SupabaseClient:
    """Database client for Supabase (PostgreSQL)"""
    
    def __init__(self):
        self.client: Client = create_client(
            config.SUPABASE_URL,
            config.SUPABASE_KEY
        )
    
    def _to_dict(self, obj: Any) -> Dict:
        """Helper method to convert any object to dict"""
        if hasattr(obj, 'model_dump'):  # Pydantic v2
            return obj.model_dump()
        elif hasattr(obj, 'dict'):  # Pydantic v1
            return obj.dict()
        elif isinstance(obj, dict):
            return obj
        else:
            return obj.__dict__
    
    # ========================================================================
    # INTERVIEW SESSION OPERATIONS
    # ========================================================================
    
    async def save_interview_session(self, interview_state: Any) -> str:
        """
        Save a new interview session.
        UPDATED: Now includes early termination fields and handles both dicts and Pydantic models.
        """
        state_dict = self._to_dict(interview_state)
        
        session_dict = {
            "session_id": state_dict["session_id"],
            "respondent_id": state_dict["respondent_id"],
            "template_id": state_dict["template_id"],
            "research_topic": state_dict["research_topic"],
            "conversation_history": state_dict.get("conversation_history", []),
            "current_question_count": state_dict.get("current_question_count", 0),
            "max_questions": state_dict.get("max_questions", 15),
            "is_complete": state_dict.get("is_complete", False),
            "probe_count": state_dict.get("probe_count", 0),
            "status": "in_progress",
            # NEW FIELDS for early termination
            "should_terminate_early": state_dict.get("should_terminate_early", False),
            "termination_reason": state_dict.get("termination_reason", None),
            "created_at": datetime.now().isoformat(),
        }
        
        response = self.client.table("interview_sessions").insert(session_dict).execute()
        return state_dict["session_id"]
    
    async def update_interview_session(self, session_id: str, updates: Any) -> bool:
        """
        Update an existing interview session.
        UPDATED: Handles early termination fields and both dicts and Pydantic models.
        """
        updates_dict = self._to_dict(updates)
        updates_dict["updated_at"] = datetime.now().isoformat()
        
        response = self.client.table("interview_sessions")\
            .update(updates_dict)\
            .eq("session_id", session_id)\
            .execute()
        
        return len(response.data) > 0
    
    async def get_interview_session(self, session_id: str) -> Optional[Dict]:
        """Get interview session by ID"""
        response = self.client.table("interview_sessions")\
            .select("*")\
            .eq("session_id", session_id)\
            .execute()
        
        return response.data[0] if response.data else None
    
    async def update_interview_status(self, session_id: str, status: str) -> bool:
        """
        Update interview status.
        Status can be: 'in_progress', 'completed', 'terminated_early'
        """
        return await self.update_interview_session(session_id, {"status": status})
    
    # ========================================================================
    # ANALYZED RESPONSE OPERATIONS
    # ========================================================================
    
    async def save_analyzed_response(
        self, 
        analyzed_response: Any,
        session_id: str,
        respondent_id: str
    ) -> str:
        """Save an analyzed user response. Handles both objects and dicts."""
        response_data = self._to_dict(analyzed_response)
        
        # Handle sentiment and quality which might be enums or strings
        sentiment = response_data.get("sentiment")
        if hasattr(sentiment, "value"):
            sentiment = sentiment.value
        elif isinstance(sentiment, dict):
            sentiment = sentiment.get("value", sentiment)
            
        quality = response_data.get("quality")
        if hasattr(quality, "value"):
            quality = quality.value
        elif isinstance(quality, dict):
            quality = quality.get("value", quality)
        
        response_dict = {
            "session_id": session_id,
            "respondent_id": respondent_id,
            "response_text": response_data.get("response_text"),
            "sentiment": sentiment,
            "quality": quality,
            "word_count": response_data.get("word_count"),
            "key_insights": response_data.get("key_insights", []),
            "timestamp": datetime.now().isoformat()
        }
        
        response = self.client.table("analyzed_responses").insert(response_dict).execute()
        return response.data[0]["id"] if response.data else None
    
    async def get_analyzed_responses(self, session_id: str) -> List[Dict]:
        """
        Get all analyzed responses for a session.
        Returns list of dictionaries from database.
        """
        response = self.client.table("analyzed_responses")\
            .select("*")\
            .eq("session_id", session_id)\
            .order("timestamp")\
            .execute()
        
        return response.data if response.data else []
    
    async def get_all_insights_for_session(self, session_id: str) -> List[str]:
        """Get all key insights from a session"""
        responses = await self.get_analyzed_responses(session_id)
        
        all_insights = []
        for r in responses:
            if r.get("key_insights"):
                all_insights.extend(r["key_insights"])
        
        # Return unique insights
        return list(set(all_insights))
    
    # ========================================================================
    # SUMMARY OPERATIONS
    # ========================================================================
    
    async def save_summary(self, summary: Any) -> str:
        """
        Save interview summary.
        UPDATED: Now includes metadata for early termination.
        """
        summary_dict = self._to_dict(summary)
        
        # Prepare the summary data
        summary_data = {
            "session_id": summary_dict["session_id"],
            "respondent_id": summary_dict["respondent_id"],
            "template_id": summary_dict["template_id"],
            "research_topic": summary_dict["research_topic"],
            "total_questions": summary_dict["total_questions"],
            "key_insights": summary_dict.get("key_insights", []),
            "sentiment_distribution": summary_dict.get("sentiment_distribution", {}),
            "conversation_summary": summary_dict.get("conversation_summary", ""),
            "metadata": summary_dict.get("metadata", {}),  # NEW: includes termination info
            "created_at": datetime.now().isoformat()
        }
        
        # Update the interview session with the summary
        await self.update_interview_session(
            summary_dict["session_id"],
            {"summary": summary_data}
        )
        
        # Also save to separate summaries table if you have one
        try:
            response = self.client.table("interview_summaries").insert(summary_data).execute()
        except Exception as e:
            print(f"Warning: Could not save to summaries table: {e}")
        
        return summary_dict["session_id"]
    
    async def get_summary(self, session_id: str) -> Optional[Dict]:
        """Get interview summary"""
        # Try summaries table first
        try:
            response = self.client.table("interview_summaries")\
                .select("*")\
                .eq("session_id", session_id)\
                .execute()
            
            if response.data:
                return response.data[0]
        except Exception:
            pass
        
        # Fall back to interview_sessions table
        session = await self.get_interview_session(session_id)
        return session.get("summary") if session else None
    
    # ========================================================================
    # TEMPLATE OPERATIONS
    # ========================================================================
    
    async def save_template(self, template: Any) -> str:
        """
        Save an interview template.
        Handles both Pydantic models and dictionaries.
        """
        template_dict = self._to_dict(template)
        
        response = self.client.table("interview_templates")\
            .insert(template_dict)\
            .execute()
        
        return template_dict["template_id"]
    
    async def get_template(self, template_id: str) -> Optional[Dict]:
        """Get a template by ID"""
        response = self.client.table("interview_templates")\
            .select("*")\
            .eq("template_id", template_id)\
            .execute()
        
        return response.data[0] if response.data else None
    
    async def get_all_templates(self) -> List[Dict]:
        """Get all templates"""
        response = self.client.table("interview_templates")\
            .select("*")\
            .execute()
        
        return response.data
    
    # ========================================================================
    # DASHBOARD & ANALYTICS
    # ========================================================================
    
    async def get_all_interviews(self, limit: int = 100) -> List[Dict]:
        """Get all interviews for dashboard"""
        response = self.client.table("interview_sessions")\
            .select("*")\
            .order("created_at", desc=True)\
            .limit(limit)\
            .execute()
        
        return response.data
    
    async def get_completed_interviews(self, limit: int = 100) -> List[Dict]:
        """Get only completed interviews"""
        response = self.client.table("interview_sessions")\
            .select("*")\
            .in_("status", ["completed", "terminated_early"])\
            .order("created_at", desc=True)\
            .limit(limit)\
            .execute()
        
        return response.data
    
    async def get_early_terminations(self, limit: int = 100) -> List[Dict]:
        """
        Get interviews that were terminated early.
        NEW METHOD for early termination analytics.
        """
        response = self.client.table("interview_sessions")\
            .select("*")\
            .eq("should_terminate_early", True)\
            .order("created_at", desc=True)\
            .limit(limit)\
            .execute()
        
        return response.data
    
    async def get_termination_stats(self) -> Dict:
        """
        Get statistics about early terminations.
        NEW METHOD for dashboard analytics.
        """
        # Get all interviews
        all_interviews = await self.get_all_interviews(limit=1000)
        
        # Count terminations
        early_terminations = [i for i in all_interviews if i.get("should_terminate_early")]
        
        # Group by reason
        termination_reasons = {}
        for interview in early_terminations:
            reason = interview.get("termination_reason", "unknown")
            termination_reasons[reason] = termination_reasons.get(reason, 0) + 1
        
        return {
            "total_interviews": len(all_interviews),
            "completed": len([i for i in all_interviews if i.get("status") == "completed"]),
            "terminated_early": len(early_terminations),
            "completion_rate": (len([i for i in all_interviews if i.get("status") == "completed"]) / len(all_interviews) * 100) if all_interviews else 0,
            "termination_reasons": termination_reasons,
            "avg_questions_before_termination": sum(i.get("current_question_count", 0) for i in early_terminations) / len(early_terminations) if early_terminations else 0
        }
    
    # ========================================================================
    # RESEARCHER-SPECIFIC METHODS
    # ========================================================================
    
    async def get_researcher_analytics(self, researcher_id: str) -> Dict:
        """Get analytics for a specific researcher"""
        # Get templates created by this researcher
        templates = self.client.table("interview_templates")\
            .select("*")\
            .eq("created_by", researcher_id)\
            .execute()
        
        template_ids = [t["template_id"] for t in templates.data]
        
        # Get interviews using those templates
        if template_ids:
            interviews = self.client.table("interview_sessions")\
                .select("*")\
                .in_("template_id", template_ids)\
                .execute()
        else:
            interviews = []
        
        return {
            "total_templates": len(templates.data),
            "total_interviews": len(interviews.data) if hasattr(interviews, 'data') else 0,
            "templates": templates.data
        }
    
    async def get_all_interviews_for_user(self, researcher_id: str, limit: int = 100) -> List[Dict]:
        """Get all interviews for templates created by a researcher"""
        # Get templates created by this researcher
        templates = self.client.table("interview_templates")\
            .select("template_id")\
            .eq("created_by", researcher_id)\
            .execute()
        
        template_ids = [t["template_id"] for t in templates.data]
        
        if not template_ids:
            return []
        
        # Get interviews using those templates
        interviews = self.client.table("interview_sessions")\
            .select("*")\
            .in_("template_id", template_ids)\
            .order("created_at", desc=True)\
            .limit(limit)\
            .execute()
        
        return interviews.data
    
    # ========================================================================
    # UTILITY METHODS
    # ========================================================================
    
    async def delete_interview(self, session_id: str) -> bool:
        """Delete an interview and all associated data"""
        # Delete analyzed responses
        self.client.table("analyzed_responses")\
            .delete()\
            .eq("session_id", session_id)\
            .execute()
        
        # Delete summary
        try:
            self.client.table("interview_summaries")\
                .delete()\
                .eq("session_id", session_id)\
                .execute()
        except Exception:
            pass
        
        # Delete interview session
        response = self.client.table("interview_sessions")\
            .delete()\
            .eq("session_id", session_id)\
            .execute()
        
        return len(response.data) > 0

# Singleton instance
db_client = SupabaseClient()