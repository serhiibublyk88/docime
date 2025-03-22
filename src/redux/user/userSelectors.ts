import { RootState } from "../store";

export const selectAvailableTests = (state: RootState) =>
  state.user.availableTests;

export const selectUserLoading = (state: RootState) => state.user.loading;

export const selectUserError = (state: RootState) => state.user.error;
