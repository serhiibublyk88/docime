// src/redux/testAttempt/testAttemptSlice.ts

import { createSlice } from "@reduxjs/toolkit";
import {
  fetchCreateTestAttempt,
  fetchSubmitTestAttempt,
  fetchGetTestAttempt,
} from "./testAttemptActions";
import { Question, TestResult } from "../../types/apiTypes";

interface TestAttemptState {
  attemptId: string | null;
  questions: Question[];
  result: TestResult | null;
  loading: boolean;
  error: string | null;
}

const initialState: TestAttemptState = {
  attemptId: null,
  questions: [],
  result: null,
  loading: false,
  error: null,
};

const slice = createSlice({
  name: "testAttempt",
  initialState,
  reducers: {
    resetTestAttemptState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      // --- Create Attempt ---
      .addCase(fetchCreateTestAttempt.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.attemptId = null;
        state.questions = [];
        state.result = null;
      })
      .addCase(fetchCreateTestAttempt.fulfilled, (state, action) => {
        state.loading = false;
        state.attemptId = action.payload.attemptId;
        state.questions = action.payload.questions;
      })
      .addCase(fetchCreateTestAttempt.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // --- Submit Attempt ---
      .addCase(fetchSubmitTestAttempt.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSubmitTestAttempt.fulfilled, (state, action) => {
        state.loading = false;
        state.result = action.payload;
      })
      .addCase(fetchSubmitTestAttempt.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // --- Get Attempt ---
      .addCase(fetchGetTestAttempt.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGetTestAttempt.fulfilled, (state, action) => {
        state.loading = false;
        state.result = action.payload;
      })
      .addCase(fetchGetTestAttempt.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { resetTestAttemptState } = slice.actions;
export const testAttemptReducer = slice.reducer;
