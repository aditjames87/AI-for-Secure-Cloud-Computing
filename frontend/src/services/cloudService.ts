import axios from "../api/axios";
import type { CloudStatus } from "../types";

export const getCloudStatus = async (): Promise<CloudStatus> => {
  const response = await axios.get("/cloud/");
  return response.data;
};
