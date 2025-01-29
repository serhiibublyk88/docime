import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Group {
  id: string;
  name: string;
}

interface GroupState {
  groups: Group[];
}

const initialState: GroupState = {
  groups: [],
};

const groupSlice = createSlice({
  name: "group",
  initialState,
  reducers: {
    setGroups: (state, action: PayloadAction<Group[]>) => {
      state.groups = action.payload;
    },
  },
});

export const { setGroups } = groupSlice.actions;
export default groupSlice.reducer;
