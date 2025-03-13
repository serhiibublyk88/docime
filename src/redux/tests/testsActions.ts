import { createAsyncThunk } from "@reduxjs/toolkit";
import { Test } from "../../types/reduxTypes";
import {
  fetchTestsApi,
  fetchGroupsApi,
  fetchAllGroupsApi,
  createTestApi,
  updateTestApi,
  deleteTestApi,
  copyTestApi,
  updateTestGroupsApi,
} from "../../services/testsApi";
import { AxiosError } from "axios";

// ✅ **Обработчик ошибок**
const handleApiError = (error: unknown): string => {
  if (error instanceof AxiosError) {
    console.error("❌ [API Error]:", error.response?.data || error.message);
    return error.response?.data?.message || "Fehler beim Abrufen der Tests";
  }
  return "Unbekannter Fehler beim Abrufen der Tests";
};

// ✅ **Получение списка тестов**
export const fetchTests = createAsyncThunk<
  Test[],
  void,
  { rejectValue: string }
>("tests/fetchTests", async (_, { rejectWithValue }) => {
  try {
    console.log("📡 [THUNK] Загружаем список тестов...");
    const tests = await fetchTestsApi();
    console.log("✅ [THUNK] Загружены тесты:", tests);
    return tests;
  } catch (error) {
    return rejectWithValue(handleApiError(error));
  }
});

// ✅ **Получение всех групп в системе**
export const fetchAllGroups = createAsyncThunk<
  { id: string; name: string }[],
  void,
  { rejectValue: string }
>("tests/fetchAllGroups", async (_, { rejectWithValue }) => {
  try {
    console.log("📡 [THUNK] Загружаем все группы...");
    const groups = await fetchAllGroupsApi();
    console.log("✅ [THUNK] Загружены все группы:", groups);
    return groups;
  } catch (error) {
    return rejectWithValue(handleApiError(error));
  }
});

// ✅ **Получение доступных групп для теста**
export const fetchTestGroups = createAsyncThunk<
  { id: string; name: string }[],
  string,
  { rejectValue: string }
>("tests/fetchTestGroups", async (testId, { rejectWithValue }) => {
  try {
    console.log(`📡 [THUNK] Загружаем группы для теста ${testId}...`);
    const groups = await fetchGroupsApi(testId);
    console.log("✅ [THUNK] Загружены группы:", groups);
    return groups;
  } catch (error) {
    return rejectWithValue(handleApiError(error));
  }
});

// ✅ **Создание нового теста**
export const createTest = createAsyncThunk<
  Test,
  Partial<Test>,
  { rejectValue: string }
>("tests/createTest", async (testData, { rejectWithValue }) => {
  try {
    console.log("📡 [THUNK] Создаем новый тест...", testData);
    const newTest = await createTestApi(testData);
    console.log("✅ [THUNK] Тест создан:", newTest);
    return newTest;
  } catch (error) {
    return rejectWithValue(handleApiError(error));
  }
});

// ✅ **Обновление теста**
export const updateTest = createAsyncThunk<
  Test,
  { testId: string; data: Partial<Test> },
  { rejectValue: string }
>("tests/updateTest", async ({ testId, data }, { rejectWithValue }) => {
  try {
    console.log(`📡 [THUNK] Обновляем тест ${testId}...`, data);
    const updatedTest = await updateTestApi(testId, data);
    console.log(`✅ [THUNK] Тест ${testId} обновлен:`, updatedTest);
    return updatedTest;
  } catch (error) {
    return rejectWithValue(handleApiError(error));
  }
});

// ✅ **Удаление теста**
export const deleteTest = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>("tests/deleteTest", async (testId, { rejectWithValue }) => {
  try {
    console.log(`📡 [THUNK] Удаляем тест ${testId}...`);
    await deleteTestApi(testId);
    console.log(`✅ [THUNK] Тест ${testId} удален`);
    return testId;
  } catch (error) {
    return rejectWithValue(handleApiError(error));
  }
});

// ✅ **Копирование теста**
export const copyTest = createAsyncThunk<Test, string, { rejectValue: string }>(
  "tests/copyTest",
  async (testId, { rejectWithValue }) => {
    try {
      console.log(`📡 [THUNK] Копируем тест ${testId}...`);
      const copiedTest = await copyTestApi(testId);
      console.log(`✅ [THUNK] Тест ${testId} скопирован:`, copiedTest);
      return copiedTest;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

// ✅ **Обновление доступных групп для теста**
export const updateTestGroups = createAsyncThunk<
  { testId: string; availableForGroups: { id: string; name: string }[] },
  { testId: string; groupId: string; action: "add" | "remove" },
  { rejectValue: string }
>(
  "tests/updateTestGroups",
  async ({ testId, groupId, action }, { rejectWithValue, dispatch }) => {
    try {
      console.log(
        `📡 [THUNK] ${
          action === "add" ? "Добавляем" : "Удаляем"
        } группу ${groupId} для теста ${testId}...`
      );

      const response = await updateTestGroupsApi(testId, groupId, action);

      console.log(
        `✅ [THUNK] Группы теста ${testId} обновлены:`,
        response.availableForGroups
      );

      // ⏬ **Важно! Заново загружаем доступные группы после изменения**
      await dispatch(fetchTestGroups(testId)).unwrap();

      return response;
    } catch (error) {
      console.error(
        `❌ [THUNK] Ошибка обновления групп для теста ${testId}:`,
        error
      );
      return rejectWithValue("Fehler beim Aktualisieren der Gruppen");
    }
  }
);
