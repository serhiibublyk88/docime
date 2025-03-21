import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchTests,
  fetchTestById,
  createTest,
  updateTest,
  deleteTest,
  duplicateTest,
  updateTestStatus,
} from "../../services/testApi";
import { Test, TestPayload } from "../../types/reduxTypes";
import { setError } from "../error/errorSlice";

/** Получить все тесты */
export const getTests = createAsyncThunk<Test[], void>(
  "tests/getAll",
  async (_, { rejectWithValue }) => {
    try {
      return await fetchTests({ credentials: "include" });
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Fehler beim Laden der Tests"
      );
    }
  }
);

/** Получить тест по ID */
export const getTestById = createAsyncThunk<Test, string>(
  "tests/getById",
  async (testId, { rejectWithValue }) => {
    try {
      return await fetchTestById(testId, { credentials: "include" });
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Fehler beim Laden des Tests"
      );
    }
  }
);

/** Создать новый тест */
export const addTest = createAsyncThunk<Test, TestPayload>(
  "tests/add",
  async (testData, { rejectWithValue }) => {
    try {
      return await createTest(testData, { credentials: "include" });
    } catch (error) {
      return rejectWithValue(
        error instanceof Error
          ? error.message
          : "Fehler beim Erstellen des Tests"
      );
    }
  }
);

/** Обновить тест */
export const editTest = createAsyncThunk<
  Test,
  { testId: string; testData: Partial<TestPayload> }
>("tests/edit", async ({ testId, testData }, { rejectWithValue }) => {
  try {
    return await updateTest(testId, testData, { credentials: "include" });
  } catch (error) {
    return rejectWithValue(
      error instanceof Error
        ? error.message
        : "Fehler beim Aktualisieren des Tests"
    );
  }
});

/** Удалить тест */
export const removeTest = createAsyncThunk<void, string>(
  "tests/remove",
  async (testId, { rejectWithValue }) => {
    try {
      await deleteTest(testId, { credentials: "include" });
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Fehler beim Löschen des Tests"
      );
    }
  }
);

/** Копировать тест */
export const duplicatTest = createAsyncThunk<Test, string>(
  "tests/copy",
  async (testId, { rejectWithValue }) => {
    try {
      return await duplicateTest(testId, { credentials: "include" });
    } catch (error) {
      return rejectWithValue(
        error instanceof Error
          ? error.message
          : "Fehler beim Kopieren des Tests"
      );
    }
  }
);

/** Изменить статус теста */
export const changeTestStatus = createAsyncThunk<
  Test, 
  { testId: string; status: "active" | "inactive" }, 
  { rejectValue: string }
>("tests/changeStatus", async ({ testId, status }, { dispatch, rejectWithValue }) => {
  try {
    
    return await updateTestStatus(testId, status);
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Fehler beim Ändern des Status";
    dispatch(setError(message));
    return rejectWithValue(message);
  }
});
