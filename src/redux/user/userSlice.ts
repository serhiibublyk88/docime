// src/redux/user/userSlice.ts

import { createSlice } from "@reduxjs/toolkit";
import { AvailableTest, UserTestResult } from "../../types/apiTypes";
import { fetchAvailableTests, fetchUserTestResults } from "./userActions";

export type UserState = {
  availableTests: AvailableTest[];
  testResults: UserTestResult[];
  loading: boolean;
  error: string | null;
};

const initialState: UserState = {
  availableTests: [],
  testResults: [],
  loading: false,
  error: null,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder

      // --- Доступные тесты ---
      .addCase(fetchAvailableTests.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAvailableTests.fulfilled, (state, action) => {
        state.availableTests = action.payload;
        state.loading = false;
      })
      .addCase(fetchAvailableTests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Fehler beim Laden der Tests";
      })

      // --- Результаты пользователя ---
      .addCase(fetchUserTestResults.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserTestResults.fulfilled, (state, action) => {
        state.testResults = action.payload;
        state.loading = false;
      })
      .addCase(fetchUserTestResults.rejected, (state, action) => {
        state.loading = false;
        state.error =
          (action.payload as string) || "Fehler beim Laden der Ergebnisse";
      });
  },
});

export const userReducer = userSlice.reducer;
