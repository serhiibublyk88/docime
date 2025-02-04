import { createSlice, PayloadAction } from "@reduxjs/toolkit";

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
      const { user } = action.payload;
      state.user = user;
    },

    logout: (state) => {
      state.user = null;
    },
  },
});

export const selectUser = (state: { auth: AuthState }) => state.auth.user;

export const { login, logout } = authSlice.actions;

export default authSlice.reducer;
