import { createAsyncThunk } from "@reduxjs/toolkit";
// import { Test } from "../../types/reduxTypes";
import {
  
  fetchGroupsApi,
  fetchAllGroupsApi,
  // createTestApi,
  // updateTestApi,
  // deleteTestApi,
  // copyTestApi,
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

// // ✅ **Создание нового теста**
// export const createTest = createAsyncThunk<
//   Test,
//   Partial<Test>,
//   { rejectValue: string }
// >("tests/createTest", async (testData, { rejectWithValue }) => {
//   try {
//     return await createTestApi(testData);
//   } catch (error) {
//     return rejectWithValue(handleApiError(error));
//   }
// });

// //  **Обновление теста**
// export const updateTest = createAsyncThunk<
//   Test,
//   { testId: string; data: Partial<Test> },
//   { rejectValue: string }
// >("tests/updateTest", async ({ testId, data }, { rejectWithValue }) => {
//   try {
//     return await updateTestApi(testId, data);
//   } catch (error) {
//     return rejectWithValue(handleApiError(error));
//   }
// });

// //  **Удаление теста**
// export const deleteTest = createAsyncThunk<
//   string,
//   string,
//   { rejectValue: string }
// >("tests/deleteTest", async (testId, { rejectWithValue }) => {
//   try {
//     await deleteTestApi(testId);
//     return testId;
//   } catch (error) {
//     return rejectWithValue(handleApiError(error));
//   }
// });

// //  **Копирование теста**
// export const copyTest = createAsyncThunk<Test, string, { rejectValue: string }>(
//   "tests/copyTest",
//   async (testId, { rejectWithValue }) => {
//     try {
//       return await copyTestApi(testId);
//     } catch (error) {
//       return rejectWithValue(handleApiError(error));
//     }
//   }
// );

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
    } catch  {
      return rejectWithValue("Fehler beim Aktualisieren der Gruppen");
    }
  }
);
