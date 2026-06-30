export interface Attack {
  id: number;
  attack_type: string;
  source_ip: string;
  destination_ip: string;
  timestamp: string;
  severity: string;
  status: string;
  user_id: number;
}

export interface Prediction {
  id: number;
  prediction_result: string;
  confidence: number;
  attack_type: string;
 timestamp: string;
}

export interface CloudStatus {
  provider: string;
  instances: number;
  running: number;
  stopped: number;
}

export interface Report {
  id: number;
  title: string;
  date: string;
  summary: string;
}

export interface User {
    id: number;
    name: string;
    email: string;
}
