export interface Threat {
  id: number;
  attack_type: string;
  source_ip: string;
  destination_ip: string;
  severity: string;
  status: string;
  timestamp: string | null;
}