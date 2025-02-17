import { authActions } from "./authSlice";
import { AppDispatch } from "../store";
import { User } from "../../types/reduxTypes";

export const loginUser = (user: User) => (dispatch: AppDispatch) => {
  localStorage.setItem("user", JSON.stringify(user));
  dispatch(authActions.login({ user }));
};

export const logoutUser = () => (dispatch: AppDispatch) => {
  localStorage.removeItem("user");
  dispatch(authActions.logout());
};
