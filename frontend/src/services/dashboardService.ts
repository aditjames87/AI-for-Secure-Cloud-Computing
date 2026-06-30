import api from "../api/axios";

export interface DashboardData {
  active_servers: number;
  threats_detected: number;
  high_risk_alerts: number;
  cpu_usage: number;
  memory_usage: number;
  prediction_accuracy: number;
}

export async function getDashboardData(): Promise<DashboardData> {
  const response = await api.get("/dashboard");
  return response.data;
}
