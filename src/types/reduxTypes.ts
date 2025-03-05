///reduxTypes

/// 🔹 Пользователь
export interface User {
  id: string;
  username: string;
  email?: string;
  role: number;
  token?: string;
}

/// 🔹 Авторизация (Auth)
export interface AuthState {
  user: User | null;
}

/// 🔹 Одна группа
export interface Group {
  id: string;
  name: string;
  description?: string;
  membersCount: number; // Количество участников
  createdBy: string;
  createdAt: string;
}

/// 🔹 Состояние всех групп (множественное число)
export interface GroupsState {
  groups: Group[];
}

/// 🔹 Состояние одной группы (выбранная группа)
export interface GroupState {
  group: Group | null;
  members: User[];
  isLoading: boolean;
  error: string | null;
}

/// 🔹 Тест
export interface Test {
  id: string;
  name: string;
  description: string;
  timeLimit: number;
}

/// 🔹 Состояние тестов
export interface TestState {
  tests: Test[];
  currentTest: Test | null;
}

/// 🔹 Результат теста
export interface TestResult {
  id: string;
  testId: string;
  userId: string;
  score: number;
  maxScore: number;
  percentage: number;
  grade: number;
}

/// 🔹 Состояние результатов тестов
export interface ResultState {
  results: TestResult[];
}
