// src/redux/testResults/testResultsSlice.ts

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { fetchTestResultsForCreator } from "./testResultsActions";
import { TestResultsForCreator } from "../../types/apiTypes";

interface TestResultsState {
  testResults: TestResultsForCreator | null;
  loading: boolean;
  error: string | null;
  selectedTestId: string | null;
  selectedGroupId: string | null;
}

const initialState: TestResultsState = {
  testResults: null,
  loading: false,
  error: null,
  selectedTestId: null,
  selectedGroupId: null,
};

export const testResultsSlice = createSlice({
  name: "testResults",
  initialState,
  reducers: {
    resetTestResultsState: () => initialState,

    // 🔹 Добавлено: установка выбранного теста
    setSelectedTestId: (state, action: PayloadAction<string>) => {
      state.selectedTestId = action.payload;
      state.selectedGroupId = null; // сбрасываем выбранную группу
    },

    // 🔹 Добавлено: установка выбранной группы
    setSelectedGroupId: (state, action: PayloadAction<string| null>) => {
      state.selectedGroupId = action.payload;
    },
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

export const { resetTestResultsState, setSelectedTestId, setSelectedGroupId } =
  testResultsSlice.actions;

export const testResultsReducer = testResultsSlice.reducer;
