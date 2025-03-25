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

  const initializedRef = useRef(false);

  // ✅ Выбор первого теста при старте — строго один раз
  useEffect(() => {
    if (!initializedRef.current && allTests.length > 0) {
      initializedRef.current = true;
      const firstTestId = allTests[0].id;
      dispatch(setSelectedTestId(firstTestId));
      dispatch(fetchTestResultsForCreator(firstTestId));
    }
  }, [allTests, dispatch]);

  // ✅ Установка первой группы после загрузки результатов
  useEffect(() => {
    if (testResults?.groups?.length && !selectedGroupId) {
      dispatch(setSelectedGroupId(testResults.groups[0].groupId));
    }
  }, [testResults, selectedGroupId, dispatch]);

  const handleSelectTest = (testId: string) => {
    dispatch(setSelectedTestId(testId));
    dispatch(setSelectedGroupId(null));
    dispatch(fetchTestResultsForCreator(testId));
  };

  const handleSelectGroup = (groupId: string) => {
    dispatch(setSelectedGroupId(groupId));
  };

  const reset = () => {
    dispatch(resetTestResultsState());
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
