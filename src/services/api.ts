import axios from "axios";
import store from "../redux/store";
import { logout } from "../redux/authSlice";

// Базовый URL API
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Перехватчик ответов: обработка ошибок
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status } = error.response;

      if (status === 401) {
        store.dispatch(logout());
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

// API-функции для работы с бекендом

// Логин пользователя
export const login = async (email: string, password: string): Promise<User> => {
  const response = await api.post<{ message: string; user: User }>(
    "/auth/login",
    { email, password }
  );

  return response.data.user;
};

// Регистрация пользователя
export const registerUser = async (userData: RegisterData): Promise<User> => {
  const response = await api.post<{ user: User }>("/auth/register", userData);

  return response.data.user;
};

// Получение списка групп
export const getGroups = async (): Promise<Group[]> => {
  const response = await api.get<Group[]>("/groups/public");
  return response.data;
};

// Проверка пароля создателя тестов
export const checkCreatorPassword = async (
  password: string
): Promise<boolean> => {
  const response = await api.post<{ success: boolean }>(
    "/auth/check-creator-password",
    {
      password,
    }
  );
  return response.data.success;
};

export default api;
