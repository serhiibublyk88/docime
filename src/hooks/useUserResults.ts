import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from ".";
import {
  fetchUserTestResults,
  selectUserTestResults,
  selectUserLoading,
  selectUserError,
  clearUserError, 
} from "../redux";

export const useUserResults = () => {
  const dispatch = useAppDispatch();

  const results = useAppSelector(selectUserTestResults);
  const isLoading = useAppSelector(selectUserLoading);
  const showError = useAppSelector(selectUserError);

  useEffect(() => {
    dispatch(fetchUserTestResults());
  }, [dispatch]);

  const hideError = () => {
    dispatch(clearUserError());
  };

  return {
    results,
    isLoading,
    showError,
    hideError,
  };
};
