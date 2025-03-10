import { createAsyncThunk } from "@reduxjs/toolkit";
import { Test } from "../../types/reduxTypes";
import {
  fetchTestsApi,
  fetchGroupsApi,
  createTestApi,
  updateTestApi,
  deleteTestApi,
  copyTestApi,
  updateTestGroupsApi,
} from "../../services";
import { AxiosError } from "axios";

///  Обработчик ошибок (улучшенная версия)
const handleApiError = (error: unknown): string => {
  if (error instanceof AxiosError) {
    return error.response?.data?.message || "Fehler beim Abrufen der Tests";
  }
  return "Unbekannter Fehler beim Abrufen der Tests";
};

///  Получение списка тестов
export const fetchTests = createAsyncThunk<
  Test[],
  void,
  { rejectValue: string }
>("tests/fetchTests", async (_, { rejectWithValue }) => {
  try {
    return await fetchTestsApi();
  } catch (error) {
    return rejectWithValue(handleApiError(error));
  }
});

/// ✅ **Получение всех групп (исправлено)**
export const fetchAllGroups = createAsyncThunk<
  { id: string; name: string }[], // ✅ Теперь ожидаем только `{ id, name }[]`
  void,
  { rejectValue: string }
>("tests/fetchAllGroups", async (_, { rejectWithValue }) => {
  try {
    return await fetchGroupsApi(); // ✅ Теперь API уже возвращает `{ id, name }[]`
  } catch (error) {
    return rejectWithValue(handleApiError(error));
  }
});

///  Создание нового теста
export const createTest = createAsyncThunk<
  Test,
  Partial<Test>,
  { rejectValue: string }
>("tests/createTest", async (testData, { rejectWithValue }) => {
  try {
    return await createTestApi(testData);
  } catch (error) {
    return rejectWithValue(handleApiError(error));
  }
});

///  Обновление теста
export const updateTest = createAsyncThunk<
  Test,
  { testId: string; data: Partial<Test> },
  { rejectValue: string }
>("tests/updateTest", async ({ testId, data }, { rejectWithValue }) => {
  try {
    return await updateTestApi(testId, data);
  } catch (error) {
    return rejectWithValue(handleApiError(error));
  }
});

///  Удаление теста
export const deleteTest = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>("tests/deleteTest", async (testId, { rejectWithValue }) => {
  try {
    return await deleteTestApi(testId);
  } catch (error) {
    return rejectWithValue(handleApiError(error));
  }
});

///  Копирование теста
export const copyTest = createAsyncThunk<Test, string, { rejectValue: string }>(
  "tests/copyTest",
  async (testId, { rejectWithValue }) => {
    try {
      return await copyTestApi(testId);
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

/// ✅ **Обновление доступных групп (исправлено)**
export const updateTestGroups = createAsyncThunk<
  { testId: string; availableForGroups: { id: string; name: string }[] },
  { testId: string; groupId: string; action: "add" | "remove" },
  { rejectValue: string }
>(
  "tests/updateTestGroups",
  async ({ testId, groupId, action }, { rejectWithValue }) => {
    try {
      console.log(
        `Sende Anfrage: Test ${testId}, Gruppe ${groupId}, Aktion: ${action}`
      );

      // 🔥 API теперь сам возвращает `{ id, name }[]`
      const response = await updateTestGroupsApi(testId, groupId, action);

      console.log(
        `Erfolgreich aktualisiert: Test ${testId}, Gruppen:`,
        response.availableForGroups
      );

      return response; // ✅ Теперь `availableForGroups` уже содержит `{ id, name }[]`
    } catch (error) {
      console.error("Fehler bei der Aktualisierung der Testgruppen:", error);
      return rejectWithValue(handleApiError(error));
    }
  }
);
