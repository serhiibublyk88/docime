// src/redux/testResults/testResultsSlice.ts

import { createSlice } from "@reduxjs/toolkit";
import { fetchTestResultsForCreator } from "./testResultsActions";
import { TestResultsForCreator } from "../../types/apiTypes";

interface TestResultsState {
  testResults: TestResultsForCreator | null;
  loading: boolean;
  error: string | null;
}

const initialState: TestResultsState = {
  testResults: null,
  loading: false,
  error: null,
};

export const testResultsSlice = createSlice({
  name: "testResults",
  initialState,
  reducers: {
    resetTestResultsState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTestResultsForCreator.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTestResultsForCreator.fulfilled, (state, action) => {
        state.loading = false;
        state.testResults = action.payload;
      })
      .addCase(fetchTestResultsForCreator.rejected, (state, action) => {
        state.loading = false;
        state.error =
          (action.payload as string) || "Fehler beim Laden der Ergebnisse";
      });
  },
});

export const { resetTestResultsState } = testResultsSlice.actions;
export const testResultsReducer = testResultsSlice.reducer;
