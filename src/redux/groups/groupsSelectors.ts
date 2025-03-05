import { RootState } from "../store";

export const selectGroups = (state: RootState) => state.groups.groups;
