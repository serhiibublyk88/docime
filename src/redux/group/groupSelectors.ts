import { RootState } from "../store";

export const selectGroups = (state: RootState) => state.group.groups;
