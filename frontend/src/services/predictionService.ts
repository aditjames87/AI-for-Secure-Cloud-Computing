import axios from "../api/axios";
import type { Prediction } from "../types";

export const getPredictions = async (): Promise<Prediction[]> => {
  const { data } = await axios.get<Prediction[]>("/prediction/");
  return data;
};