import chromadb
from sentence_transformers import SentenceTransformer

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