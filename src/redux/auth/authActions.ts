import { authActions } from "./authSlice";
import { AppDispatch } from "../store";

export const loginUser =
  (credentials: { email: string; password: string }) =>
  async (dispatch: AppDispatch) => {
    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        throw new Error("Login fehlgeschlagen.");
      }

      const data = await response.json();

      const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("token="))
        ?.split("=")[1];

      if (!token) {
        throw new Error("Kein Token gefunden.");
      }

      const userWithToken = { ...data.user, token };
      localStorage.setItem("user", JSON.stringify(userWithToken));
      dispatch(authActions.login({ user: userWithToken }));
    } catch (error) {
      console.error(error);
    }
  };

export const logoutUser = () => (dispatch: AppDispatch) => {
  localStorage.removeItem("user");
  dispatch(authActions.logout());
};
