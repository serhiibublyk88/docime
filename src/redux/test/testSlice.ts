import { createSlice } from "@reduxjs/toolkit";
import { TestState } from "../../types/reduxTypes";
import {
  getTests,
  getTestById,
  addTest,
  editTest,
  removeTest,
  duplicatTest,
} from "./testActions";

const initialState: TestState = {
  tests: [],
  selectedTest: null,
  loading: false,
  error: null,
};

export const testSlice = createSlice({
  name: "test",
  initialState,
  reducers: {
    clearSelectedTest: (state) => {
      state.selectedTest = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // ✅ Получение всех тестов
      .addCase(getTests.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getTests.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.tests = payload;
      })
      .addCase(getTests.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload as string;
      })

      // ✅ Получение теста по ID
      .addCase(getTestById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getTestById.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.selectedTest = payload;
      })
      .addCase(getTestById.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload as string;
      })

      // ✅ Создание нового теста
      .addCase(addTest.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addTest.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.tests.push(payload);
      })
      .addCase(addTest.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload as string;
      })

      // ✅ Обновление теста
      .addCase(editTest.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(editTest.fulfilled, (state, { payload }) => {
        state.loading = false;

        // 🔄 Обновляем в общем списке
        state.tests = state.tests.map((test) =>
          test.id === payload.id ? payload : test
        );

        // 🔄 Обновляем выбранный тест, если он открыт
        if (state.selectedTest?.id === payload.id) {
          state.selectedTest = payload;
        }
      })
      .addCase(editTest.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload as string;
      })

      // ✅ Удаление теста
      .addCase(removeTest.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeTest.fulfilled, (state, { meta }) => {
        state.loading = false;
        state.tests = state.tests.filter((test) => test.id !== meta.arg);
        if (state.selectedTest?.id === meta.arg) {
          state.selectedTest = null;
        }
      })
      .addCase(removeTest.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload as string;
      })

      // ✅ Копирование теста
      .addCase(duplicatTest.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(duplicatTest.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.tests.push(payload);
      })
      .addCase(duplicatTest.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload as string;
      });
  },
});

export const { clearSelectedTest } = testSlice.actions;
export const testReducer = testSlice.reducer;
