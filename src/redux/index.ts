export { store } from "./store";
export type { RootState, AppDispatch } from "./store";

export { authReducer, authActions } from "./auth/authSlice";
export { loginUser, logoutUser } from "./auth/authActions";
export { selectUser } from "./auth/authSelectors";

export { groupsReducer, groupsActions } from "./groups/groupsSlice"; 
export {
  fetchGroups,
  deleteGroup,
  editGroup,
  createGroup,
} from "./groups/groupsActions";
export { selectGroups } from "./groups/groupsSelectors";

export { groupReducer, groupActions } from "./group/groupSlice"; 
export {
  fetchGroupById,
  removeMemberFromGroup,
  editMemberInGroup,
} from "./group/groupActions";
export {
  selectGroup,
  selectGroupMembers,
  selectGroupLoading,
  selectGroupError,
} from "./group/groupSelectors";

export { testReducer, testActions } from "./test/testSlice";
export { fetchTests } from "./test/testActions";
export { selectTests, selectCurrentTest } from "./test/testSelectors";

export { resultReducer, resultActions } from "./result/resultSlice";
export { fetchResults } from "./result/resultActions";
export { selectResults } from "./result/resultSelectors";

export { errorReducer } from "./error/errorSlice";
export { triggerError, resetError } from "./error/errorActions";
export { selectError } from "./error/errorSelectors";
