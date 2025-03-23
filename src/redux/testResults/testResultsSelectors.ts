// src/redux/testResults/testResultsSelectors.ts

import { RootState } from "../store";

export const selectTestResults = (state: RootState) =>
  state.testResults.testResults;

export const selectTestResultsLoading = (state: RootState) =>
  state.testResults.loading;

export const selectTestResultsError = (state: RootState) =>
  state.testResults.error;
