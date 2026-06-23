import chromadb
from sentence_transformers import SentenceTransformer
from services.groq_service import (
    generate_rag_response
)

client = chromadb.PersistentClient(
    path="./chroma_db"
)

collection = client.get_or_create_collection(
    name="knowledge_base"
)

model = None


def get_model():
    global model

    if model is None:
        model = SentenceTransformer(
            "all-MiniLM-L6-v2"
        )

    return model


def add_document(
    doc_id: str,
    title: str,
    content: str
):
    text = f"{title}\n{content}"

    embedding_model = get_model()

    embedding = embedding_model.encode(
        text
    ).tolist()

    collection.add(
        ids=[doc_id],
        documents=[text],
        embeddings=[embedding]
    )

    return {
        "success": True
    }


def search_documents(
    query: str,
    limit: int = 3
):
    embedding_model = get_model()

    query_embedding = (
        embedding_model.encode(
            query
        ).tolist()
    )

    results = collection.query(
        query_embeddings=[
            query_embedding
        ],
        n_results=limit
    )

    return results


def generate_solution(
    query: str
):
    results = search_documents(
        query
    )

    documents = results.get(
        "documents",
        [[]]
    )[0]

    kb_context = "\n\n".join(
        documents
    )

    answer = generate_rag_response(
        query,
        kb_context
    )

    return {
        "query": query,
        "context": documents,
        "answer": answer
    }


def find_similar_tickets(
    query: str,
    limit: int = 5
):
    results = search_documents(
        query,
        limit
    )

    documents = results.get(
        "documents",
        [[]]
    )[0]

    distances = results.get(
        "distances",
        [[]]
    )[0]

    return {
        "query": query,
        "similarTickets": documents,
        "scores": distances
    }