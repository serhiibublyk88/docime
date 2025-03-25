// src/redux/testResults/testResultsSelectors.ts
import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../store";

// 🔹 Базовые селекторы
export const selectTestResultsState = (state: RootState) => state.testResults;

export const selectTestResults = createSelector(
  selectTestResultsState,
  (state) => state.testResults
);

export const selectTestResultsLoading = createSelector(
  selectTestResultsState,
  (state) => state.loading
);

export const selectTestResultsError = createSelector(
  selectTestResultsState,
  (state) => state.error
);

export const selectSelectedTestId = createSelector(
  selectTestResultsState,
  (state) => state.selectedTestId
);

export const selectSelectedGroupId = createSelector(
  selectTestResultsState,
  (state) => state.selectedGroupId
);

export const selectTestName = createSelector(
  selectTestResults,
  (testResults) => testResults?.testName ?? ""
);

// 🔹 Мемоизированный список групп
export const selectTestGroups = createSelector(
  selectTestResults,
  (testResults) => testResults?.groups ?? []
);

// 🔹 Мемоизированный список участников выбранной группы
export const selectParticipantsForSelectedGroup = createSelector(
  [selectTestGroups, selectSelectedGroupId],
  (groups, selectedGroupId) => {
    const group = groups.find((g) => g.groupId === selectedGroupId);
    return group?.participants ?? [];
  }
);
