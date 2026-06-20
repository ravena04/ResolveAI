import axios from "axios";

const AI_URL =
  process.env.AI_SERVICE_URL ||
  "http://localhost:8000";

export const categorizeTicket = async (
  description: string
) => {
  try {
    const response =
      await axios.post(
        `${AI_URL}/categorize`,
        {
          description,
        }
      );

    return response.data;
  } catch (error) {
    console.error(
      "AI Categorization Error:",
      error
    );

    return {
      category: "Other",
      priority: "Medium",
    };
  }
};

export const getAISuggestion = async (
  description: string
) => {
  try {
    const response =
      await axios.post(
        `${AI_URL}/suggest`,
        {
          description,
        }
      );

    return response.data;
  } catch (error) {
    console.error(
      "AI Suggestion Error:",
      error
    );

    return {
      suggestion:
        "No AI suggestion available.",
      confidence: 0,
    };
  }
};

export const getRAGSolution = async (
  description: string
) => {
  try {
    const response =
      await axios.post(
        `${AI_URL}/kb/solution`,
        {
          query: description,
        }
      );

    return response.data;
  } catch (error) {
    console.error(
      "RAG Solution Error:",
      error
    );

    return {
      answer:
        "No RAG solution available.",
      context: [],
    };
  }
};