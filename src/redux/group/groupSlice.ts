import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Group, User, GroupState } from "../../types/reduxTypes";
import {
  fetchGroupById,
  removeMemberFromGroup,
  editMemberInGroup,
} from "./groupActions";

const initialState: GroupState = {
  group: null,
  members: [],
  isLoading: false,
  error: null,
};

export const groupSlice = createSlice({
  name: "group",
  initialState,
  reducers: {
    setGroup: (state, action: PayloadAction<Group>) => {
      state.group = action.payload;
    },
    clearGroup: (state) => {
      state.group = null;
      state.members = [];
      state.isLoading = false;
      state.error = null;
    },
    setMembers: (state, action: PayloadAction<User[]>) => {
      state.members = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // 🔹 **Получение группы**
      .addCase(fetchGroupById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchGroupById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.group = action.payload.group;
        state.members = action.payload.members;
      })
      .addCase(fetchGroupById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Fehler beim Laden der Gruppe.";
      })

      // 🔹 **Удаление участника**
      .addCase(removeMemberFromGroup.fulfilled, (state, action) => {
        state.members = state.members.filter(
          (member) => member.id !== action.payload
        );
      })
      .addCase(removeMemberFromGroup.rejected, (state, action) => {
        state.error = action.payload || "Fehler beim Entfernen des Mitglieds.";
      })

      // 🔹 **Редактирование участника**
      .addCase(editMemberInGroup.fulfilled, (state, action) => {
        const index = state.members.findIndex(
          (member) => member.id === action.payload.id
        );
        if (index !== -1) {
          state.members[index] = action.payload;
        }
      })
      .addCase(editMemberInGroup.rejected, (state, action) => {
        state.error = action.payload || "Fehler beim Bearbeiten des Mitglieds.";
      });
  },
});


export const groupActions = groupSlice.actions;
export const groupReducer = groupSlice.reducer;



