import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Test, TestState } from "../../types/reduxTypes"; 

const initialState: TestState = {
  tests: [],
  currentTest: null,
};

export const testSlice = createSlice({
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

export const testActions = testSlice.actions;
export const testReducer = testSlice.reducer;
