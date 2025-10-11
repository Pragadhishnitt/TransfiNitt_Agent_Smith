"""
Early termination detection for interviews.
Detects when user wants to end the interview early.
"""

import re
from typing import Tuple, List, Dict

class EarlyTerminationDetector:
    """Detects signals that user wants to end the interview"""
    
    # Exit phrases that clearly indicate wanting to stop
    EXIT_PHRASES = [
        # Direct exit commands
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
    
    # Short dismissive responses
    DISMISSIVE_RESPONSES = [
        "yeah", "yea", "yep", "ok", "okay", "fine", "whatever",
        "sure", "meh", "nah", "nope"
    ]
    
    # Resistant/defensive responses
    RESISTANT_PHRASES = [
        "why you need",
        "why do you need",
        "why you asking",
        "why are you asking",
        "none of your business",
        "dont want to say",
        "don't want to say",
        "no i cant",
        "no i can't",
        "i cant",
        "i can't",
        "cant tell you",
        "can't tell you",
        "wont tell",
        "won't tell"
    ]
    
    def check_exit_intent(self, text: str) -> Tuple[bool, str]:
        """
        Check if user wants to exit the interview.
        Returns: (should_exit, reason)
        """
        text_lower = text.lower().strip()
        
        # Check for explicit exit phrases
        for phrase in self.EXIT_PHRASES:
            if phrase in text_lower:
                return True, f"explicit_exit: '{phrase}'"
        
        # Check for "no" + exit words together
        if "no" in text_lower:
            exit_words = ["end", "stop", "finish", "quit", "done", "conclude", "wrap"]
            for word in exit_words:
                if word in text_lower:
                    return True, f"negative_exit: 'no + {word}'"
        
        # Check for negative emotions
        for phrase in self.NEGATIVE_EMOTION_PHRASES:
            if phrase in text_lower:
                return True, f"negative_emotion: '{phrase}'"
        
        # Check for strong negative sentiment
        word_count = 0
        words = text_lower.split()
        for word in self.STRONG_NEGATIVE_WORDS:
            if word in words:
                word_count += 1
        
        if word_count >= 2:
            return True, f"strong_negative_sentiment: {word_count} negative words"
        
        return False, ""
    
    def is_very_short_negative(self, text: str, sentiment: str) -> bool:
        """
        Check if response is very short AND negative
        (might indicate disengagement)
        """
        word_count = len(text.split())
        return word_count <= 2 and sentiment == "negative"
    
    def is_repeated_dismissive(
        self, 
        text: str, 
        conversation_history: List[Dict[str, str]], 
        threshold: int = 2
    ) -> bool:
        """
        Check if user has given multiple dismissive responses in a row.
        
        Args:
            text: Current user response
            conversation_history: Full conversation history
            threshold: Number of consecutive dismissive responses to trigger
        
        Returns:
            True if user has given threshold+ dismissive responses in a row
        """
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
        
        # Look at last few user responses (not assistant)
        user_responses = [
            msg["content"] for msg in reversed(conversation_history)
            if msg.get("role") == "user"
        ][1:5]  # Skip current (already counted), check last 4
        
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
    
    def is_resistant(self, text: str) -> bool:
        """
        Check if response shows resistance/defensiveness.
        Returns True if resistant (but doesn't terminate - just flags it)
        """
        text_lower = text.lower().strip()
        
        for phrase in self.RESISTANT_PHRASES:
            if phrase in text_lower:
                return True
        
        return False
    
    def should_terminate(
        self, 
        text: str, 
        sentiment: str,
        conversation_history: List[Dict[str, str]],
        probe_count: int = 0
    ) -> Tuple[bool, str]:
        """
        COMPREHENSIVE termination check that considers multiple signals.
        
        This is the main method to call.
        
        Args:
            text: Current user response
            sentiment: Sentiment of response (positive/negative/neutral)
            conversation_history: Full conversation history
            probe_count: Number of consecutive probes
        
        Returns:
            Tuple of (should_terminate, reason)
        """
        # Check 1: Explicit exit intent (highest priority)
        should_exit, reason = self.check_exit_intent(text)
        if should_exit:
            return True, reason
        
        # Check 2: Very short + negative (strong signal)
        if self.is_very_short_negative(text, sentiment):
            return True, "disengagement: very short negative response"
        
        # Check 3: Repeated dismissive responses
        if self.is_repeated_dismissive(text, conversation_history, threshold=2):
            return True, "disengagement: repeated dismissive responses"
        
        # Check 4: Probe fatigue (too many probes + still short)
        if probe_count >= 2 and len(text.split()) <= 3:
            return True, "probe_fatigue: multiple probes with continued short responses"
        
        return False, ""

# Singleton instance
early_termination_detector = EarlyTerminationDetector()
