import { RootState } from "../store";

// Получить ID попытки
export const selectAttemptId = (state: RootState) =>
  state.testAttempt.attemptId;

// Получить список вопросов
export const selectAttemptQuestions = (state: RootState) =>
  state.testAttempt.questions;

// Получить результат теста (если завершён)
export const selectTestResult = (state: RootState) => state.testAttempt.result;

// Получить статус загрузки
export const selectAttemptLoading = (state: RootState) =>
  state.testAttempt.loading;

// Получить ошибку (если есть)
export const selectAttemptError = (state: RootState) => state.testAttempt.error;
