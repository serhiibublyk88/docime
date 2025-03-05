import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Group, GroupsState } from "../../types/reduxTypes";

const initialState: GroupsState = {
  groups: [],
};

export const groupsSlice = createSlice({
  name: "groups",
  initialState,
  reducers: {
    setGroups: (state, action: PayloadAction<Group[]>) => {
      state.groups = action.payload;
    },
    addGroup: (state, action: PayloadAction<Group>) => {
      state.groups.push(action.payload);
    },
    removeGroup: (state, action: PayloadAction<string>) => {
      state.groups = state.groups.filter(
        (group) => group.id !== action.payload
      );
    },
    updateGroup: (state, action: PayloadAction<Group>) => {
      const index = state.groups.findIndex(
        (group) => group.id === action.payload.id
      );
      if (index !== -1) {
        state.groups[index] = action.payload;
      }
    },
  },
});

export const groupsActions = groupsSlice.actions;
export const groupsReducer = groupsSlice.reducer;
