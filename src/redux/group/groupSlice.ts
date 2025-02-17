import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Group, GroupState } from "../../types/reduxTypes";

const initialState: GroupState = {
  groups: [],
};

export const groupSlice = createSlice({
  name: "group",
  initialState,
  reducers: {
    setGroups: (state, action: PayloadAction<Group[]>) => {
      state.groups = action.payload;
    },
  },
});

export const groupActions = groupSlice.actions;
export const groupReducer = groupSlice.reducer;
