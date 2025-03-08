import axios from "axios";
import { Test } from "../types/reduxTypes";

const API_URL = "http://localhost:5000/api/tests";

///  Получение списка тестов
export const fetchTestsApi = async (): Promise<Test[]> => {
  try {
    const response = await axios.get(API_URL, {
      withCredentials: true, 
    });
    return response.data;
  } catch  {
    throw new Error("Fehler beim Laden von Tests");
  }
};

///  Создание нового теста
export const createTestApi = async (testData: Partial<Test>): Promise<Test> => {
  const response = await axios.post(API_URL, testData, {
    withCredentials: true, 
  });
  return response.data.test;
};

///  Обновление теста
export const updateTestApi = async (
  testId: string,
  data: Partial<Test>
): Promise<Test> => {
  const response = await axios.put(`${API_URL}/${testId}`, data, {
    withCredentials: true, 
  });
  return response.data.test;
};

///  Удаление теста
export const deleteTestApi = async (testId: string): Promise<string> => {
  await axios.delete(`${API_URL}/${testId}`, {
    withCredentials: true, 
  });
  return testId;
};

///  Копирование теста
export const copyTestApi = async (testId: string): Promise<Test> => {
  const response = await axios.post(
    `${API_URL}/${testId}/copy`,
    {},
    {
      withCredentials: true, 
    }
  );
  return response.data.test;
};

/// Обновление доступных групп
export const updateTestGroupsApi = async (
  testId: string,
  groupId: string,
  action: "add" | "remove"
): Promise<{
  testId: string;
  availableForGroups: { id: string; name: string }[];
}> => {
  const response = await axios.patch(
    `${API_URL}/${testId}/available-groups`,
    { groupId, action },
    { withCredentials: true } 
  );
  return { testId, availableForGroups: response.data.availableForGroups };
};
