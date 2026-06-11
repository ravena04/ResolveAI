def categorize_ticket(description: str):
    text = description.lower()

    category = "Other"
    priority = "Medium"

    if "vpn" in text or "network" in text:
        category = "Network"

    elif "laptop" in text or "keyboard" in text:
        category = "Hardware"

    elif "software" in text or "application" in text:
        category = "Software"

    elif "login" in text or "access" in text:
        category = "Access"

    if (
        "urgent" in text
        or "critical" in text
    ):
        priority = "Critical"

    return {
        "category": category,
        "priority": priority,
    }