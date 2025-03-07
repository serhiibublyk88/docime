///reduxTypes

/// 🔹 Пользователь
export interface User {
  _id: string;
  username: string;
  email?: string;
  role: number;
  token?: string;
}

/// 🔹 Авторизация (Auth)
export interface AuthState {
  user: User | null;
}

export interface Group {
  id: string;
  name: string;
  description?: string;
  members: User[];
  createdBy: string;
  createdAt: string;
  groupsForCarousel?: { id: string; name: string }[];
}

/// 🔹 Группы для карусели (id + name)
export interface GroupCarouselItem {
  id: string;
  name: string;
}

/// 🔹 Состояние всех групп
export interface GroupsState {
  groups: Group[];
}

/// 🔹 Состояние одной группы (выбранная группа)
export interface GroupState {
  group: Group | null;
  members: User[];
  groupsForCarousel: GroupCarouselItem[]; // ✅ Исправлено!
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

/// 🔹 Формат данных от API
export interface GroupResponse {
  groupDetails: Group;
  groupsForCarousel: Array<{ id: string; name: string }>;
  members: Array<{
    _id: string;
    name?: string;
    email?: string;
    role?: number;
  }>;
  
}

/// 🔹 Интерфейс, описывающий ответ от сервера после редактирования участника
export interface UpdatedUserResponse {
  _id: string;
  username?: string;
  email?: string;
  role?: number;
}
