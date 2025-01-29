import axios from "axios";

// Базовый URL API
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Функция для получения токена из localStorage
const getToken = () => {
  return localStorage.getItem("token");
};

// Перехватчик запросов: добавляем токен в заголовки
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Перехватчик ответов: обработка ошибок (например, 401)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status } = error.response;

      // Если 401 (неавторизован) → очищаем токен и редирект на логин
      if (status === 401) {
        localStorage.removeItem("token");
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default api;
