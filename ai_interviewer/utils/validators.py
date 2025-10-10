import re
from typing import Optional

def is_valid_uuid(uuid_to_test: str) -> bool:
    """
    Validates if the given string is a valid UUID.

    Args:
        uuid_to_test: The string to validate.

    Returns:
        True if the string is a valid UUID, False otherwise.
    """
    # A simple regex for UUID format. For strict validation, the `uuid` library is better.
    pattern = re.compile(
        r'^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\Z', re.I
    )
    return bool(pattern.match(uuid_to_test))

def is_valid_message(message: str) -> bool:
    """
    Validates that a message is not None, empty, or just whitespace.

    Args:
        message: The message string from the user.

    Returns:
        True if the message is valid, False otherwise.
    """
    return bool(message and not message.isspace())

def sanitize_input(text: str) -> str:
    """
    A basic input sanitizer to remove potentially harmful characters.
    (This should be expanded based on security requirements).

    Args:
        text: The input text.

    Returns:
        A sanitized version of the text.
    """
    # For now, just strip leading/trailing whitespace.
    # More complex sanitization (e.g., for HTML, SQL) could be added here.
    return text.strip()
