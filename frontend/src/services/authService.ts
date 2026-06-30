import axios from "../api/axios";
import type { User } from "../types";

export const login = async (data: any) => {
  const form_data = new URLSearchParams();
  for (const key in data) {
    form_data.append(key, data[key]);
  }
  const response = await axios.post("/login", form_data, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });
  return response.data;
};

export const getMe = async (): Promise<User> => {
  const response = await axios.get("/users/me");
  return response.data;
};


