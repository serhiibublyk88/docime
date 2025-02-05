
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "./store"; 

interface User {
  id: string;
  username: string;
  role: number;
}

interface AuthState {
  user: User | null;
}

const initialState: AuthState = {
  user: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action: PayloadAction<{ user: User }>) => {
      state.user = action.payload.user;
    },
    logout: (state) => {
      state.user = null;
    },
  },
});


export const selectUser = (state: RootState) => state.auth.user;

export const authActions = authSlice.actions;
export default authSlice.reducer;
