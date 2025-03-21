import { RootState } from "../store";
import { Test } from "../../types/reduxTypes";

export const selectAllTest = (state: RootState): Test[] => state.test.tests;

export const selectTestById = (state: RootState, testId: string): Test | null =>
  state.test.tests.find((test) => test.id === testId) || null;

export const selectSelectedTest = (state: RootState): Test | null =>
  state.test.selectedTest;

export const selectTestQuestions = (state: RootState) =>
  state.test.selectedTest?.questions ?? [];

export const selectTestLoading = (state: RootState): boolean =>
  state.test.loading;

export const selectTestError = (state: RootState): string | null =>
  state.test.error;

export const selectTestCount = (state: RootState): number =>
  state.test.tests.length;
