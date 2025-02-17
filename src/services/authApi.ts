import { api } from "./apiClient";
import { User, RegisterData } from "../types/apiTypes";

export const authApi = {
  login: async (email: string, password: string): Promise<User> => {
    const response = await api.post<{ message: string; user: User }>(
      "/auth/login",
      { email, password }
    );
    return response.data.user;
  },

  registerUser: async (userData: RegisterData): Promise<User> => {
    const response = await api.post<{ user: User }>("/auth/register", userData);
    return response.data.user;
  },

  checkCreatorPassword: async (password: string): Promise<boolean> => {
    const response = await api.post<{ success: boolean }>(
      "/auth/check-creator-password",
      { password }
    );
    return response.data.success;
  },
};
