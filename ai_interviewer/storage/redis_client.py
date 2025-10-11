import redis
import json
from typing import Optional, Dict

import config
from models.schemas import InterviewState

class RedisClient:
    """A client for managing interview session state in Redis."""

    def __init__(self):
        """Initializes the Redis connection."""
        try:
            self.client = redis.Redis(
                host=config.REDIS_HOST,
                port=config.REDIS_PORT,
                db=config.REDIS_DB,
                password=config.REDIS_PASSWORD,
                decode_responses=True
            )
            self.client.ping()
            print("✅ Successfully connected to Redis.")
        except redis.exceptions.ConnectionError as e:
            print(f"❌ Could not connect to Redis: {e}")
            self.client = None

    def save_conversation_context(self, session_id: str, state: InterviewState) -> bool:
        """
        Saves the entire interview state object for a session.
        This is the method name used in orchestrator.py
        """
        if not self.client:
            return False
        try:
            key = f"session:{session_id}:context"
            self.client.setex(
                key,
                config.CONVERSATION_TIMEOUT,
                state.model_dump_json()
            )
            return True
        except Exception as e:
            print(f"Error saving interview state: {e}")
            return False

    def get_conversation_context(self, session_id: str) -> Optional[InterviewState]:
        """
        Retrieves and reconstructs the InterviewState object for a session.
        This is the method name used in orchestrator.py
        """
        if not self.client:
            return None
        try:
            key = f"session:{session_id}:context"
            data = self.client.get(key)
            if data:
                return InterviewState.model_validate_json(data)
            return None
        except Exception as e:
            print(f"Error getting interview state: {e}")
            return None

    def update_state(self, session_id: str, state_updates: Dict) -> bool:
        """Updates specific fields within the interview state."""
        if not self.client:
            return False
        try:
            state = self.get_conversation_context(session_id)
            if not state:
                print(f"Error: Could not find state for session {session_id} to update.")
                return False

            updated_state_data = state.model_dump()
            updated_state_data.update(state_updates)
            new_state = InterviewState(**updated_state_data)

            return self.save_conversation_context(session_id, new_state)
        except Exception as e:
            print(f"Error updating state: {e}")
            return False

    def delete_session(self, session_id: str) -> bool:
        """Deletes a session's context from Redis."""
        if not self.client:
            return False
        try:
            key = f"session:{session_id}:context"
            self.client.delete(key)
            return True
        except Exception as e:
            print(f"Error deleting session: {e}")
            return False

    def session_exists(self, session_id: str) -> bool:
        """Checks if a session context exists in Redis."""
        if not self.client:
            return False
        key = f"session:{session_id}:context"
        return self.client.exists(key) > 0

# Singleton instance for easy access throughout the application
redis_client = RedisClient()