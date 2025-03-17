import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import {
  fetchQuestionsApi,
  createQuestionApi,
  updateQuestionApi,
  deleteQuestionApi,
  addAnswerApi,
  updateAnswerApi,
  deleteAnswerApi,
} from "../../services/questionsApi";
import { Question, Answer } from "../../types/reduxTypes";

/// **Функция обработки ошибок**
const handleApiError = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message || "API-Fehler";
  }
  if (error instanceof Error) {
    return error.message;
  }
  return "Unbekannter Fehler";
};

/// **Получить все вопросы теста**
export const fetchQuestions = createAsyncThunk<
  Question[],
  string,
  { rejectValue: string }
>("questions/fetchAll", async (testId, { rejectWithValue }) => {
  try {
    return await fetchQuestionsApi(testId);
  } catch (error: unknown) {
    console.error("Error fetching questions:", error);
    return rejectWithValue(handleApiError(error));
  }
});

/// **Создать вопрос**
export const createQuestion = createAsyncThunk<
  Question,
  { testId: string; questionData: Omit<Question, "id"> },
  { rejectValue: string }
>("questions/create", async ({ testId, questionData }, { rejectWithValue }) => {
  try {
    return await createQuestionApi(testId, questionData);
  } catch (error: unknown) {
    console.error("Error creating question:", error);
    return rejectWithValue(handleApiError(error));
  }
});

/// **Обновить вопрос**
export const updateQuestion = createAsyncThunk<
  Question,
  { testId: string; questionId: string; questionData: Omit<Question, "id"> },
  { rejectValue: string }
>(
  "questions/update",
  async ({ testId, questionId, questionData }, { rejectWithValue }) => {
    try {
      return await updateQuestionApi(testId, questionId, questionData);
    } catch (error: unknown) {
      console.error("Error updating question:", error);
      return rejectWithValue(handleApiError(error));
    }
  }
);

/// **Удалить вопрос**
export const deleteQuestion = createAsyncThunk<
  string,
  { testId: string; questionId: string },
  { rejectValue: string }
>("questions/delete", async ({ testId, questionId }, { rejectWithValue }) => {
  try {
    return await deleteQuestionApi(testId, questionId);
  } catch (error: unknown) {
    console.error("Error deleting question:", error);
    return rejectWithValue(handleApiError(error));
  }
});

/// **Добавить ответ**
export const addAnswer = createAsyncThunk<
  { questionId: string; answer: Answer },
  { testId: string; questionId: string; answer: Omit<Answer, "id"> },
  { rejectValue: string }
>(
  "questions/addAnswer",
  async ({ testId, questionId, answer }, { rejectWithValue }) => {
    try {
      const response = await addAnswerApi(testId, questionId, answer);
      return { questionId, answer: response };
    } catch (error: unknown) {
      console.error("Error adding answer:", error);
      return rejectWithValue(handleApiError(error));
    }
  }
);

/// **Обновить ответ**
export const updateAnswer = createAsyncThunk<
  { questionId: string; answer: Answer },
  {
    testId: string;
    questionId: string;
    answerId: string;
    answer: Omit<Answer, "id">;
  },
  { rejectValue: string }
>(
  "questions/updateAnswer",
  async ({ testId, questionId, answerId, answer }, { rejectWithValue }) => {
    try {
      const response = await updateAnswerApi(
        testId,
        questionId,
        answerId,
        answer
      );
      return { questionId, answer: response };
    } catch (error: unknown) {
      console.error("Error updating answer:", error);
      return rejectWithValue(handleApiError(error));
    }
  }
);

/// **Удалить ответ**
export const deleteAnswer = createAsyncThunk<
  { questionId: string; answerId: string },
  { testId: string; questionId: string; answerId: string },
  { rejectValue: string }
>(
  "questions/deleteAnswer",
  async ({ testId, questionId, answerId }, { rejectWithValue }) => {
    try {
      await deleteAnswerApi(testId, questionId, answerId);
      return { questionId, answerId };
    } catch (error: unknown) {
      console.error("Error deleting answer:", error);
      return rejectWithValue(handleApiError(error));
    }
  }
);
