import { RootState } from "../store";
import { Question } from "../../types/reduxTypes";

/// **Получить все вопросы**
export const selectQuestions = (state: RootState): Question[] =>
  state.questions.questions;

/// **Получить состояние загрузки вопросов**
export const selectQuestionsLoading = (state: RootState): boolean =>
  state.questions.loading; 

/// **Получить ошибку загрузки вопросов**
export const selectQuestionsError = (state: RootState): string | null =>
  state.questions.error; 

/// **Получить конкретный вопрос по ID**
export const selectQuestionById = (
  state: RootState,
  questionId: string
): Question | undefined =>
  state.questions.questions.find((question) => question.id === questionId); 
