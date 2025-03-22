import { createSlice } from "@reduxjs/toolkit";
import { AvailableTest } from "../../types/apiTypes";
import { fetchAvailableTests } from "./userActions";

export type UserState = {
  availableTests: AvailableTest[];
  loading: boolean;
  error: string | null;
};

const initialState: UserState = {
  availableTests: [],
  loading: false,
  error: null,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAvailableTests.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAvailableTests.fulfilled, (state, action) => {
        state.availableTests = action.payload;
        state.loading = false;
      })
      .addCase(fetchAvailableTests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Fehler beim Laden der Tests";
      });
  },
});


export const userReducer = userSlice.reducer;
