import axios from "../api/axios";
import type { Attack } from "../types";

export const getThreats = async (): Promise<Attack[]> => {
  const response = await axios.get("/threats/");
  return response.data;
};
