import { api, setAuthToken } from "./api";

const TOKEN_KEY = "admin_token";

export function getToken() { return localStorage.getItem(TOKEN_KEY); }
export function saveToken(token) { 
  localStorage.setItem(TOKEN_KEY, token);
  setAuthToken(token); 
}
export function clearToken() { 
  localStorage.removeItem(TOKEN_KEY);
  setAuthToken(null); 
}

export async function adminLogin(email, password) {
  const { data } = await api.post("/admin/auth/login", { email, password });
  saveToken(data.access_token);
  return data;
}

export async function adminMe() {
  const { data } = await api.get("/admin/me");
  return data;
}

// 🔥 RESET SENHA - NOVO
export async function resetPasswordRequest(email) {
  const { data } = await api.post("/admin/auth/reset-password/request", { email });
  return data.message;
}

export async function resetPasswordConfirm(token, password) {
  const { data } = await api.post("/admin/auth/reset-password/confirm", { token, password });
  clearToken();
  return data.message;
}

// 🔥 REGISTER - NOVO
export async function adminRegister(data) {
  const { data: result } = await api.post("/admin/auth/register", data);
  return result;
}

export async function adminRegisterByAdmin(data) {
  const { data: result } = await api.post("/admin/auth/register-by-admin", data);
  return result;
}
