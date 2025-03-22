//apiTypes.ts
export interface User {
  id: string;
  username: string;
  role: number;
  email: string;
  group: string;
}

export interface RegisterData {
  username: string;
  email: string; 
  password: string;
  groupId: string | null;
  role: number;
}

export interface Group {
  id: string;
  name: string;
  description?: string; 
  createdBy?: {
    id: string;
    username: string;
  }; 
  members?: { id: string; username: string }[]; 
}
 

export type AvailableTest = {
  _id: string;
  title: string;
  status: "active" | "inactive";
};


// Один ответ внутри вопроса
export interface AnswerOption {
  id: string;
  text: string;
}

// Вопрос, который приходит при создании попытки
export interface Question {
  id: string;
  questionText: string;
  imageUrl: string | null;
  type: "single-choice" | "multiple-choice" | "number-input" | "text-input";
  answers?: AnswerOption[]; // только для single / multiple
}

// Вопрос после прохождения (в составе результата)
export interface AnsweredQuestion {
  questionText: string;
  imageUrl: string | null;
  type: "single-choice" | "multiple-choice" | "number-input" | "text-input";
  userAnswer: string | string[];
  correctAnswer: string | string[];
  isCorrect: boolean;
  score: number;
}

// Результат попытки (после прохождения теста)
export interface TestResult {
  userId: string;
  testId: {
    _id: string;
    title: string;
    description: string;
    author: string;
    timeLimit: number;
    availableForGroups: string[];
    questions: string[];
    maximumMarks: number;
    status: "active" | "inactive";
    minimumScores: Record<string, number>;
    createdAt: string;
    updatedAt: string;
    __v: number;
  };
  author: string;
  attemptId: string;
  startTime: string;
  finishTime: string;
  timeTaken: number;
  totalScore: number;
  maximumMarks: number;
  percentageScore: number;
  isCompleted: boolean;
  grade: string;
  _id: string;
  questions?: AnsweredQuestion[]; // только в getTestAttempt
}

export interface UserTestResult {
  testTitle: string;
  startTime: string; 
  timeTaken: number; 
  maximumMarks: number;
  obtainedMarks: number;
  percentageScore: number;
  grade: string;
}
