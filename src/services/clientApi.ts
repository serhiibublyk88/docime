import axios from "axios";
import { store, authActions } from "../redux";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status } = error.response;

      if (status === 401) {
        const storedUser = JSON.parse(localStorage.getItem("user") || "null");
        if (!storedUser) {
          store.dispatch(authActions.logout());
        }
      }
    }

    return Promise.reject(error);
  }
);
