import { api } from "./api";

export const adService = {
  // Listar todas as ads (ativas por padrão)
  getActiveAds: async () => {
    try {
      const response = await api.get("/ads/", {
        params: { ativo_only: true },
      });
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar ads:", error);
      throw error;
    }
  },

  // Pegar uma ad por ID
  getAdById: async (adId) => {
    try {
      const response = await api.get(`/ads/${adId}`);
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar ad por ID:", error);
      throw error;
    }
  },

  // Pegar ad aleatória
  getRandomAd: async () => {
    try {
      const response = await api.get("/ads/random");
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar ad aleatória:", error);
      return null;
    }
  },

  // Criar nova ad
  createAd: async (adData) => {
    try {
      const response = await api.post("/ads/", adData);
      return response.data;
    } catch (error) {
      console.error("Erro ao criar ad:", error);
      throw error;
    }
  },

  // Atualizar ad existente
  updateAd: async (adId, adData) => {
    try {
      const response = await api.put(`/ads/${adId}`, adData);
      return response.data;
    } catch (error) {
      console.error("Erro ao atualizar ad:", error);
      throw error;
    }
  },

  // Deletar ad
  deleteAd: async (adId) => {
    try {
      await api.delete(`/ads/${adId}`);
      return true;
    } catch (error) {
      console.error("Erro ao deletar ad:", error);
      throw error;
    }
  },
};
