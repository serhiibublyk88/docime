import { RootState } from "../store";

export const selectResults = (state: RootState) => state.result.results;
