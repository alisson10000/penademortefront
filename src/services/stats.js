import { api } from "./api";

export async function getAdminStatsOverview() {
  // swagger mostrou: /admin/stats/overview
  const { data } = await api.get("/admin/stats/overview");
  return data;
}