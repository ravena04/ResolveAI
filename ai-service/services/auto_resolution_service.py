def should_auto_resolve(
    confidence: float,
    rag_context_count: int
):
    if confidence >= 90 and rag_context_count > 0:
        return {
            "autoResolve": True
        }

    return {
        "autoResolve": False
    }