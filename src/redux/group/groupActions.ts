import { createAsyncThunk } from "@reduxjs/toolkit";
import { Group, User } from "../../types/reduxTypes";

// 🔹 **Получение одной группы**
export const fetchGroupById = createAsyncThunk<
  { group: Group; members: User[] },
  string,
  { rejectValue: string }
>("group/fetchGroupById", async (groupId, { rejectWithValue }) => {
  try {
    const response = await fetch(
      `http://localhost:5000/api/groups/${groupId}`,
      {
        method: "GET",
        credentials: "include",
      }
    );

    if (!response.ok) {
      throw new Error("Fehler beim Laden der Gruppe.");
    }

    const data = await response.json();
    return { group: data.groupDetails, members: data.members };
  } catch (error) {
    return rejectWithValue((error as Error).message);
  }
});

// 🔹 **Удаление участника**
export const removeMemberFromGroup = createAsyncThunk<
  string,
  { groupId: string; memberId: string },
  { rejectValue: string }
>("group/removeMember", async ({ groupId, memberId }, { rejectWithValue }) => {
  try {
    const response = await fetch(
      `http://localhost:5000/api/groups/${groupId}/member/${memberId}`,
      {
        method: "DELETE",
        credentials: "include",
      }
    );

    if (!response.ok) {
      throw new Error("Fehler beim Entfernen des Mitglieds.");
    }

    return memberId;
  } catch (error) {
    return rejectWithValue((error as Error).message);
  }
});

// 🔹 **Редактирование участника**
export const editMemberInGroup = createAsyncThunk<
  User,
  { groupId: string; memberId: string; newUsername: string },
  { rejectValue: string }
>(
  "group/editMember",
  async ({ groupId, memberId, newUsername }, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/groups/${groupId}/member/${memberId}`,
        {
          method: "PUT",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username: newUsername }),
        }
      );

      if (!response.ok) {
        throw new Error("Fehler beim Bearbeiten des Mitglieds.");
      }

      return await response.json();
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);
