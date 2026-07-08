export interface Threat {
  id: number;
  server_name: string;
  threat_type: string;
  risk_level: string;
  timestamp: string | null;
  status: string;
  source_ip: string;
  description: string;
  details: Record<string, unknown>;
}