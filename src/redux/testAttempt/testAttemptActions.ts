// src/redux/testAttempt/testAttemptActions.ts

import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  createTestAttempt,
  submitTestAttempt,
  getTestAttempt,
} from "../../services/testAttemptApi";
import { Question, TestResult } from "../../types/apiTypes"; 

// Создание попытки
export const fetchCreateTestAttempt = createAsyncThunk<
  { attemptId: string; questions: Question[]; timeLimit: number },
  string
>("testAttempt/fetchCreateTestAttempt", async (testId, thunkAPI) => {
  try {
    return await createTestAttempt(testId);
  } catch {
    return thunkAPI.rejectWithValue("Fehler beim Erstellen des Versuchs");
  }
});

// Завершение попытки
export const fetchSubmitTestAttempt = createAsyncThunk<
  TestResult,
  {
    testId: string;
    attemptId: string;
    answers: { questionId: string; answer: string | string[] }[];
  }
>(
  "testAttempt/fetchSubmitTestAttempt",
  async ({ testId, attemptId, answers }, thunkAPI) => {
    try {
      return await submitTestAttempt(testId, attemptId, answers);
    } catch {
      return thunkAPI.rejectWithValue("Fehler beim Senden des Tests");
    }
  }
);

// Получение данных о попытке (используется для анализа результатов)
export const fetchGetTestAttempt = createAsyncThunk<
  TestResult,
  { testId: string; attemptId: string }
>(
  "testAttempt/fetchGetTestAttempt",
  async ({ testId, attemptId }, thunkAPI) => {
    try {
      return await getTestAttempt(testId, attemptId);
    } catch {
      return thunkAPI.rejectWithValue("Fehler beim Laden des Testergebnisses");
    }
  }
);
