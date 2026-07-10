import api from "../api/axios";

export interface DashboardData {
    total_servers: number;
    active_servers: number;
    offline_servers: number;
    total_threats: number;
    high_risk_alerts: number;
    cpu_usage: number;
    memory_usage: number;
    storage_usage: number;
    network_usage: number;
    prediction_accuracy: number;
}

export interface ThreatHistory {
  day: string;
  threats: number;
}

export interface CloudUsage {
  resource: string;
  value: number;
}

export interface PredictionDistribution {
  name: string;
  value: number;
}

export async function getDashboardData(): Promise<DashboardData> {
  const response = await api.get("/dashboard");
  return response.data;
}

export async function getThreatHistory(): Promise<ThreatHistory[]> {
  const response = await api.get("/dashboard/threat-history");
  return response.data;
}

export async function getCloudUsage(): Promise<CloudUsage[]> {
  const response = await api.get("/dashboard/cloud-usage");
  return response.data;
}

export async function getPredictionDistribution(): Promise<
  PredictionDistribution[]
> {
  const response = await api.get("/dashboard/prediction-distribution");
  return response.data;
}

// ==============================
// Threat Severity
// ==============================

export interface ThreatSeverity {
  severity: string;
  count: number;
}

export async function getThreatSeverity(): Promise<ThreatSeverity[]> {
  const response = await api.get("/dashboard/threat-severity");
  return response.data;
}