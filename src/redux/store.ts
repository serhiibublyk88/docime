import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import testReducer from "./testSlice";
import groupReducer from "./groupSlice";
import resultReducer from "./resultSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    test: testReducer,
    group: groupReducer,
    result: resultReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
