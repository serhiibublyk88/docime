///  Пользователь
export interface User {
  _id: string;
  username: string;
  email?: string;
  role: number;
  token?: string;
}

///  Состояние аутентификации
export interface AuthState {
  user: User | null;
}

///  Группа
export interface Group {
  id: string;
  name: string;
  description?: string;
  members: { id: string; name: string }[]; // ✅ Исправлено: Упрощенный формат
  createdBy: string;
  createdAt: string;
  groupsForCarousel?: { id: string; name: string }[];
  membersCount?: number;
}

///  Элемент карусели групп
export interface GroupCarouselItem {
  id: string;
  name: string;
}

///  Состояние всех групп
export interface GroupsState {
  groups: Group[];
}

///  Состояние одной группы
export interface GroupState {
  group: Group | null;
  members: { id: string; name: string }[]; // ✅ Исправлено
  groupsForCarousel: GroupCarouselItem[];
  isLoading: boolean;
  error: string | null;
}

///  Вопрос (используется в `Test`)
export interface Question {
  id: string;
  text: string;
}

///  Тест
export interface Test {
  id: string;
  title: string;
  description: string;
  author: { id: string; username: string }; // ✅ Исправлено: автор теперь объект
  timeLimit: number;
  availableForGroups: { id: string; name: string }[];
  questions: Question[]; // ✅ Исправлено: теперь массив объектов, а не строк
  maximumMarks: number;
  status: "active" | "inactive";
  minimumScores: Record<number, number>;
  createdAt: string;
}

///  Состояние тестов (множественное число)
export interface TestsState {
  tests: Test[];
  currentTest: Test | null;
  loading: boolean;
  error: string | null;
  allGroups: { id: string; name: string }[]; // Добавлено поле для групп
}

///  Результат теста
export interface TestResult {
  id: string;
  testId: string;
  userId: string;
  score: number;
  maxScore: number;
  percentage: number;
  grade: number;
  startTime: string | null; // ✅ Добавлено из backend
  finishTime: string | null; // ✅ Добавлено из backend
  timeTaken: number; // ✅ Добавлено из backend
}

///  Состояние результатов тестов
export interface ResultState {
  results: TestResult[];
}

///  Ответ от API при получении группы
export interface GroupResponse {
  groupDetails: Group;
  groupsForCarousel: Array<{ id: string; name: string }>;
  members: Array<{
    id: string;
    name?: string;
    email?: string;
    role?: number;
  }>;
}

///  Ответ от API при обновлении пользователя
export interface UpdatedUserResponse {
  _id: string;
  username?: string;
  email?: string;
  role?: number;
}

///  Типы экшенов Redux для тестов
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
