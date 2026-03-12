import { api } from "./api";

export const questionService = {
  // Lista TODAS as perguntas
  getAllQuestions: async () => {
    try {
      const response = await api.get("/survey/questions");
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar perguntas:", error);
      return [];
    }
  },

  // Pegar próxima pergunta
  getNextQuestion: async (userId) => {
    try {
      const response = await api.get("/survey/questions/next", {
        params: { userid: userId },
      });
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar próxima pergunta:", error);
      throw error;
    }
  },

  // Pegar estado do survey
  getSurveyState: async (userId) => {
    try {
      const response = await api.get("/survey/state", {
        params: { userid: userId },
      });
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar estado do survey:", error);
      throw error;
    }
  },
};
