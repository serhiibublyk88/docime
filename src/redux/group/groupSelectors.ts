 import { RootState } from "../store";

 export const selectGroup = (state: RootState) => state.group.group;
 export const selectGroupMembers = (state: RootState) => state.group.members;
 export const selectGroupLoading = (state: RootState) => state.group.isLoading;
 export const selectGroupError = (state: RootState) => state.group.error;
