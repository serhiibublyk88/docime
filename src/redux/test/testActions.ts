import { testActions } from "./testSlice";
import { AppDispatch } from "../store";
import { Test } from "../../types/reduxTypes"; 

export const fetchTests = () => async (dispatch: AppDispatch) => {
  try {
    const response = await fetch("/api/tests"); 
    if (!response.ok) {
      throw new Error("Error loading tests");
    }
    const data: Test[] = await response.json();
    dispatch(testActions.setTests(data));
  } catch (error) {
    void error; 
  }
};
