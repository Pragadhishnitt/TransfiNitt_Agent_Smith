"""
Early Termination Detector - Detects when user wants to end interview
"""

from typing import List, Dict, Tuple

class EarlyTerminationDetector:
    """Detects signals that user wants to end the interview"""
    
    EXIT_PHRASES = [
        "end this", "end here", "end now", "just end", "lets end", "let's end",
        "stop this", "stop here", "stop now", "finish this", "finish here",
        "conclude", "wrap up", "wrap this up", "stop the interview", 
        "end the interview", "quit the interview", "exit the interview",
        "i want to stop", "i'd like to stop", "i want to end",
        "can we stop", "can we end", "i'm done", "i am done", "im done",
        "that's all", "thats all", "that is all", "no more questions", "no more",
        "i don't want to continue", "i dont want to continue",
        "don't want to continue", "dont want to continue", "not continuing",
        "this is taking too long", "too long", "taking forever", "no time",
        "don't have time", "dont have time", "i'm tired of this", 
        "im tired of this", "tired of this", "fed up", "enough",
        "that's enough", "thats enough",
    ]
    
    NEGATIVE_EMOTION_PHRASES = [
        "not feeling good", "feeling bad", "feeling uncomfortable",
        "this is uncomfortable", "i'm not comfortable", "im not comfortable",
        "not comfortable", "i feel bad", "i'm feeling bad", "not enjoying this",
        "this is annoying", "this is frustrating", "i'm frustrated",
        "im frustrated", "frustrated", "i don't like this", "i dont like this",
        "dont like this", "this is boring", "i'm bored", "im bored", "bored",
        "waste of time", "wasting my time", "not interested",
    ]
    
    DISMISSIVE_RESPONSES = [
        "yeah", "yea", "yep", "ok", "okay", "fine", "whatever",
        "sure", "meh", "nah", "nope"
    ]
    
    def check_exit_intent(self, text: str) -> Tuple[bool, str]:
        """Check if user wants to exit the interview."""
        text_lower = text.lower().strip()
        
        # Check for explicit exit phrases
        for phrase in self.EXIT_PHRASES:
            if phrase in text_lower:
                return True, f"explicit_exit: '{phrase}'"
        
        # Check for negative emotions
        for phrase in self.NEGATIVE_EMOTION_PHRASES:
            if phrase in text_lower:
                return True, f"negative_emotion: '{phrase}'"
        
        return False, ""
    
    def is_very_short_negative(self, text: str, sentiment: str) -> bool:
        """Check if response is very short AND negative"""
        word_count = len(text.split())
        return word_count <= 2 and sentiment == "negative"
    
    def is_repeated_dismissive(
        self, 
        text: str, 
        conversation_history: List[Dict], 
        threshold: int = 2
    ) -> bool:
        """Check if user has given multiple dismissive responses in a row."""
        text_lower = text.lower().strip()
        
        # Check if current response is dismissive
        current_is_dismissive = (
            any(d in text_lower for d in self.DISMISSIVE_RESPONSES) or 
            len(text.split()) <= 2
        )
        
        if not current_is_dismissive:
            return False
        
        # Count recent consecutive dismissive responses
        dismissive_count = 1  # Current response
        
        # Look at last few user responses
        user_responses = [
            msg.get("content", msg.get("message", ""))
            for msg in reversed(conversation_history)
            if msg.get("role") == "user"
        ][1:5]  # Skip current, check last 4
        
        for response in user_responses:
            response_lower = response.lower().strip()
            is_dismissive = (
                any(d in response_lower for d in self.DISMISSIVE_RESPONSES) or
                len(response.split()) <= 2
            )
            
            if is_dismissive:
                dismissive_count += 1
            else:
                break  # Stop at first non-dismissive
        
        return dismissive_count >= threshold
    
    def should_terminate(
        self, 
        text: str, 
        sentiment: str,
        conversation_history: List[Dict],
        consecutive_probes: int = 0,
        max_probes: int = 3
    ) -> Tuple[bool, str]:
        """
        Comprehensive termination check.
        Returns: (should_terminate, reason)
        """
        # Check 1: Explicit exit intent
        should_exit, reason = self.check_exit_intent(text)
        if should_exit:
            return True, reason
        
        # Check 2: Max consecutive probes reached
        if consecutive_probes >= max_probes:
            return True, f"probe_limit_reached: {consecutive_probes} consecutive probes"
        
        # Check 3: Very short + negative
        if self.is_very_short_negative(text, sentiment):
            return True, "disengagement: very short negative response"
        
        # Check 4: Repeated dismissive responses
        if self.is_repeated_dismissive(text, conversation_history, threshold=3):
            return True, "disengagement: repeated dismissive responses"
        
        return False, ""

# Singleton instance
early_termination_detector = EarlyTerminationDetector()