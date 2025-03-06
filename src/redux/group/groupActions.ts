import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  Group,
  User,
  GroupResponse,
  UpdatedUserResponse,
} from "../../types/reduxTypes";

// 🔹 **Получение одной группы**
export const fetchGroupById = createAsyncThunk<
  { group: Group; members: User[] },
  string,
  { rejectValue: string }
>("group/fetchGroupById", async (groupId, { rejectWithValue }) => {
  try {
    const response = await fetch(
      ` http://localhost:5000/api/groups/${groupId}`,
      {
        method: "GET",
        credentials: "include",
      }
    );

    if (!response.ok) {
      throw new Error("Fehler beim Laden der Gruppe.");
    }

    const data: GroupResponse = await response.json();

    const members: User[] = (data.groupDetails.members || []).map((member) => {
      return {
        _id: String(member._id),
        username: member.username ?? "Unbekannter Benutzer",
        email: member.email ?? "",
        role: member.role ?? 1,
      };
    });

    return { group: data.groupDetails, members };
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
  { groupId: string; memberId: string; newName: string },
  { rejectValue: string }
>(
  "group/editMember",
  async ({ groupId, memberId, newName }, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/groups/${groupId}/member/${memberId}`,
        {
          method: "PUT",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ newName }),
        }
      );

      if (!response.ok) {
        throw new Error("Fehler beim Bearbeiten des Mitglieds.");
      }

      const updatedUser: UpdatedUserResponse = await response.json();

      return {
        _id: updatedUser._id,
        username: updatedUser.username ?? newName,
        email: updatedUser.email ?? "",
        role: updatedUser.role ?? 1,
      };
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);
