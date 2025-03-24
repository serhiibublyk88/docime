import { createAsyncThunk } from "@reduxjs/toolkit";
// import { Test } from "../../types/reduxTypes";
import {
  fetchGroupsApi,
  fetchAllGroupsApi,
  updateTestGroupsApi,
} from "../../services/testsApi";
import { AxiosError } from "axios";

// ✅ **Обработчик ошибок**
const handleApiError = (error: unknown): string => {
  if (error instanceof AxiosError) {
    return error.response?.data?.message || "Fehler beim Abrufen der Tests";
  }
  return "Unbekannter Fehler beim Abrufen der Tests";
};

// ✅ **Получение всех групп в системе**
export const fetchAllGroups = createAsyncThunk<
  { id: string; name: string }[],
  void,
  { rejectValue: string }
>("tests/fetchAllGroups", async (_, { rejectWithValue }) => {
  try {
    return await fetchAllGroupsApi();
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
    return await fetchGroupsApi(testId);
  } catch (error) {
    return rejectWithValue(handleApiError(error));
  }
});

//  **Обновление доступных групп для теста**
export const updateTestGroups = createAsyncThunk<
  { testId: string; availableForGroups: { id: string; name: string }[] },
  { testId: string; groupIds: string[] },
  { rejectValue: string }
>(
  "tests/updateTestGroups",
  async ({ testId, groupIds }, { rejectWithValue }) => {
    try {
      return await updateTestGroupsApi(testId, groupIds);
    } catch {
      return rejectWithValue("Fehler beim Aktualisieren der Gruppen");
    }
  }
);
