import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TestResult, ResultState } from "../../types/reduxTypes"; 

const initialState: ResultState = {
  results: [],
};

export const resultSlice = createSlice({
  name: "result",
  initialState,
  reducers: {
    setResults: (state, action: PayloadAction<TestResult[]>) => {
      state.results = action.payload;
    },
  },
});

export const resultActions = resultSlice.actions;
export const resultReducer = resultSlice.reducer;
