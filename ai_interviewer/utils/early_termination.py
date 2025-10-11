"""
Early termination detection for interviews.
Detects when user wants to end the interview early.
"""

import re
from typing import Tuple

class EarlyTerminationDetector:
    """Detects signals that user wants to end the interview"""
    
    # UPDATED: More casual and flexible exit phrases
    EXIT_PHRASES = [
        # Direct exit commands (most common)
        "end this",
        "end here",
        "end now",
        "just end",
        "lets end",
        "let's end",
        "stop this",
        "stop here",
        "stop now",
        "finish this",
        "finish here",
        "conclude",
        "wrap up",
        "wrap this up",
        
        # Explicit stop phrases
        "stop the interview",
        "end the interview",
        "quit the interview",
        "exit the interview",
        "i want to stop",
        "i'd like to stop",
        "i want to end",
        "can we stop",
        "can we end",
        
        # Done/finished phrases
        "i'm done",
        "i am done",
        "im done",
        "that's all",
        "thats all",
        "that is all",
        "no more questions",
        "no more",
        
        # Don't want to continue
        "i don't want to continue",
        "i dont want to continue",
        "don't want to continue",
        "dont want to continue",
        "not continuing",
        
        # Time-related exits
        "this is taking too long",
        "too long",
        "taking forever",
        "no time",
        "don't have time",
        "dont have time",
        
        # Frustrated exits
        "i'm tired of this",
        "im tired of this",
        "tired of this",
        "fed up",
        "enough",
        "that's enough",
        "thats enough",
    ]
    
    # Negative emotion phrases
    NEGATIVE_EMOTION_PHRASES = [
        "not feeling good",
        "feeling bad",
        "feeling uncomfortable",
        "this is uncomfortable",
        "i'm not comfortable",
        "im not comfortable",
        "not comfortable",
        "i feel bad",
        "i'm feeling bad",
        "not enjoying this",
        "this is annoying",
        "this is frustrating",
        "i'm frustrated",
        "im frustrated",
        "frustrated",
        "i don't like this",
        "i dont like this",
        "dont like this",
        "this is boring",
        "i'm bored",
        "im bored",
        "bored",
        "waste of time",
        "wasting my time",
        "not interested",
    ]
    
    # Strong negative sentiment words
    STRONG_NEGATIVE_WORDS = [
        "hate", "awful", "terrible", "horrible", "worst",
        "annoyed", "angry", "upset", "stressed", "anxious"
    ]
    
    # NEW: Short dismissive responses that indicate wanting to end
    DISMISSIVE_RESPONSES = [
        "yeah", "yea", "yep", "ok", "okay", "fine", "whatever",
        "sure", "meh", "nah", "nope"
    ]
    
    def check_exit_intent(self, text: str) -> Tuple[bool, str]:
        """
        Check if user wants to exit the interview.
        Returns: (should_exit, reason)
        """
        text_lower = text.lower().strip()
        
        # STRATEGY 1: Check for explicit exit phrases (most reliable)
        for phrase in self.EXIT_PHRASES:
            if phrase in text_lower:
                return True, f"explicit_exit: '{phrase}'"
        
        # STRATEGY 2: Check for "no" + exit words together
        # e.g., "no just end", "no stop", "no finish"
        if "no" in text_lower:
            exit_words = ["end", "stop", "finish", "quit", "done", "conclude", "wrap"]
            for word in exit_words:
                if word in text_lower:
                    return True, f"negative_exit: 'no + {word}'"
        
        # STRATEGY 3: Check for negative emotions
        for phrase in self.NEGATIVE_EMOTION_PHRASES:
            if phrase in text_lower:
                return True, f"negative_emotion: '{phrase}'"
        
        # STRATEGY 4: Check for strong negative sentiment (multiple negative words)
        word_count = 0
        words = text_lower.split()
        for word in self.STRONG_NEGATIVE_WORDS:
            if word in words:
                word_count += 1
        
        if word_count >= 2:  # Multiple strong negative words
            return True, f"strong_negative_sentiment: {word_count} negative words"
        
        return False, ""
    
    def is_very_short_negative(self, text: str, sentiment: str) -> bool:
        """
        Check if response is very short AND negative
        (might indicate disengagement)
        """
        word_count = len(text.split())
        return word_count <= 2 and sentiment == "negative"
    
    def is_repeated_dismissive(self, text: str, conversation_history: list, threshold: int = 2) -> bool:
        """
        NEW: Check if user has given multiple dismissive responses in a row.
        This indicates they want to end but aren't being explicit.
        
        Args:
            text: Current user response
            conversation_history: Full conversation history
            threshold: Number of consecutive dismissive responses to trigger (default 2)
        
        Returns:
            True if user has given multiple dismissive responses in a row
        """
        text_lower = text.lower().strip()
        
        # Check if current response is dismissive
        current_is_dismissive = any(
            dismissive in text_lower 
            for dismissive in self.DISMISSIVE_RESPONSES
        ) or len(text.split()) <= 2
        
        if not current_is_dismissive:
            return False
        
        # Count recent consecutive dismissive responses from user
        dismissive_count = 1  # Current response
        
        # Look at last N user responses (not assistant)
        user_responses = [
            msg["content"] for msg in reversed(conversation_history)
            if msg.get("role") == "user"
        ][1:5]  # Skip current (already in history), check last 4
        
        for response in user_responses:
            response_lower = response.lower().strip()
            is_dismissive = (
                any(d in response_lower for d in self.DISMISSIVE_RESPONSES) or
                len(response.split()) <= 2
            )
            
            if is_dismissive:
                dismissive_count += 1
            else:
                break  # Stop at first non-dismissive response
        
        return dismissive_count >= threshold
    
    def should_terminate(
        self, 
        text: str, 
        sentiment: str,
        conversation_history: list,
        probe_count: int = 0
    ) -> Tuple[bool, str]:
        """
        COMPREHENSIVE termination check that considers multiple signals.
        
        This is the main method that should be called.
        
        Returns: (should_terminate, reason)
        """
        # Check 1: Explicit exit intent (highest priority)
        should_exit, reason = self.check_exit_intent(text)
        if should_exit:
            return True, reason
        
        # Check 2: Very short + negative (strong signal)
        if self.is_very_short_negative(text, sentiment):
            return True, "disengagement: very short negative response"
        
        # Check 3: Repeated dismissive responses (user is being polite but wants to stop)
        if self.is_repeated_dismissive(text, conversation_history, threshold=2):
            return True, "disengagement: repeated dismissive responses"
        
        # Check 4: User has been probed too many times and still giving short responses
        # This prevents the "probe death loop"
        if probe_count >= 2 and len(text.split()) <= 3:
            return True, "probe_fatigue: multiple probes with continued short responses"
        
        return False, ""

# Singleton instance
early_termination_detector = EarlyTerminationDetector()