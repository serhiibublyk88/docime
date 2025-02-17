import { resultActions } from "./resultSlice";
import { AppDispatch } from "../store";
import { TestResult } from "../../types/reduxTypes"; 

export const fetchResults = () => async (dispatch: AppDispatch) => {
  try {
    const response = await fetch("/api/results"); 
    if (!response.ok) {
      throw new Error("Error loading results");
    }
    const data: TestResult[] = await response.json();
    dispatch(resultActions.setResults(data));
  } catch (error) {
    void error; 
  }
};
