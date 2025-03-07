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
  groupsForCarousel: [], // ✅ Гарантируем, что это всегда массив
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
      state.groupsForCarousel = []; // ✅ Очищаем карусель при выходе
      state.isLoading = false;
      state.error = null;
    },
    setMembers: (state, action: PayloadAction<User[]>) => {
      state.members = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchGroupById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchGroupById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.group = action.payload.group;
        state.groupsForCarousel = action.payload.groupsForCarousel ?? []; // ✅ Обеспечиваем, что всегда массив
        state.members = action.payload.members.map((member) => ({
          _id: member._id,
          username: member.username?.trim() || "Unbekannter Benutzer", // ✅ Безопасно подставляем имя
          email: member.email ?? "",
          role: member.role ?? 1,
        }));
      })
      .addCase(fetchGroupById.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          typeof action.payload === "string"
            ? action.payload
            : "Fehler beim Laden der Gruppe.";
      })
      .addCase(removeMemberFromGroup.fulfilled, (state, action) => {
        state.members = state.members.filter(
          (member) => member._id !== action.payload
        );
      })
      .addCase(removeMemberFromGroup.rejected, (state, action) => {
        state.error = action.payload || "Fehler beim Entfernen des Mitglieds.";
      })
      .addCase(editMemberInGroup.fulfilled, (state, action) => {
        const index = state.members.findIndex(
          (member) => member._id === action.payload._id
        );

        if (index !== -1) {
          state.members[index].username =
            action.payload.username?.trim() || "Unbekannter Benutzer"; // ✅ Убираем случайные пробелы
        }
      })
      .addCase(editMemberInGroup.rejected, (state, action) => {
        state.error = action.payload || "Fehler beim Bearbeiten des Mitglieds.";
      });
  },
});

export const groupActions = groupSlice.actions;
export const groupReducer = groupSlice.reducer;
