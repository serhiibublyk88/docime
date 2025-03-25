// src/hooks/useTestResults.ts

import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { useAppDispatch } from "./useAppDispatch";
import {
  fetchTestResultsForCreator,
  setSelectedTestId,
  setSelectedGroupId,
  resetTestResultsState,
  selectTestResults,
  selectTestResultsLoading,
  selectTestResultsError,
  selectSelectedTestId,
  selectSelectedGroupId,
  selectTestGroups,
  selectParticipantsForSelectedGroup,
  selectTestName,
  selectAllTest,
} from "../redux";

export const useTestResults = () => {
  const dispatch = useAppDispatch();

  const allTests = useSelector(selectAllTest);
  const testResults = useSelector(selectTestResults);
  const isLoading = useSelector(selectTestResultsLoading);
  const error = useSelector(selectTestResultsError);
  const selectedTestId = useSelector(selectSelectedTestId);
  const selectedGroupId = useSelector(selectSelectedGroupId);
  const groups = useSelector(selectTestGroups);
  const participants = useSelector(selectParticipantsForSelectedGroup);
  const testName = useSelector(selectTestName);

  const didLoadRef = useRef(false); // ✅ защита от двойной загрузки

  // 🔹 Выбираем первый тест при первом заходе
  useEffect(() => {
    if (allTests.length > 0 && !selectedTestId && !didLoadRef.current) {
      const firstTestId = allTests[0].id;
      dispatch(setSelectedTestId(firstTestId));
      dispatch(fetchTestResultsForCreator(firstTestId));
      didLoadRef.current = true;
    }
  }, [allTests, selectedTestId, dispatch]);

  // 🔹 Загружаем данные, если тест выбран вручную
  useEffect(() => {
    if (selectedTestId && didLoadRef.current) {
      dispatch(fetchTestResultsForCreator(selectedTestId));
    }
  }, [selectedTestId, dispatch]);

  // 🔹 При загрузке результатов — выбираем первую группу
  useEffect(() => {
    if (groups.length > 0 && !selectedGroupId) {
      dispatch(setSelectedGroupId(groups[0].groupId));
    }
  }, [groups, selectedGroupId, dispatch]);

  // 🔹 Обработчик: выбор теста
  const handleSelectTest = (testId: string) => {
    dispatch(setSelectedTestId(testId));
    dispatch(setSelectedGroupId(null));
  };

  // 🔹 Обработчик: выбор группы
  const handleSelectGroup = (groupId: string) => {
    dispatch(setSelectedGroupId(groupId));
  };

  // 🔹 Сброс
  const reset = () => {
    dispatch(resetTestResultsState());
    didLoadRef.current = false;
  };

  return {
    isLoading,
    error,
    testResults,
    testName,
    selectedTestId,
    selectedGroupId,
    groups,
    participants,
    handleSelectTest,
    handleSelectGroup,
    reset,
  };
};
