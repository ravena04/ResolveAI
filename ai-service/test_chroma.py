from services.rag_service import (
    collection,
    model
)

text = "Restart VPN service and recreate VPN profile."

embedding = model.encode(
    text
).tolist()

collection.add(
    ids=["1"],
    documents=[text],
    embeddings=[embedding]
)

query_embedding = model.encode(
    "VPN not working"
).tolist()

results = collection.query(
    query_embeddings=[
        query_embedding
    ],
    n_results=1
)

print(results)