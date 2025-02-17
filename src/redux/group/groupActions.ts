import { groupActions } from "./groupSlice";
import { AppDispatch } from "../store";
import { Group } from "../../types/reduxTypes";

export const fetchGroups = () => async (dispatch: AppDispatch) => {
  try {
    const response = await fetch("/api/groups");
    if (!response.ok) {
      throw new Error("Error loading groups");
    }
    const data: Group[] = await response.json();
    dispatch(groupActions.setGroups(data));
  } catch (error) {
    void error; 
  }
};
