import { api } from "./clientApi";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { Test } from "../types/reduxTypes";

const API_URL = "/tests";

///  Обработчик ошибок
const handleApiError = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message || "Fehler beim Abrufen der Tests";
  }
  return "Unbekannter Fehler beim Abrufen der Tests";
};

/// **Получение списка тестов**
export const fetchTestsApi = async (): Promise<Test[]> => {
  try {
    const response = await api.get<Test[]>(API_URL);
    return response.data.map((test) => ({
      id: test.id,
      title: test.title,
      description: test.description,
      author: test.author
        ? { id: test.author.id, username: test.author.username }
        : { id: "unknown", username: "unknown" },
      timeLimit: test.timeLimit ?? 0,
      availableForGroups:
        test.availableForGroups?.map((group: { id: string; name: string }) => ({
          id: group.id,
          name: group.name || "Без названия",
        })) ?? [],
      questions:
        test.questions?.map((q) => ({
          id: q.id,
          text: q.text ? q.text : "Без текста",
          type: q.type || "single-choice", // ✅ Добавили type (по умолчанию "single-choice")
          answers: q.answers || [], // ✅ Добавили пустой массив для answers, если его нет
        })) ?? [],
      maximumMarks: test.maximumMarks ?? 0,
      status: test.status || "inactive",
      minimumScores: test.minimumScores || {},
      createdAt: test.createdAt || new Date().toISOString(),
    }));
  } catch {
    throw new Error("Fehler beim Laden von Tests"); // Ошибка при загрузке тестов
  }
};


// ///  Создание нового теста
export const createTestApi = async (testData: Partial<Test>): Promise<Test> => {
  const response = await api.post(API_URL, testData);

  return {
    id: response.data.test.id,
    title: response.data.test.title,
    description: response.data.test.description,
    author: {
      id: response.data.test.author.id,
      username: response.data.test.author.username,
    },
    timeLimit: response.data.test.timeLimit,
    availableForGroups: response.data.test.availableForGroups.map(
      (group: { id: string; name: string }) => ({
        id: group.id,
        name: group.name,
      })
    ),
    questions: response.data.test.questions.map(
      (q: { id: string; text: string }) => ({
        id: q.id,
        text: q.text,
      })
    ),
    maximumMarks: response.data.test.maximumMarks,
    status: response.data.test.status,
    minimumScores: response.data.test.minimumScores,
    createdAt: response.data.test.createdAt,
  };
};

///  Обновление теста
export const updateTestApi = async (
  testId: string,
  data: Partial<Test>
): Promise<Test> => {
  const response = await api.put(`${API_URL}/${testId}`, data);

  return {
    id: response.data.test.id,
    title: response.data.test.title,
    description: response.data.test.description,
    author: {
      id: response.data.test.author.id,
      username: response.data.test.author.username,
    },
    timeLimit: response.data.test.timeLimit,
    availableForGroups: response.data.test.availableForGroups.map(
      (group: { id: string; name: string }) => ({
        id: group.id,
        name: group.name,
      })
    ),
    questions: response.data.test.questions.map(
      (q: { id: string; text: string }) => ({
        id: q.id,
        text: q.text,
      })
    ),
    maximumMarks: response.data.test.maximumMarks,
    status: response.data.test.status,
    minimumScores: response.data.test.minimumScores,
    createdAt: response.data.test.createdAt,
  };
};

///  Удаление теста
export const deleteTestApi = async (testId: string): Promise<string> => {
  await api.delete(`${API_URL}/${testId}`);
  return testId;
};

///  Копирование теста
export const copyTestApi = async (testId: string): Promise<Test> => {
  const response = await api.post(`${API_URL}/${testId}/copy`, {});

  return {
    id: response.data.test.id,
    title: response.data.test.title,
    description: response.data.test.description,
    author: {
      id: response.data.test.author.id,
      username: response.data.test.author.username,
    },
    timeLimit: response.data.test.timeLimit,
    availableForGroups: response.data.test.availableForGroups.map(
      (group: { id: string; name: string }) => ({
        id: group.id,
        name: group.name,
      })
    ),
    questions: response.data.test.questions.map(
      (q: { id: string; text: string }) => ({
        id: q.id,
        text: q.text,
      })
    ),
    maximumMarks: response.data.test.maximumMarks,
    status: response.data.test.status,
    minimumScores: response.data.test.minimumScores,
    createdAt: response.data.test.createdAt,
  };
};

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
