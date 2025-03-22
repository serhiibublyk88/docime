// src/redux/user/userSelectors.ts

import { RootState } from "../store";

export const selectAvailableTests = (state: RootState) =>
  state.user.availableTests;

export const selectUserTestResults = (state: RootState) =>
  state.user.testResults;

export const selectUserLoading = (state: RootState) => state.user.loading;

export const selectUserError = (state: RootState) => state.user.error;
