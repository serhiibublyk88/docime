import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { QuestionsState, Question, Answer } from "../../types/reduxTypes";
import {
  fetchQuestions,
  createQuestion,
  updateQuestion,
  deleteQuestion,
  addAnswer,
  updateAnswer,
  deleteAnswer,
} from "./questionsActions";

/// **Начальное состояние**
const initialState: QuestionsState = {
  questions: [],
  loading: false,
  error: null,
};

/// **Создаём слайс**
const questionsSlice = createSlice({
  name: "questions",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      /// **Загрузка вопросов**
      .addCase(fetchQuestions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchQuestions.fulfilled,
        (state, action: PayloadAction<Question[]>) => {
          state.loading = false;
          state.questions = action.payload;
        }
      )
      .addCase(
        fetchQuestions.rejected,
        (state, action: PayloadAction<string | undefined>) => {
          state.loading = false;
          state.error = action.payload ?? "Fehler beim Laden der Fragen";
        }
      )

      /// **Создание вопроса**
      .addCase(
        createQuestion.fulfilled,
        (state, action: PayloadAction<Question>) => {
          state.questions.push(action.payload);
        }
      )
      .addCase(
        createQuestion.rejected,
        (state, action: PayloadAction<string | undefined>) => {
          state.error = action.payload ?? "Fehler beim Erstellen der Frage";
        }
      )

      /// **Обновление вопроса**
      .addCase(
        updateQuestion.fulfilled,
        (state, action: PayloadAction<Question>) => {
          const index = state.questions.findIndex(
            (q) => q.id === action.payload.id
          );
          if (index !== -1) {
            state.questions[index] = action.payload;
          }
        }
      )
      .addCase(
        updateQuestion.rejected,
        (state, action: PayloadAction<string | undefined>) => {
          state.error = action.payload ?? "Fehler beim Aktualisieren der Frage";
        }
      )

      /// **Удаление вопроса**
      .addCase(
        deleteQuestion.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.questions = state.questions.filter(
            (q) => q.id !== action.payload
          );
        }
      )
      .addCase(
        deleteQuestion.rejected,
        (state, action: PayloadAction<string | undefined>) => {
          state.error = action.payload ?? "Fehler beim Löschen der Frage";
        }
      )

      /// **Добавление ответа**
      .addCase(
        addAnswer.fulfilled,
        (
          state,
          action: PayloadAction<{ questionId: string; answer: Answer }>
        ) => {
          const question = state.questions.find(
            (q) => q.id === action.payload.questionId
          );
          if (question) {
            question.answers.push(action.payload.answer);
          }
        }
      )
      .addCase(
        addAnswer.rejected,
        (state, action: PayloadAction<string | undefined>) => {
          state.error = action.payload ?? "Fehler beim Hinzufügen der Antwort";
        }
      )

      /// **Обновление ответа**
      .addCase(
        updateAnswer.fulfilled,
        (
          state,
          action: PayloadAction<{ questionId: string; answer: Answer }>
        ) => {
          const question = state.questions.find(
            (q) => q.id === action.payload.questionId
          );
          if (question) {
            const answerIndex = question.answers.findIndex(
              (a) => a.id === action.payload.answer.id
            );
            if (answerIndex !== -1) {
              question.answers[answerIndex] = action.payload.answer;
            }
          }
        }
      )
      .addCase(
        updateAnswer.rejected,
        (state, action: PayloadAction<string | undefined>) => {
          state.error =
            action.payload ?? "Fehler beim Aktualisieren der Antwort";
        }
      )

      /// **Удаление ответа**
      .addCase(
        deleteAnswer.fulfilled,
        (
          state,
          action: PayloadAction<{ questionId: string; answerId: string }>
        ) => {
          const question = state.questions.find(
            (q) => q.id === action.payload.questionId
          );
          if (question) {
            question.answers = question.answers.filter(
              (a) => a.id !== action.payload.answerId
            );
          }
        }
      )
      .addCase(
        deleteAnswer.rejected,
        (state, action: PayloadAction<string | undefined>) => {
          state.error = action.payload ?? "Fehler beim Löschen der Antwort";
        }
      );
  },
});


export const questionsReducer = questionsSlice.reducer;
