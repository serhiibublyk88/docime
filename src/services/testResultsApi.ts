// src/services/testResultsApi.ts

import { api } from "./clientApi";
import { TestResultsForCreator } from "../types/apiTypes";

// Получение результатов теста для создателя
export const getTestResults = async (
  testId: string
): Promise<TestResultsForCreator> => {
  const response = await api.get<{
    testId: string;
    testName: string;
    groups: TestResultsForCreator["groups"];
  }>(`/tests/${testId}/results`);
  return response.data;
};
