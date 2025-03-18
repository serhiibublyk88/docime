import { RootState } from "../store";

/**  Получить список всех тестов */
export const selectTests = (state: RootState) => state.test.tests;

/**  Получить выбранный тест */
export const selectSelectedTest = (state: RootState) => state.test.selectedTest;

/**  Получить статус загрузки */
export const selectTestLoading = (state: RootState) => state.test.loading;

/**  Получить ошибку при работе с тестами */
export const selectTestError = (state: RootState) => state.test.error;

/**  Получить количество тестов */
export const selectTestCount = (state: RootState) => state.test.tests.length;
