import { api } from "./clientApi";
import { createAsyncThunk } from "@reduxjs/toolkit";
// import { Test } from "../types/reduxTypes";

const API_URL = "/tests";

///  Обработчик ошибок
const handleApiError = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message || "Fehler beim Abrufen der Tests";
  }
  return "Unbekannter Fehler beim Abrufen der Tests";
};

// ///  Создание нового теста

///  API для получения всех групп теста
export const fetchGroupsApi = async (testId: string) => {
  const response = await api.get(`${API_URL}/${testId}/available-groups`);

  return response.data.availableForGroups.map(
    (group: { id: string; name: string }) => ({
      id: group.id,
      name: group.name,
    })
  );
};

///  API для получения всех групп системы
export const fetchAllGroupsApi = async () => {
  const response = await api.get("/groups");

  return response.data.map((group: { id: string; name: string }) => ({
    id: group.id,
    name: group.name,
  }));
};

///  THUNK для загрузки всех групп
export const fetchAllGroups = createAsyncThunk<
  { id: string; name: string }[],
  void,
  { rejectValue: string }
>("tests/fetchAllGroups", async (_, { rejectWithValue }) => {
  try {
    const groups = await fetchAllGroupsApi();
    return groups;
  } catch (error) {
    return rejectWithValue(handleApiError(error));
  }
});

///  API для обновления групп теста
export const updateTestGroupsApi = async (
  testId: string,
  groupIds: string[]
) => {
  if (!testId || !Array.isArray(groupIds)) {
    throw new Error("Ungültige Parameter für updateTestGroupsApi");
  }

  const response = await api.patch(`${API_URL}/${testId}/available-groups`, {
    groupIds,
  });

  return {
    testId,
    availableForGroups: response.data.availableForGroups.map(
      (group: { id: string; name: string }) => ({
        id: group.id,
        name: group.name,
      })
    ),
  };
};
