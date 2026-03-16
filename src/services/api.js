// src/services/api.js
import axios from "axios";

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://penademorte.org/api";

export const api = axios.create({
  baseURL: API_BASE_URL,
});

export function setAuthToken(token) {
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common.Authorization;
  }
}
