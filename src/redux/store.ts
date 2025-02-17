import { configureStore } from "@reduxjs/toolkit";
import { authReducer } from "./auth/authSlice"; 
import { testReducer } from "./test/testSlice";
import { groupReducer } from "./group/groupSlice";
import { resultReducer } from "./result/resultSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    test: testReducer,
    group: groupReducer,
    result: resultReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
