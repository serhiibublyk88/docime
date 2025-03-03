///reduxTypes

export interface User {
  id: string;
  username: string;
  role: number;
  token?: string;
}

export interface AuthState {
  user: User | null;
}

export interface Group {
  id: string; 
  name: string;
  description?: string;
  membersCount: number; 
  createdBy: string;
  createdAt: string;
}

export interface GroupState {
  groups: Group[];
  
}

export interface Test {
  id: string;
  name: string;
  description: string;
  timeLimit: number;
}

export interface TestState {
  tests: Test[];
  currentTest: Test | null;
}

export interface TestResult {
  id: string;
  testId: string;
  userId: string;
  score: number;
  maxScore: number;
  percentage: number;
  grade: number;
}

export interface ResultState {
  results: TestResult[];
}