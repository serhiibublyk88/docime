import { RootState } from "../store";

export const selectTests = (state: RootState) => state.test.tests;
export const selectCurrentTest = (state: RootState) => state.test.currentTest;
