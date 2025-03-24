// src/redux/user/userSlice.ts

import { createSlice } from "@reduxjs/toolkit";
import { fetchAvailableTests, fetchUserTestResults } from "./userActions";
import {  UserState } from "../../types/apiTypes";

const initialState: UserState = {
  availableTests: [],
  testResults: [],
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    clearUserError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAvailableTests.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAvailableTests.fulfilled, (state, action) => {
        state.loading = false;
        state.availableTests = action.payload;
      })
      .addCase(fetchAvailableTests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(fetchUserTestResults.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserTestResults.fulfilled, (state, action) => {
        state.loading = false;
        state.testResults = action.payload;
      })
      .addCase(fetchUserTestResults.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearUserError } = userSlice.actions;
export const userReducer = userSlice.reducer;
