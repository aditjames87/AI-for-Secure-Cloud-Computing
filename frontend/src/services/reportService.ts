import axios from "../api/axios";
import type { Report } from "../types";

export const getReports = async (): Promise<Report[]> => {
  const { data } = await axios.get<Report[]>("/reports/");
  return data;
};