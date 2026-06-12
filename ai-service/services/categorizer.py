from services.groq_service import classify_ticket
import json

def categorize(description: str):

    result = classify_ticket(description)

    try:
        return json.loads(result)
    except:
        return {
            "category": "Other",
            "priority": "Medium"
        }