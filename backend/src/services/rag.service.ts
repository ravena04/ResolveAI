import axios from "axios";

const AI_URL =
  process.env.AI_SERVICE_URL ||
  "http://localhost:8000";

export const addToVectorDB =
  async (
    id: string,
    title: string,
    content: string
  ) => {
    try {
      await axios.post(
        `${AI_URL}/kb/add`,
        {
          id,
          title,
          content,
        }
      );

      console.log(
        "Knowledge article added to ChromaDB"
      );
    } catch (error) {
      console.error(
        "ChromaDB Error:",
        error
      );
    }
  };