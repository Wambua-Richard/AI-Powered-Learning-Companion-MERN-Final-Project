import api from "../utils/api";

export const askAI = async (message) => {
  const res = await api.post("/ai/ask", { message });
  return res.data.reply;
};
