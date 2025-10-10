from textblob import TextBlob
from models.schemas import SentimentType, ResponseQuality
from typing import Tuple
import config

def analyze_sentiment(text: str) -> SentimentType:
    """
    Analyzes the sentiment of a given text using TextBlob's polarity score.

    Args:
        text: The input string to analyze.

    Returns:
        A SentimentType enum (POSITIVE, NEGATIVE, or NEUTRAL).
    """
    blob = TextBlob(text)
    polarity = blob.sentiment.polarity

    if polarity > 0.1:
        return SentimentType.POSITIVE
    elif polarity < -0.1:
        return SentimentType.NEGATIVE
    else:
        return SentimentType.NEUTRAL

def assess_response_quality(text: str) -> Tuple[ResponseQuality, int]:
    """
    Assesses the quality of a response based on word count and vagueness.

    Args:
        text: The user's response text.

    Returns:
        A tuple containing the ResponseQuality enum and the word count.
    """
    words = text.split()
    word_count = len(words)

    # 1. Check for shallow response (too few words) based on config
    if word_count < config.SHALLOW_RESPONSE_MIN_WORDS:
        return ResponseQuality.SHALLOW, word_count

    # 2. Check for vague responses using a list of common indicators
    vague_indicators = [
        "maybe", "kind of", "sort of", "i guess",
        "probably", "i think", "not sure", "whatever"
    ]

    text_lower = text.lower()
    vague_count = sum(1 for indicator in vague_indicators if indicator in text_lower)

    # Calculate vagueness as a ratio to the total word count
    vagueness_ratio = vague_count / max(word_count, 1)

    if vagueness_ratio > config.VAGUE_RESPONSE_THRESHOLD:
        return ResponseQuality.VAGUE, word_count

    # If neither shallow nor vague, the quality is good
    return ResponseQuality.GOOD, word_count

def extract_key_phrases(text: str, top_n: int = 5) -> list:
    """
    Extracts the most relevant noun phrases from a text.

    Args:
        text: The input text.
        top_n: The maximum number of phrases to return.

    Returns:
        A list of unique key phrases.
    """
    blob = TextBlob(text)
    # Using noun phrases is a good heuristic for identifying key topics
    noun_phrases = list(blob.noun_phrases)
    # Return a unique set of the top N phrases
    return list(set(noun_phrases))[:top_n]

def is_probe_trigger(text: str, trigger_words: list) -> bool:
    """
    Checks if a response contains any predefined words that should trigger a probe.

    Args:
        text: The user's response text.
        trigger_words: A list of words to check for.

    Returns:
        True if a trigger word is found, False otherwise.
    """
    text_lower = text.lower()
    return any(trigger.lower() in text_lower for trigger in trigger_words)
