// src/services/bootstrapAuth.js
import { getToken } from "./auth";
import { setAuthToken } from "./api";

export function bootstrapAuth() {
  const token = getToken();
  if (token) setAuthToken(token);
}