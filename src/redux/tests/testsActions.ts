import { createAsyncThunk } from "@reduxjs/toolkit";
import { Test } from "../../types/reduxTypes";
import {
  fetchTestsApi,
  createTestApi,
  updateTestApi,
  deleteTestApi,
  copyTestApi,
  updateTestGroupsApi,
} from "../../services";
import { AxiosError } from "axios"; 

///  Обработчик ошибок
const handleApiError = (error: unknown): string => {
  const axiosError = error as AxiosError<{ message: string }>;
  return axiosError.response?.data?.message || "Failed to fetch tests";
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

///  Обновление доступных групп (добавить/удалить группу)
export const updateTestGroups = createAsyncThunk<
  { testId: string; availableForGroups: { id: string; name: string }[] },
  { testId: string; groupId: string; action: "add" | "remove" },
  { rejectValue: string }
>(
  "tests/updateTestGroups",
  async ({ testId, groupId, action }, { rejectWithValue }) => {
    try {
      return await updateTestGroupsApi(testId, groupId, action);
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);
