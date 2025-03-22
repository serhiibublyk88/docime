// src/services/userApi.ts
import { api } from "./clientApi";
import { AvailableTest, UserTestResult } from "../types/apiTypes";

export const userApi = {
  // Получение доступных тестов
  getAvailableTests: async (): Promise<AvailableTest[]> => {
    const response = await api.get<{ data: AvailableTest[] }>(
      "/users/available"
    );
    return response.data.data;
  },

  // Получение результатов текущего пользователя
  getUserResults: async (): Promise<UserTestResult[]> => {
    const response = await api.get<{ data: UserTestResult[] }>(
      "/users/results"
    );
    return response.data.data;
  },
};
