import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Test {
  id: string;
  name: string;
  description: string;
  timeLimit: number;
}

interface TestState {
  tests: Test[];
  currentTest: Test | null;
}

const initialState: TestState = {
  tests: [],
  currentTest: null,
};

const testSlice = createSlice({
  name: "test",
  initialState,
  reducers: {
    setTests: (state, action: PayloadAction<Test[]>) => {
      state.tests = action.payload;
    },
    setCurrentTest: (state, action: PayloadAction<Test>) => {
      state.currentTest = action.payload;
    },
  },
});

export const { setTests, setCurrentTest } = testSlice.actions;
export default testSlice.reducer;
