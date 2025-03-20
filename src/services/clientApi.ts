import axios from "axios";
import { store, authActions } from "../redux";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // ✅ Глобальная настройка для отправки куки
});

// 🔹 Автоматически добавляем `credentials: "include"` ко всем запросам
api.interceptors.request.use((config) => {
  config.withCredentials = true; // ✅ Теперь все запросы передают куки автоматически
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status } = error.response;

      if (status === 401) {
        const storedUser = JSON.parse(localStorage.getItem("user") || "null");
        if (!storedUser) {
          store.dispatch(authActions.logout()); // ✅ Безопасный выход из системы при 401
        }
      }
    }

    return Promise.reject(error);
  }
);
