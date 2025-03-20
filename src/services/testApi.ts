import { api } from "./clientApi";
import { Test } from "../types/reduxTypes";

/** Получить все тесты */
export const fetchTests = async (options = {}): Promise<Test[]> => {
  try {
    const { data } = await api.get<Test[]>("/tests", {
      withCredentials: true,
      ...options,
    });
    return data;
  } catch (error: unknown) {
    throw new Error(
      error instanceof Error ? error.message : "Fehler beim Laden von Tests"
    );
  }
};

/** Получить тест по ID */
export const fetchTestById = async (
  testId: string,
  options = {}
): Promise<Test> => {
  try {
    const { data } = await api.get<Test>(`/tests/${testId}`, {
      withCredentials: true,
      ...options,
    });
    return data;
  } catch (error: unknown) {
    throw new Error(
      error instanceof Error ? error.message : "Fehler beim Laden des Tests"
    );
  }
};

/** Создать новый тест */
export const createTest = async (
  test: Omit<Test, "id" | "createdAt">,
  options = {}
): Promise<Test> => {
  try {
    const { data } = await api.post<Test>("/tests", test, {
      withCredentials: true,
      ...options,
    });
    return data;
  } catch (error: unknown) {
    throw new Error(
      error instanceof Error ? error.message : "Fehler beim Erstellen des Tests"
    );
  }
};

/** Обновить тест */
export const updateTest = async (
  testId: string,
  testData: Partial<Test>,
  options = {}
): Promise<Test> => {
  try {
    const { data } = await api.put<Test>(`/tests/${testId}`, testData, {
      withCredentials: true,
      ...options,
    });
    return data;
  } catch (error: unknown) {
    throw new Error(
      error instanceof Error
        ? error.message
        : "Fehler beim Aktualisieren des Tests"
    );
  }
};

/** Удалить тест */
export const deleteTest = async (
  testId: string,
  options = {}
): Promise<void> => {
  try {
    await api.delete(`/tests/${testId}`, {
      withCredentials: true,
      ...options,
    });
  } catch (error: unknown) {
    throw new Error(
      error instanceof Error ? error.message : "Fehler beim Löschen des Tests"
    );
  }
};

/** Копировать тест */
export const duplicateTest = async (
  testId: string,
  options = {}
): Promise<Test> => {
  try {
    const { data } = await api.post<Test>(`/tests/${testId}/copy`, null, {
      withCredentials: true,
      ...options,
    });
    return data;
  } catch (error: unknown) {
    throw new Error(
      error instanceof Error ? error.message : "Fehler beim Kopieren des Tests"
    );
  }
};
