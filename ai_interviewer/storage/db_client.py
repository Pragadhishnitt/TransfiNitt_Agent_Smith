import config
from supabase import create_client, Client
from typing import Optional, List, Dict
from models.schemas import InterviewTemplate, InterviewSummary, InterviewState, AnalyzedResponse

class SupabaseDBClient:
    """
    Client for interacting with the Supabase PostgreSQL database.
    Handles all persistent storage operations.
    """
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(SupabaseDBClient, cls).__new__(cls)
            try:
                cls.client: Client = create_client(config.SUPABASE_URL, config.SUPABASE_KEY)
                print("✅ Successfully connected to Supabase.")
            except Exception as e:
                print(f"🔥 Error connecting to Supabase: {e}")
                cls.client = None
        return cls._instance

    # ========================================================================
    # TEMPLATE MANAGEMENT
    # ========================================================================

    async def save_template(self, template: InterviewTemplate) -> str:
        """Saves an interview template to the database."""
        if not self.client:
            raise ConnectionError("Supabase client not initialized.")
        try:
            template_dict = template.model_dump()
            response = self.client.table("interview_templates").insert(template_dict).execute()
            if response.data:
                return response.data[0]['template_id']
            raise Exception("Failed to save template, no data returned.")
        except Exception as e:
            print(f"Error saving template: {e}")
            raise

    async def get_template(self, template_id: str) -> Optional[InterviewTemplate]:
        """Gets a template by its ID - returns InterviewTemplate object."""
        if not self.client:
            raise ConnectionError("Supabase client not initialized.")
        try:
            response = self.client.table("interview_templates").select("*").eq("template_id", template_id).execute()
            if response.data:
                return InterviewTemplate(**response.data[0])
            return None
        except Exception as e:
            print(f"Error getting template: {e}")
            return None

    async def get_all_templates(self) -> List[InterviewTemplate]:
        """Gets all available templates."""
        if not self.client:
            raise ConnectionError("Supabase client not initialized.")
        try:
            response = self.client.table("interview_templates").select("*").execute()
            return [InterviewTemplate(**t) for t in response.data]
        except Exception as e:
            print(f"Error getting templates: {e}")
            return []

    # ========================================================================
    # SESSION MANAGEMENT
    # ========================================================================

    async def save_interview_session(self, session_state: InterviewState) -> str:
        """Saves the initial state of an interview session."""
        if not self.client:
            raise ConnectionError("Supabase client not initialized.")
        try:
            session_dict = session_state.model_dump()
            response = self.client.table("interview_sessions").insert(session_dict).execute()
            return response.data[0]['session_id']
        except Exception as e:
            print(f"Error saving interview session: {e}")
            raise

    async def update_interview_session(self, session_id: str, updates: dict) -> bool:
        """Updates an existing interview session."""
        if not self.client:
            raise ConnectionError("Supabase client not initialized.")
        try:
            # Add updated_at timestamp
            updates['updated_at'] = 'NOW()'
            response = self.client.table("interview_sessions").update(updates).eq("session_id", session_id).execute()
            return len(response.data) > 0
        except Exception as e:
            print(f"Error updating interview session: {e}")
            return False

    async def update_interview_status(self, session_id: str, status: str) -> bool:
        """Updates the completion status of an interview session."""
        if not self.client:
            raise ConnectionError("Supabase client not initialized.")
        try:
            is_complete = status == "completed"
            response = self.client.table("interview_sessions").update({
                "is_complete": is_complete,
                "updated_at": "NOW()"
            }).eq("session_id", session_id).execute()
            return len(response.data) > 0
        except Exception as e:
            print(f"Error updating interview status: {e}")
            return False

    async def get_interview_session(self, session_id: str) -> Optional[InterviewState]:
        """Retrieves a full interview session by its ID."""
        if not self.client:
            raise ConnectionError("Supabase client not initialized.")
        try:
            response = self.client.table("interview_sessions").select("*").eq("session_id", session_id).execute()
            if response.data:
                return InterviewState(**response.data[0])
            return None
        except Exception as e:
            print(f"Error getting interview session: {e}")
            return None

    # ========================================================================
    # ANALYZED RESPONSE MANAGEMENT (NEW - REQUIRED)
    # ========================================================================

    async def save_analyzed_response(self, analyzed: AnalyzedResponse, session_id: str, respondent_id: str) -> bool:
        """Saves an analyzed response to the database."""
        if not self.client:
            raise ConnectionError("Supabase client not initialized.")
        try:
            data = {
                "session_id": session_id,
                "respondent_id": respondent_id,
                "response_text": analyzed.response_text,
                "sentiment": analyzed.sentiment.value,
                "quality": analyzed.quality.value,
                "word_count": analyzed.word_count,
                "key_insights": analyzed.key_insights,
            }
            response = self.client.table("analyzed_responses").insert(data).execute()
            return len(response.data) > 0
        except Exception as e:
            print(f"Error saving analyzed response: {e}")
            return False

    async def get_analyzed_responses(self, session_id: str) -> List[AnalyzedResponse]:
        """Retrieves all analyzed responses for a session."""
        if not self.client:
            raise ConnectionError("Supabase client not initialized.")
        try:
            response = self.client.table("analyzed_responses").select("*").eq("session_id", session_id).order("created_at").execute()
            return [AnalyzedResponse(**r) for r in response.data]
        except Exception as e:
            print(f"Error getting analyzed responses: {e}")
            return []

    async def get_all_insights_for_session(self, session_id: str) -> List[str]:
        """Gets all key insights gathered for a session."""
        if not self.client:
            raise ConnectionError("Supabase client not initialized.")
        try:
            response = self.client.table("analyzed_responses").select("key_insights").eq("session_id", session_id).execute()
            all_insights = []
            for row in response.data:
                if row.get('key_insights'):
                    all_insights.extend(row['key_insights'])
            return list(set(all_insights))  # Return unique insights
        except Exception as e:
            print(f"Error getting insights: {e}")
            return []

    # ========================================================================
    # SUMMARY MANAGEMENT
    # ========================================================================

    async def save_summary(self, summary: InterviewSummary) -> bool:
        """Saves a completed interview summary."""
        if not self.client:
            raise ConnectionError("Supabase client not initialized.")
        try:
            summary_dict = summary.model_dump()
            response = self.client.table("interview_summaries").insert(summary_dict).execute()
            return len(response.data) > 0
        except Exception as e:
            print(f"Error saving summary: {e}")
            return False

    async def get_summary(self, session_id: str) -> Optional[InterviewSummary]:
        """Retrieves the summary for a specific session."""
        if not self.client:
            raise ConnectionError("Supabase client not initialized.")
        try:
            response = self.client.table("interview_summaries").select("*").eq("session_id", session_id).execute()
            if response.data:
                return InterviewSummary(**response.data[0])
            return None
        except Exception as e:
            print(f"Error getting summary: {e}")
            return None

    # ========================================================================
    # DASHBOARD & ANALYTICS
    # ========================================================================

    async def get_all_interviews_for_user(self, user_id: str, limit: int = 100) -> List[dict]:
        """Gets all interview sessions for a specific user (for dashboard)."""
        if not self.client:
            raise ConnectionError("Supabase client not initialized.")
        try:
            response = self.client.table("interview_sessions").select("*").eq("respondent_id", user_id).order("created_at", desc=True).limit(limit).execute()
            return response.data
        except Exception as e:
            print(f"Error getting user interviews: {e}")
            return []

    async def get_researcher_analytics(self, researcher_id: str) -> Dict:
        """Gets aggregate analytics for a researcher's templates."""
        if not self.client:
            raise ConnectionError("Supabase client not initialized.")
        try:
            # Get templates created by this researcher
            templates_response = self.client.table("interview_templates").select("template_id").eq("created_by", researcher_id).execute()
            template_ids = [t['template_id'] for t in templates_response.data]
            
            # Get sessions using these templates
            sessions_response = self.client.table("interview_sessions").select("*").in_("template_id", template_ids).execute()
            
            total_sessions = len(sessions_response.data)
            completed_sessions = sum(1 for s in sessions_response.data if s.get('is_complete'))
            
            return {
                "total_templates": len(template_ids),
                "total_sessions": total_sessions,
                "completed_sessions": completed_sessions,
                "completion_rate": (completed_sessions / total_sessions * 100) if total_sessions > 0 else 0
            }
        except Exception as e:
            print(f"Error getting researcher analytics: {e}")
            return {}

# Singleton instance for use across the application
db_client = SupabaseDBClient()