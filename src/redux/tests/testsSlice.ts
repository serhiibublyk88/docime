import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TestsState, Test } from "../../types/reduxTypes";
import {
  fetchTests,
  fetchAllGroups,
  createTest,
  updateTest,
  deleteTest,
  copyTest,
  updateTestGroups,
} from "./testsActions";

const initialState: TestsState = {
  tests: [],
  currentTest: null,
  loading: false,
  error: null,
  allGroups: [], // ✅ Список всех доступных групп
};

const testsSlice = createSlice({
  name: "tests",
  initialState,
  reducers: {
    setCurrentTest(state, action: PayloadAction<Test | null>) {
      state.currentTest = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // ✅ **Получение тестов**
      .addCase(fetchTests.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTests.fulfilled, (state, action: PayloadAction<Test[]>) => {
        state.loading = false;
        state.tests = action.payload ?? [];
      })
      .addCase(fetchTests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Fehler beim Abrufen der Tests";
      })

      // ✅ **Получение всех групп (не только доступных для теста)**
      .addCase(fetchAllGroups.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        fetchAllGroups.fulfilled,
        (state, action: PayloadAction<{ id: string; name: string }[]>) => {
          state.loading = false;
          state.allGroups = action.payload ?? [];
        }
      )
      .addCase(fetchAllGroups.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Fehler beim Abrufen der Gruppen";
      })

      // ✅ **Создание теста**
      .addCase(createTest.fulfilled, (state, action: PayloadAction<Test>) => {
        state.tests.push(action.payload);
      })

      // ✅ **Обновление теста**
      .addCase(updateTest.fulfilled, (state, action: PayloadAction<Test>) => {
        state.tests = state.tests.map((test) =>
          test.id === action.payload.id ? action.payload : test
        );
        if (state.currentTest?.id === action.payload.id) {
          state.currentTest = action.payload;
        }
      })

      // ✅ **Удаление теста**
      .addCase(deleteTest.fulfilled, (state, action: PayloadAction<string>) => {
        state.tests = state.tests.filter((test) => test.id !== action.payload);
        if (state.currentTest?.id === action.payload) {
          state.currentTest = null;
        }
      })

      // ✅ **Копирование теста**
      .addCase(copyTest.fulfilled, (state, action: PayloadAction<Test>) => {
        state.tests.push(action.payload);
      })

      // ✅ **Обновление доступных групп у теста**
      .addCase(
        updateTestGroups.fulfilled,
        (
          state,
          action: PayloadAction<{
            testId: string;
            availableForGroups: { id: string; name: string }[];
          }>
        ) => {
          console.log(
            `✅ [Slice] Группы для теста ${action.payload.testId} обновлены:`,
            action.payload.availableForGroups
          );

          // 🔹 **Фикс: Обновляем тест в общем списке** без потери данных
          const testIndex = state.tests.findIndex(
            (test) => test.id === action.payload.testId
          );
          if (testIndex !== -1) {
            state.tests[testIndex].availableForGroups =
              action.payload.availableForGroups;
          }

          // 🔹 **Фикс: Безопасное обновление currentTest** (если активный тест совпадает)
          if (state.currentTest?.id === action.payload.testId) {
            state.currentTest = {
              ...state.currentTest,
              availableForGroups: action.payload.availableForGroups,
            };
          }

          // ✅ **Фикс: После обновления групп загружаем все тесты**
          state.loading = true;
        }
      )
      .addCase(updateTestGroups.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Fehler beim Aktualisieren der Gruppen";
      });
  },
});

export const { setCurrentTest } = testsSlice.actions;
export const testsReducer = testsSlice.reducer;
