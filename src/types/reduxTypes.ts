/// **Пользователь**
export interface User {
  _id: string;
  username: string;
  email?: string;
  role: number;
  token?: string;
}

/// **Состояние аутентификации**
export interface AuthState {
  user: User | null;
}

/// **Группа**
export interface Group {
  id: string;
  name: string;
  description?: string;
  members: User[];
  createdBy: string;
  createdAt: string;
  groupsForCarousel?: { id: string; name: string }[];
  membersCount?: number;
}

/// **Элемент карусели групп**
export interface GroupCarouselItem {
  id: string;
  name: string;
}

/// **Состояние всех групп**
export interface GroupsState {
  groups: Group[];
}

/// **Состояние одной группы**
export interface GroupState {
  group: Group | null;
  members: User[];
  groupsForCarousel: { id: string; name: string }[];
  isLoading: boolean;
  error: string | null;
}

/// **Ответ**
export interface Answer {
  id: string;
  text: string;
  score: number;
}

/// **Вопрос**
export interface Question {
  id: string;
  text: string;
  type: "single" | "multiple" | "number" | "text";
  image?: File | string; // Файл или URL-строка
  answers: Answer[];
}

/// **Состояние вопросов**
export interface QuestionsState {
  questions: Question[];
  loading: boolean;
  error: string | null;
}

/// **Тест**
export interface Test {
  id: string;
  title: string;
  description: string;
  author: { id: string; username: string };
  timeLimit: number;
  availableForGroups: { id: string; name: string }[];
  questions: Question[];
  maximumMarks: number;
  status: "active" | "inactive";
  minimumScores: Record<number, number>;
  createdAt: string;
}

/// **Состояние тестов**
export interface TestsState {
  tests: Test[];
  currentTest: Test | null;
  loading: boolean;
  error: string | null;
  allGroups: { id: string; name: string }[];
}

/// **Результат теста**
export interface TestResult {
  id: string;
  testId: string;
  userId: string;
  score: number;
  maxScore: number;
  percentage: number;
  grade: number;
  startTime: string | null;
  finishTime: string | null;
  timeTaken: number;
}

/// **Состояние результатов тестов**
export interface ResultState {
  results: TestResult[];
}

/// **Ответ от API при получении группы**
export interface GroupResponse {
  groupDetails: Group;
  groupsForCarousel: { id: string; name: string }[];
  members: User[];
}

/// **Ответ от API при обновлении пользователя**
export interface UpdatedUserResponse {
  _id: string;
  username?: string;
  email?: string;
  role?: number;
}

/// **Типы экшенов Redux для тестов**
export enum TestsActionTypes {
  FETCH_TESTS_REQUEST = "tests/fetchTestsRequest",
  FETCH_TESTS_SUCCESS = "tests/fetchTestsSuccess",
  FETCH_TESTS_FAILURE = "tests/fetchTestsFailure",

  CREATE_TEST_SUCCESS = "tests/createTestSuccess",
  UPDATE_TEST_SUCCESS = "tests/updateTestSuccess",
  DELETE_TEST_SUCCESS = "tests/deleteTestSuccess",
  COPY_TEST_SUCCESS = "tests/copyTestSuccess",

  UPDATE_TEST_GROUPS_SUCCESS = "tests/updateTestGroupsSuccess",
}

/// **Типы экшенов Redux для вопросов**
export enum QuestionsActionTypes {
  FETCH_QUESTIONS_REQUEST = "questions/fetchQuestionsRequest",
  FETCH_QUESTIONS_SUCCESS = "questions/fetchQuestionsSuccess",
  FETCH_QUESTIONS_FAILURE = "questions/fetchQuestionsFailure",

  CREATE_QUESTION_SUCCESS = "questions/createQuestionSuccess",
  UPDATE_QUESTION_SUCCESS = "questions/updateQuestionSuccess",
  DELETE_QUESTION_SUCCESS = "questions/deleteQuestionSuccess",

  ADD_ANSWER_SUCCESS = "questions/addAnswerSuccess",
  UPDATE_ANSWER_SUCCESS = "questions/updateAnswerSuccess",
  DELETE_ANSWER_SUCCESS = "questions/deleteAnswerSuccess",
}
