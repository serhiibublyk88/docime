import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { TestsState, Test } from "../../types/reduxTypes";

///  Базовый селектор состояния тестов
export const selectTestsState = (state: RootState): TestsState => state.tests;

///  Получаем список всех тестов
export const selectAllTests = createSelector(
  selectTestsState,
  (testsState) => testsState.tests || [] 
);

///  Получаем состояние загрузки
export const selectTestsLoading = createSelector(
  selectTestsState,
  (testsState) => testsState.loading
);

///  Получаем текущий тест (если он выбран)
export const selectCurrentTest = createSelector(
  selectTestsState,
  (testsState) => testsState.currentTest
);

///  Получаем ошибку загрузки тестов (если есть)
export const selectTestsError = createSelector(
  selectTestsState,
  (testsState) => testsState.error
);

///  Получаем тест по ID
export const selectTestById = (testId: string) =>
  createSelector(
    selectAllTests,
    (tests) => tests.find((test) => test.id === testId) || null 
  );

///  Получаем тесты, доступные текущему пользователю
export const selectTestsForUser = (userId: string) =>
  createSelector(selectAllTests, (tests) =>
    tests.filter(
      (test: Test) =>
        test.availableForGroups?.some((group) => group?.id === userId) 
    )
  );
