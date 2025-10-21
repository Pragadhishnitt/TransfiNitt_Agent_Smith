"""
Database client for storing interview data.
Uses in-memory storage for now, but can be replaced with PostgreSQL/MongoDB.
"""

from typing import List, Optional
from models.schemas import AnalyzedResponse, InterviewSummary
from datetime import datetime

class DatabaseClient:
    """Simple in-memory database client"""
    
    def __init__(self):
        self.sessions = {}  # session_id -> session_data
        self.analyzed_responses = {}  # session_id -> List[AnalyzedResponse]
        self.summaries = {}  # session_id -> InterviewSummary
    
    async def initialize_session(self, session_id: str, template_id: str, research_topic: str):
        """Initialize a new interview session"""
        self.sessions[session_id] = {
            "template_id": template_id,
            "research_topic": research_topic,
            "started_at": datetime.now(),
            "status": "active"
        }
        self.analyzed_responses[session_id] = []
        print(f"✅ Session initialized in database: {session_id}")
    
    async def save_analyzed_response(
        self, 
        analyzed: AnalyzedResponse, 
        session_id: str, 
        respondent_id: str
    ):
        """Save an analyzed response"""
        analyzed.session_id = session_id
        analyzed.respondent_id = respondent_id
        
        if session_id not in self.analyzed_responses:
            self.analyzed_responses[session_id] = []
        
        self.analyzed_responses[session_id].append(analyzed)
        print(f"💾 Saved analyzed response: {len(analyzed.key_insights)} insights")
    
    async def get_analyzed_responses(self, session_id: str) -> List[AnalyzedResponse]:
        """Get all analyzed responses for a session"""
        return self.analyzed_responses.get(session_id, [])
    
    async def get_all_insights_for_session(self, session_id: str) -> List[str]:
        """Get all insights collected so far"""
        responses = self.analyzed_responses.get(session_id, [])
        all_insights = []
        for response in responses:
            all_insights.extend(response.key_insights)
        return all_insights
    
    async def save_summary(self, summary: InterviewSummary):
        """Save interview summary"""
        self.summaries[summary.session_id] = summary
        print(f"💾 Summary saved for session: {summary.session_id}")
    
    async def get_summary(self, session_id: str) -> Optional[InterviewSummary]:
        """Get summary for a session"""
        return self.summaries.get(session_id)
    
    async def update_interview_status(self, session_id: str, status: str):
        """Update interview status"""
        if session_id in self.sessions:
            self.sessions[session_id]["status"] = status
            self.sessions[session_id]["completed_at"] = datetime.now()
            print(f"✅ Interview status updated: {status}")
    
    async def get_session(self, session_id: str) -> Optional[dict]:
        """Get session data"""
        return self.sessions.get(session_id)

# Singleton instance
db_client = DatabaseClient()