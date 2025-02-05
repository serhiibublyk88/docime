import axios from "axios";
import { store, authActions } from "../redux"; 

// Базовый URL API
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Перехватчик ошибок
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status } = error.response;

      if (status === 401) {
        
        store.dispatch(authActions.logout());
      }
    }

    return Promise.reject(error);
  }
);

// Типы данных для API
interface User {
  id: string;
  username: string;
  role: number;
  email: string;
  group: string;
}

interface RegisterData {
  username: string;
  email: string;
  password: string;
  groupId: string | null;
  role: number;
}

interface Group {
  id: string;
  name: string;
}

// Объект `authApi` для аутентификации
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

// Объект `groupApi` для работы с группами
export const groupApi = {
  getGroups: async (): Promise<Group[]> => {
    const response = await api.get<Group[]>("/groups/public");
    return response.data;
  },
};

export default api;
