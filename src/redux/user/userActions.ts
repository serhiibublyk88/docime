// src/redux/user/userActions.ts
import { createAsyncThunk } from "@reduxjs/toolkit";
import { userApi } from "../../services";
import { AvailableTest, UserTestResult } from "../../types/apiTypes";

// Загрузка доступных тестов для пользователя
export const fetchAvailableTests = createAsyncThunk<AvailableTest[]>(
  "user/fetchAvailableTests",
  async () => {
    const tests = await userApi.getAvailableTests();
    return tests;
  }
);

// Загрузка результатов тестов пользователя
export const fetchUserTestResults = createAsyncThunk<UserTestResult[]>(
  "user/fetchUserTestResults",
  async (_, thunkAPI) => {
    try {
      const results = await userApi.getUserResults();
      return results;
    } catch {
      return thunkAPI.rejectWithValue("Fehler beim Laden der Testergebnisse");
    }
  }
);
