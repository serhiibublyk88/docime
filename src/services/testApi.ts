import { api } from "./clientApi";
import { Test } from "../types/reduxTypes";

/** Получить все тесты */
export const fetchTests = async (): Promise<Test[]> => {
  try {
    const { data } = await api.get<Test[]>("/tests");
    return data;
  } catch {
    throw new Error("Fehler beim Laden von Tests");
  }
};

/** Получить тест по ID */
export const fetchTestById = async (testId: string): Promise<Test> => {
  try {
    const { data } = await api.get<Test>(`/tests/${testId}`);
    return data;
  } catch {
    throw new Error("Fehler beim Laden des Tests");
  }
};

/** Создать новый тест */
export const createTest = async (
  test: Omit<Test, "id" | "createdAt">
): Promise<Test> => {
  try {
    const { data } = await api.post<Test>("/tests", test);
    return data;
  } catch {
    throw new Error("Fehler beim Erstellen des Tests");
  }
};

/** Обновить тест */
export const updateTest = async (
  testId: string,
  testData: Partial<Test>
): Promise<Test> => {
  try {
    const { data } = await api.put<Test>(`/tests/${testId}`, testData);
    return data;
  } catch {
    throw new Error("Fehler beim Aktualisieren des Tests");
  }
};

/** Удалить тест */
export const deleteTest = async (testId: string): Promise<void> => {
  try {
    await api.delete(`/tests/${testId}`);
  } catch {
    throw new Error("Fehler beim Löschen des Tests");
  }
};

/** Копировать тест */
export const duplicateTest = async (testId: string): Promise<Test> => {
  try {
    const { data } = await api.post<Test>(`/tests/${testId}/duplicate`);
    return data; 
  } catch {
    throw new Error("Fehler beim Kopieren des Tests");
  }
};
