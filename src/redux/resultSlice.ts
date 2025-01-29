import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface TestResult {
  id: string;
  testId: string;
  userId: string;
  score: number;
  maxScore: number;
  percentage: number;
  grade: number;
}

interface ResultState {
  results: TestResult[];
}

const initialState: ResultState = {
  results: [],
};

const resultSlice = createSlice({
  name: "result",
  initialState,
  reducers: {
    setResults: (state, action: PayloadAction<TestResult[]>) => {
      state.results = action.payload;
    },
  },
});

export const { setResults } = resultSlice.actions;
export default resultSlice.reducer;
