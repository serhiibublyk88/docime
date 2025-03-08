import { useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  AppDispatch,
  fetchTests,
  createTest,
  updateTest,
  deleteTest,
  copyTest,
  updateTestGroups,
  setCurrentTest,
  selectAllTests,
  selectTestsLoading,
  selectTestsError,
  selectCurrentTest,
} from "../redux";

import { Test } from "../types/reduxTypes";


export const useTests = () => {
  const dispatch = useDispatch<AppDispatch>();

  
  const tests = useSelector(selectAllTests) || [];
  const loading = useSelector(selectTestsLoading);
  const error = useSelector(selectTestsError);
  const currentTest = useSelector(selectCurrentTest);

  ///  Загрузка тестов при монтировании 
  useEffect(() => {
    if (tests.length === 0) {
      dispatch(fetchTests());
    }
  }, [dispatch, tests.length]);

  ///  Функция для принудительного обновления тестов
  const fetchAllTests = useCallback(() => {
    dispatch(fetchTests());
  }, [dispatch]);

  /// Функция для создания теста
  const createNewTest = useCallback(
    (data: Partial<Test>) => {
      dispatch(createTest(data));
    },
    [dispatch]
  );

  /// Функция для обновления теста
  const updateExistingTest = useCallback(
    (testId: string, data: Partial<Test>) => {
      dispatch(updateTest({ testId, data }));
    },
    [dispatch]
  );

  /// Функция для удаления теста
  const deleteExistingTest = useCallback(
    (testId: string) => {
      dispatch(deleteTest(testId));
    },
    [dispatch]
  );

  /// Функция для копирования теста
  const copyExistingTest = useCallback(
    (testId: string) => {
      dispatch(copyTest(testId));
    },
    [dispatch]
  );

  /// Функция для обновления доступных групп
  const updateTestGroupAccess = useCallback(
    (testId: string, groupId: string, action: "add" | "remove") => {
      dispatch(updateTestGroups({ testId, groupId, action }));
    },
    [dispatch]
  );

  ///  Функция для выбора текущего теста
  const setSelectedTest = useCallback(
    (test: Test | null) => {
      dispatch(setCurrentTest(test));
    },
    [dispatch]
  );

  
  return {
    tests,
    loading,
    error,
    currentTest,
    fetchAllTests,
    createNewTest,
    updateExistingTest,
    deleteExistingTest,
    copyExistingTest,
    updateTestGroupAccess,
    setSelectedTest,
  };
};
