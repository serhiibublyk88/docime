// src/services/testAttemptApi.ts
import { api } from "./clientApi";
import { Question, TestResult } from "../types/apiTypes";

// Создание попытки
export const createTestAttempt = async (
  testId: string
): Promise<{ attemptId: string; questions: Question[] }> => {
  const response = await api.post(`/users/tests/${testId}/attempts`);
  return response.data.data;
};

// Завершение попытки
export const submitTestAttempt = async (
  testId: string,
  attemptId: string,
  answers: { questionId: string; answer: string | string[] }[]
): Promise<TestResult> => {
  const response = await api.post(
    `/users/tests/${testId}/attempts/${attemptId}/submit`,
    { answers }
  );
  return response.data.data;
};

// Получение деталей попытки
export const getTestAttempt = async (
  testId: string,
  attemptId: string
): Promise<TestResult> => {
  const response = await api.get(
    `/users/tests/${testId}/attempts/${attemptId}`
  );
  return response.data.data;
};
