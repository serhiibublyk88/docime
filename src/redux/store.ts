import { configureStore } from "@reduxjs/toolkit";
import { errorReducer } from "./error/errorSlice";
import { authReducer } from "./auth/authSlice";
import { testsReducer } from "./tests/testsSlice";
import { groupsReducer } from "./groups/groupsSlice";
import { groupReducer } from "./group/groupSlice";
import { resultReducer } from "./result/resultSlice";
import { questionsReducer } from "./questions/questionsSlice"; 
import { testReducer } from "./test/testSlice"; 

export const store = configureStore({
  reducer: {
    error: errorReducer,
    auth: authReducer,
    tests: testsReducer,
    groups: groupsReducer,
    group: groupReducer,
    result: resultReducer,
    questions: questionsReducer,
    test: testReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>; 
export type AppDispatch = typeof store.dispatch;
