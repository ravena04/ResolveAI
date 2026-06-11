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
      "AI Service Error:",
      error
    );

    return {
      category: "Other",
      priority: "Medium",
    };
  }
};