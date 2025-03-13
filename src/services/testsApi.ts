import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { Test } from "../types/reduxTypes";

const API_URL = "http://localhost:5000/api/tests";


/// ✅ Обработчик ошибок
const handleApiError = (error: unknown): string => {
  if (error instanceof Error) {
    console.error("❌ [API Error]:", error.message);
    return error.message || "Fehler beim Abrufen der Tests";
  }
  return "Unbekannter Fehler beim Abrufen der Tests";
};



/// ✅ Получение списка тестов
export const fetchTestsApi = async (): Promise<Test[]> => {
  try {
    console.log("🔄 [API] Запрашиваем тесты...");
    const response = await axios.get<Test[]>(API_URL, {
      withCredentials: true,
    });

    console.log(`✅ [API] Загружено тестов: ${response.data.length}`);

    return response.data.map((test) => ({
      id: test.id, // ✅ Используем `id`, так как маппер на бэке уже конвертировал `_id`
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
        test.questions?.map((q: { id: string; text: string }) => ({
          id: q.id,
          text: q.text || "Без текста",
        })) ?? [],
      maximumMarks: test.maximumMarks ?? 0,
      status: test.status || "inactive",
      minimumScores: test.minimumScores || {},
      createdAt: test.createdAt || new Date().toISOString(),
    }));
  } catch (error) {
    console.error("❌ [API] Ошибка загрузки тестов:", error);
    throw new Error("Fehler beim Laden von Tests");
  }
};

/// ✅ Создание нового теста
export const createTestApi = async (testData: Partial<Test>): Promise<Test> => {
  const response = await axios.post(API_URL, testData, {
    withCredentials: true,
  });

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

/// ✅ Обновление теста
export const updateTestApi = async (
  testId: string,
  data: Partial<Test>
): Promise<Test> => {
  const response = await axios.put(`${API_URL}/${testId}`, data, {
    withCredentials: true,
  });

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

/// ✅ Удаление теста
export const deleteTestApi = async (testId: string): Promise<string> => {
  await axios.delete(`${API_URL}/${testId}`, { withCredentials: true });
  return testId;
};

/// ✅ Копирование теста
export const copyTestApi = async (testId: string): Promise<Test> => {
  const response = await axios.post(
    `${API_URL}/${testId}/copy`,
    {},
    { withCredentials: true }
  );

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


/// ✅ API для получения всех групп теста
export const fetchGroupsApi = async (testId: string) => {
  try {
    console.log(`🔄 [API] Запрашиваем группы для теста ${testId}...`);
    const response = await axios.get(`${API_URL}/${testId}/available-groups`, {
      withCredentials: true,
    });

    console.log(`✅ [API] Получены группы:`, response.data);

    return response.data.availableForGroups.map(
      (group: { id: string; name: string }) => ({
        id: group.id,
        name: group.name,
      })
    );
  } catch (error) {
    console.error("❌ [API] Ошибка загрузки групп:", error);
    throw error;
  }
};

/// ✅ API для получения всех групп системы (не только для конкретного теста!)
export const fetchAllGroupsApi = async () => {
  try {
    console.log("🔄 [API] Запрашиваем все группы...");
    const response = await axios.get("http://localhost:5000/api/groups", {
      withCredentials: true,
    });

    console.log("✅ [API] Получены все группы:", response.data);

    return response.data.map((group: { id: string; name: string }) => ({
      id: group.id,
      name: group.name,
    }));
  } catch (error) {
    console.error("❌ [API] Ошибка загрузки всех групп:", error);
    throw error;
  }
};

/// ✅ THUNK для загрузки всех групп
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
    console.error("❌ [THUNK] Ошибка загрузки всех групп:", error);
    return rejectWithValue(handleApiError(error));
  }
});



/// ✅ API для обновления групп теста

export const updateTestGroupsApi = async (
  testId: string,
  groupId: string,
  action: "add" | "remove"
) => {
  if (!testId || !groupId || !["add", "remove"].includes(action)) {
    console.warn("⚠️ [API] Некорректные параметры для updateTestGroupsApi:", {
      testId,
      groupId,
      action,
    });
    throw new Error("Ungültige Parameter für updateTestGroupsApi");
  }

  try {
    console.log(
      `📡 [API] Вызов updateTestGroupsApi с параметрами:`,
      JSON.stringify({ testId, groupId, action }, null, 2)
    );

    console.log(
      `🔄 [API] Отправляем PATCH запрос: ${
        action === "add" ? "Добавляем" : "Удаляем"
      } группу ${groupId} в тесте ${testId}...`
    );

    // Проверка типов ID перед отправкой
    if (typeof testId !== "string" || typeof groupId !== "string") {
      console.error("❌ [API] Ошибка: testId или groupId не строка!", {
        testId,
        groupId,
      });
      throw new Error("Ungültiges Test- oder Gruppen-ID-Format!");
    }

    const response = await axios.patch(
      `${API_URL}/${testId}/available-groups`,
      { groupId, action },
      { withCredentials: true }
    );

    console.log(
      `✅ [API] Группы теста ${testId} обновлены. Доступно: ${response.data.availableForGroups.length} групп`
    );

    return {
      testId,
      availableForGroups: response.data.availableForGroups.map(
        (group: { id: string; name: string }) => ({
          id: group.id,
          name: group.name,
        })
      ),
    };
  } catch (error) {
    console.error(
      `❌ [API] Ошибка обновления групп для теста ${testId}:`,
      error
    );

    if (axios.isAxiosError(error) && error.response?.data) {
      console.error("❌ [API] Ошибка сервера:", error.response.data);
    }

    throw error;
  }
};


