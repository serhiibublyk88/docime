export { store } from "./store";
export type { RootState, AppDispatch } from "./store";

/// **Аутентификация**
export { authReducer, authActions } from "./auth/authSlice";
export { loginUser, logoutUser } from "./auth/authActions";
export { selectUser } from "./auth/authSelectors";

/// **Группы**
export { groupsReducer, groupsActions } from "./groups/groupsSlice";
export {
  fetchGroups,
  deleteGroup,
  editGroup,
  createGroup,
} from "./groups/groupsActions";
export { selectGroups } from "./groups/groupsSelectors";

/// **Результаты тестов**
export { resultReducer, resultActions } from "./result/resultSlice";
export { fetchResults } from "./result/resultActions";
export { selectResults } from "./result/resultSelectors";

/// **Обработка ошибок**
export { errorReducer } from "./error/errorSlice";
export { triggerError, resetError } from "./error/errorActions";
export { selectError } from "./error/errorSelectors";

/// **Тесты**
export { testsReducer, setCurrentTest } from "./tests/testsSlice";
export {
  fetchTests,
  fetchAllGroups,
  createTest,
  updateTest,
  deleteTest,
  copyTest,
  updateTestGroups,
} from "./tests/testsActions";
export {
  selectAllTests,
  selectAllGroups,
  selectTestsLoading,
  selectTestsError,
  selectCurrentTest,
  selectAvailableGroupsForTest,
} from "./tests/testsSelectors";

/// **Вопросы**
export { questionsReducer } from "./questions/questionsSlice";
export {
  fetchQuestions,
  createQuestion,
  updateQuestion,
  deleteQuestion,
  addAnswer,
  updateAnswer,
  deleteAnswer,
} from "./questions/questionsActions";
export {
  selectQuestions,
  selectQuestionsLoading,
  selectQuestionsError,
  selectQuestionById,
} from "./questions/questionsSelectors";

/// **Одиночный тест Test
export { testReducer, clearSelectedTest } from "./test/testSlice";
export {
  getTests,
  getTestById,
  addTest,
  editTest,
  removeTest,
  duplicatTest,
  changeTestStatus,
} from "./test/testActions";
export {
  selectAllTest,
  selectTestCount,
  selectSelectedTest,
  selectTestLoading,
  selectTestError,
} from "./test/testSelectors";
