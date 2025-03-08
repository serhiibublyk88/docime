import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TestsState, Test } from "../../types/reduxTypes";
import {
  fetchTests,
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
      ///  Получение тестов
      .addCase(fetchTests.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTests.fulfilled, (state, action: PayloadAction<Test[]>) => {
        state.loading = false;
        state.tests = action.payload || []; 
      })
      .addCase(fetchTests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to load tests";
      })

      ///  Создание теста 
      .addCase(createTest.fulfilled, (state, action: PayloadAction<Test>) => {
        const existingTest = state.tests.find(
          (test) => test.id === action.payload.id
        );
        if (!existingTest) {
          state.tests.push(action.payload);
        }
      })

      ///  Обновление теста 
      .addCase(updateTest.fulfilled, (state, action: PayloadAction<Test>) => {
        state.tests = state.tests.map((test) =>
          test.id === action.payload.id ? action.payload : test
        );
      })

      ///  Удаление теста
      .addCase(deleteTest.fulfilled, (state, action: PayloadAction<string>) => {
        state.tests = state.tests.filter((test) => test.id !== action.payload);
      })

      ///  Копирование теста (исправлено добавление без дублирования)
      .addCase(copyTest.fulfilled, (state, action: PayloadAction<Test>) => {
        const existingTest = state.tests.find(
          (test) => test.id === action.payload.id
        );
        if (!existingTest) {
          state.tests.push(action.payload);
        }
      })

      ///  Обновление доступных групп
      .addCase(updateTestGroups.fulfilled, (state, action) => {
        const test = state.tests.find((t) => t.id === action.payload.testId);
        if (test) {
          test.availableForGroups = action.payload.availableForGroups;
        }
      });
  },
});


export const { setCurrentTest } = testsSlice.actions;


export const testsReducer = testsSlice.reducer;
