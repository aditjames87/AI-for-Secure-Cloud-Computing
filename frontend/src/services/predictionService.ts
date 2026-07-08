import api from "./api";

export interface Prediction {
  id: number;
  threat_id: number;
  prediction: string;
  confidence: number;
  created_at: string;
}

export const getPredictions = async (): Promise<Prediction[]> => {
  const response = await api.get<Prediction[]>("/api/v1/prediction");
  console.log("Response data:", response.data);
  console.log("Is Array:", Array.isArray(response.data));
  console.log("Full Response:", response);
  return response.data;
};