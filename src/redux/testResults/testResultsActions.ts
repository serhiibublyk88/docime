// src/redux/testResults/testResultsActions.ts

import { createAsyncThunk } from "@reduxjs/toolkit";
import { getTestResults } from "../../services/testResultsApi";
import { TestResultsForCreator } from "../../types/apiTypes"; 

// Получение результатов теста для создателя
export const fetchTestResultsForCreator = createAsyncThunk<
  TestResultsForCreator,
  string
>("testResults/fetchTestResultsForCreator", async (testId, thunkAPI) => {
  try {
    return await getTestResults(testId);
  } catch {
    return thunkAPI.rejectWithValue("Fehler beim Laden der Testergebnisse");
  }
});
