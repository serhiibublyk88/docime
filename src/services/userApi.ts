// src/services/userApi.ts
import { api } from "./clientApi";
import { AvailableTest } from "../types/apiTypes";

export const userApi = {
  getAvailableTests: async (): Promise<AvailableTest[]> => {
    const response = await api.get<{ data: AvailableTest[] }>(
      "/users/available"
    );
    return response.data.data;
  },
};
