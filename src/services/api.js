import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_BACKEND_BASE_URL || "http://localhost:5004"; // Update if needed

export const sendMessage = async (message) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/ai/chat`, { message });
    return response.data.reply;
  } catch (error) {
    console.error("Error sending message:", error);
    throw error;
  }
};

export const analyzeImage = async (imageBase64) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/ai/analyze-image-base64`, { image_base64: imageBase64 });
    return response.data.reply;
  } catch (error) {
    console.error("Error analyzing image:", error);
    throw error;
  }
};
