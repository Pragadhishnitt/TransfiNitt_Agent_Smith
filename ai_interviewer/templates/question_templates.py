from typing import Dict, List

# Question templates based on user type and stage
STARTING_QUESTIONS: Dict[str, List[str]] = {
    "coffee_drinker": [
        "Tell me about your morning routine",
        "How do you typically consume caffeine?",
        "What role does coffee play in your daily life?"
    ],
    "product_user": [
        "What brought you to try our product?",
        "Tell me about your experience using it for the first time",
        "What were your initial expectations?"
    ],
    "wellness_seeker": [
        "How do you typically start your day?",
        "What does self-care mean to you?",
        "Tell me about your wellness journey"
    ],
    "default": [
        "Tell me a bit about yourself",
        "What brings you here today?",
        "Can you share your thoughts on this topic?"
    ]
}

# Follow-up question templates
FOLLOW_UP_TEMPLATES: Dict[str, List[str]] = {
    "elaborate": [
        "Can you tell me more about that?",
        "That's interesting! Could you elaborate?",
        "I'd love to hear more details about {topic}"
    ],
    "clarify": [
        "What did you mean by {keyword}?",
        "Could you clarify what you meant when you said {phrase}?",
        "Help me understand {topic} better"
    ],
    "deeper": [
        "What makes you feel that way?",
        "Why is that important to you?",
        "How does that impact your daily life?"
    ],
    "contrast": [
        "How does that compare to your previous experience?",
        "What would be different if {condition}?",
        "Have you noticed any changes over time?"
    ]
}

# Probe templates for vague responses
PROBE_TEMPLATES: List[str] = [
    "Could you give me a specific example of that?",
    "Tell me more about what you mean by that",
    "Can you walk me through a recent time when that happened?",
    "What specifically about {topic} stands out to you?",
    "Help me understand - what does {keyword} look like in practice?"
]

# Closing question templates
CLOSING_QUESTIONS: List[str] = [
    "Is there anything else you'd like to share about {topic}?",
    "What's one thing you wish more people understood about this?",
    "Looking back on our conversation, what feels most important to mention?",
    "Any final thoughts you'd like to add?"
]

def get_starting_question(user_type: str = "default", index: int = 0) -> str:
    """Get a starting question based on user type"""
    questions = STARTING_QUESTIONS.get(user_type, STARTING_QUESTIONS["default"])
    return questions[min(index, len(questions) - 1)]

def get_probe_question(keyword: str = "") -> str:
    """Get a probe question, optionally with keyword substitution"""
    import random
    template = random.choice(PROBE_TEMPLATES)
    if keyword and "{topic}" in template:
        return template.replace("{topic}", keyword)
    elif keyword and "{keyword}" in template:
        return template.replace("{keyword}", keyword)
    return template

def get_follow_up(category: str, **kwargs) -> str:
    """Get a follow-up question from a specific category"""
    import random
    templates = FOLLOW_UP_TEMPLATES.get(category, FOLLOW_UP_TEMPLATES["elaborate"])
    template = random.choice(templates)
    
    # Replace placeholders
    for key, value in kwargs.items():
        template = template.replace(f"{{{key}}}", str(value))
    
    return template