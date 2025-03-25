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
  
  fetchAllGroups,
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



/// **Пользователь**
export { userReducer, clearUserError } from "./user/userSlice";
export {
  fetchAvailableTests,
  fetchUserTestResults,
} from "./user/userActions";
export {
  selectAvailableTests,
  selectUserTestResults,
  selectUserLoading,
  selectUserError,
} from "./user/userSelectors";


/// **Прохождение теста (попытки)**
export { testAttemptReducer } from "./testAttempt/testAttemptSlice";
export {
  fetchCreateTestAttempt,
  fetchSubmitTestAttempt,
  fetchGetTestAttempt,
} from "./testAttempt/testAttemptActions";
export {
  selectAttemptId,
  selectAttemptQuestions,
  selectTestResult,
  selectAttemptLoading,
  selectAttemptError,
  selectAttemptTimeLimit,
} from "./testAttempt/testAttemptSelectors";


/// **Результаты тестов для создателя**
export { testResultsReducer, setSelectedTestId, setSelectedGroupId, resetTestResultsState } from "./testResults/testResultsSlice";
export { fetchTestResultsForCreator } from "./testResults/testResultsActions";
export {
  selectTestResults,
  selectTestResultsLoading,
  selectTestResultsError,
  selectSelectedTestId,
  selectSelectedGroupId,
  selectTestName,
  selectTestGroups,
  selectParticipantsForSelectedGroup,
} from "./testResults/testResultsSelectors";


