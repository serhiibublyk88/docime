import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { TestsState, Test } from "../../types/reduxTypes";

/// ✅ **Базовый селектор состояния тестов**
export const selectTestsState = (state: RootState): TestsState => state.tests;

/// ✅ **Получаем список всех тестов (гарантируем, что это массив)**
export const selectAllTests = createSelector(
  [selectTestsState],
  (testsState) => testsState.tests ?? []
);

/// ✅ **Получаем состояние загрузки тестов**
export const selectTestsLoading = createSelector(
  [selectTestsState],
  (testsState) => testsState.loading
);

/// ✅ **Получаем текущий тест (если он выбран)**
export const selectCurrentTest = createSelector(
  [selectTestsState],
  (testsState) => testsState.currentTest
);

/// ✅ **Получаем ошибку загрузки тестов (если есть)**
export const selectTestsError = createSelector(
  [selectTestsState],
  (testsState) => testsState.error
);

/// ✅ **Получаем тест по ID (мемоизация предотвращает лишние ререндеры)**
export const selectTestById = (testId: string) =>
  createSelector(
    [selectAllTests],
    (tests) => tests.find((test) => test.id === testId) ?? null
  );

/// ✅ **Получаем тесты, доступные текущему пользователю**
export const selectTestsForUser = (userGroups: string[]) =>
  createSelector([selectAllTests], (tests) =>
    tests.filter((test: Test) =>
      test.availableForGroups.some((group) => userGroups.includes(group.id))
    )
  );

/// ✅ **Получаем список доступных групп для теста**
export const selectAvailableGroupsForTest = createSelector(
  [(state: RootState, testId: string) => selectTestById(testId)(state)],
  (test) => test?.availableForGroups ?? []
);


/// ✅ **Получаем все группы в системе (используется в выпадающем списке)**
export const selectAllGroups = createSelector(
  [(state: RootState) => state.tests.allGroups],
  (allGroups) => allGroups ?? [] // ✅ Гарантируем, что `allGroups` — всегда массив
);

/// ✅ **Получаем список ID групп, привязанных к тесту (для чекбоксов)**
export const selectCheckedGroupsForTest = (testId: string) =>
  createSelector(
    [(state: RootState) => selectAvailableGroupsForTest(state, testId)],
    (availableGroups) => new Set(availableGroups.map((group) => group.id))
  );
