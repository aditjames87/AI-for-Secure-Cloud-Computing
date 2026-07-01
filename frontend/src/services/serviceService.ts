import api from "../api/axios";

export interface Server {
  id: number;
  server_name: string;
  ip_address: string;
  operating_system: string;
  cpu_usage: number;
  memory_usage: number;
  status: string;
}

export interface CreateServer {
  server_name: string;
  ip_address: string;
  operating_system: string;
}

// GET
export const getServers = async (): Promise<Server[]> => {
  const res = await api.get("/servers/");
  return res.data;
};

// POST
export const createServer = async (
  data: CreateServer
): Promise<Server> => {
  const res = await api.post("/servers/", data);
  return res.data;
};

// DELETE
export const deleteServer = async (id: number) => {
  const res = await api.delete(`/servers/${id}`);
  return res.data;
};