// src/hooks/useAvailableTests.ts
import { useEffect, useState, useCallback } from "react";
import { useAppDispatch, useAppSelector } from "../hooks";
import {
  fetchAvailableTests,
  selectAvailableTests,
  selectUserLoading,
  selectUserError,
} from "../redux";
import { useNavigate } from "react-router-dom";

export const useAvailableTests = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const tests = useAppSelector(selectAvailableTests);
  const isLoading = useAppSelector(selectUserLoading);
  const error = useAppSelector(selectUserError);

  const [confirmTestId, setConfirmTestId] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchAvailableTests());
  }, [dispatch]);

  const openConfirmModal = useCallback((testId: string) => {
    setConfirmTestId(testId);
  }, []);

  const closeConfirmModal = useCallback(() => {
    setConfirmTestId(null);
  }, []);

  const startTest = useCallback(() => {
    if (confirmTestId) {
      navigate(`/test/${confirmTestId}/attempt`);
    }
  }, [confirmTestId, navigate]);

  return {
    tests,
    isLoading,
    error,
    confirmTestId,
    openConfirmModal,
    closeConfirmModal,
    startTest,
  };
};
