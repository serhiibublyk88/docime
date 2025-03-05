import { groupsActions } from "./groupsSlice";
import { AppDispatch } from "../store";
import { Group } from "../../types/reduxTypes";
import { triggerError } from "../error/errorActions";

/** 🔹 **Получение списка групп** */
export const fetchGroups = () => async (dispatch: AppDispatch) => {
  try {
    const response = await fetch("http://localhost:5000/api/groups", {
      method: "GET",
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Fehler beim Laden der Gruppen.");
    }

    const data: Group[] = await response.json();
    dispatch(groupsActions.setGroups(data));
  } catch (error) {
    dispatch(triggerError((error as Error).message));
  }
};

/** 🔹 **Удаление группы** */
export const deleteGroup =
  (groupId: string) => async (dispatch: AppDispatch) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/groups/${groupId}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Fehler beim Löschen der Gruppe.");
      }

      dispatch(groupsActions.removeGroup(groupId));
    } catch (error) {
      dispatch(triggerError((error as Error).message));
    }
  };

/** 🔹 **Редактирование группы** */
export const editGroup =
  (groupId: string, newName: string) => async (dispatch: AppDispatch) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/groups/${groupId}`,
        {
          method: "PUT",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: newName }),
        }
      );

      if (!response.ok) {
        throw new Error("Fehler beim Bearbeiten der Gruppe.");
      }

      const updatedGroup: Group = await response.json();
      dispatch(groupsActions.updateGroup(updatedGroup));
    } catch (error) {
      dispatch(triggerError((error as Error).message));
    }
  };

/** 🔹 **Создание новой группы** */
export const createGroup = (name: string) => async (dispatch: AppDispatch) => {
  try {
    const response = await fetch("http://localhost:5000/api/groups", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });

    if (!response.ok) {
      throw new Error("Fehler beim Erstellen der Gruppe.");
    }

    const data = await response.json();

    if (!data.group || !data.group._id) {
      return;
    }

    const newGroup: Group = {
      id: data.group._id,
      name: data.group.name,
      createdBy: data.group.createdBy,
      createdAt: data.group.createdAt,
      membersCount: data.group.members?.length || 0,
    };

    dispatch(groupsActions.addGroup(newGroup));
  } catch (error) {
    dispatch(triggerError((error as Error).message));
  }
};
