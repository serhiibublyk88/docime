import { setError, clearError } from "./errorSlice";
import { AppDispatch } from "../store";

export const triggerError = (message: string) => (dispatch: AppDispatch) => {
  dispatch(setError(message));
};

export const resetError = () => (dispatch: AppDispatch) => {
  dispatch(clearError());
};
