from typing import Dict
from models.schemas import InterviewTemplate

# Default Interview Templates defined using the Pydantic model for type safety and validation.
# These will be used to populate the database on the first startup.

COFFEE_CONSUMPTION_TEMPLATE = InterviewTemplate(
    template_id="coffee-001",
    research_topic="Coffee consumption habits",
    starter_questions=[
        "Tell me about your morning routine.",
        "How do you typically consume caffeine?",
        "What role does coffee play in your daily life?"
    ],
    probe_triggers=["interesting", "rarely", "always", "sometimes", "never", "hate", "love"],
    max_questions=15,
    user_type="coffee_drinker",
    # FIX: Changed from "system" to None, as the 'created_by' column expects a UUID or NULL.
    created_by=None
)

PRODUCT_FEEDBACK_TEMPLATE = InterviewTemplate(
    template_id="product-001",
    research_topic="Product usage feedback",
    starter_questions=[
        "What first brought you to try our product?",
        "Can you walk me through your experience using it for the first time?",
        "What were your initial expectations before you started?"
    ],
    probe_triggers=["confusing", "difficult", "easy", "love", "hate", "frustrating", "seamless"],
    max_questions=12,
    user_type="product_user",
    # FIX: Changed from "system" to None.
    created_by=None
)

WELLNESS_HABITS_TEMPLATE = InterviewTemplate(
    template_id="wellness-001",
    research_topic="Daily wellness and self-care habits",
    starter_questions=[
        "How do you typically start your day to set a positive tone?",
        "What does the idea of 'self-care' mean to you personally?",
        "Can you tell me about your journey with wellness?"
    ],
    probe_triggers=["stress", "relaxation", "balance", "challenging", "mindfulness", "burnout"],
    max_questions=15,
    user_type="wellness_seeker",
    # FIX: Changed from "system" to None.
    created_by=None
)

# A registry of all default templates to be loaded into the database.
TEMPLATE_REGISTRY: Dict[str, InterviewTemplate] = {
    COFFEE_CONSUMPTION_TEMPLATE.template_id: COFFEE_CONSUMPTION_TEMPLATE,
    PRODUCT_FEEDBACK_TEMPLATE.template_id: PRODUCT_FEEDBACK_TEMPLATE,
    WELLNESS_HABITS_TEMPLATE.template_id: WELLNESS_HABITS_TEMPLATE
}

