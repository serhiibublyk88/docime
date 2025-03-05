import { useDispatch, useSelector } from "react-redux";
import { useEffect, useCallback } from "react";
import { AppDispatch } from "../redux/store";
import {
  fetchGroupById,
  removeMemberFromGroup,
  editMemberInGroup,
} from "../redux/group/groupActions";
import {
  selectGroup,
  selectGroupMembers,
  selectGroupLoading,
  selectGroupError,
} from "../redux/group/groupSelectors";


export function useGroup(groupId: string) {
  const dispatch = useDispatch<AppDispatch>();

 
  const group = useSelector(selectGroup);
  const members = useSelector(selectGroupMembers);
  const isLoading = useSelector(selectGroupLoading);
  const error = useSelector(selectGroupError);

  
  useEffect(() => {
    if (groupId) {
      dispatch(fetchGroupById(groupId));
    }
  }, [dispatch, groupId]);

  // 🔹 Удаление участника
  const removeMember = useCallback(
    (memberId: string) => {
      if (groupId) {
        dispatch(removeMemberFromGroup({ groupId, memberId }));
      }
    },
    [dispatch, groupId]
  );

  // 🔹 Редактирование участника
  const editMember = useCallback(
    (memberId: string, newUsername: string) => {
      if (groupId) {
        dispatch(editMemberInGroup({ groupId, memberId, newUsername }));
      }
    },
    [dispatch, groupId]
  );

  return {
    group,
    members,
    isLoading,
    error,
    removeMember,
    editMember, 
  };
}
