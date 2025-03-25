// src/redux/testResults/testResultsSelectors.ts

import { RootState } from "../store";

// 🔹 Существующие селекторы
export const selectTestResults = (state: RootState) =>
  state.testResults.testResults;

export const selectTestResultsLoading = (state: RootState) =>
  state.testResults.loading;

export const selectTestResultsError = (state: RootState) =>
  state.testResults.error;

// 🔹 Новый: id выбранного теста
export const selectSelectedTestId = (state: RootState) =>
  state.testResults.selectedTestId;

// 🔹 Новый: id выбранной группы
export const selectSelectedGroupId = (state: RootState) =>
  state.testResults.selectedGroupId;

// 🔹 Новый: название текущего теста
export const selectTestName = (state: RootState) =>
  state.testResults.testResults?.testName ?? "";

// 🔹 Новый: список групп текущего теста
export const selectTestGroups = (state: RootState) =>
  state.testResults.testResults?.groups ?? [];

// 🔹 Новый: участники выбранной группы
export const selectParticipantsForSelectedGroup = (state: RootState) => {
  const groupId = state.testResults.selectedGroupId;
  const groups = state.testResults.testResults?.groups ?? [];
  const group = groups.find((g) => g.groupId === groupId);
  return group?.participants ?? [];
};
