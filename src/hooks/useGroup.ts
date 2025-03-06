import { useDispatch, useSelector } from "react-redux";
import { useEffect, useCallback, useMemo } from "react";
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

export function useGroup(groupId?: string) {
  const dispatch = useDispatch<AppDispatch>();

  const group = useSelector(selectGroup);
  const rawMembers = useSelector(selectGroupMembers);
  const isLoading = useSelector(selectGroupLoading);
  const error = useSelector(selectGroupError);

  const members = useMemo(() => rawMembers || [], [rawMembers]);

  useEffect(() => {
    if (groupId) {
      dispatch(fetchGroupById(groupId))
        .unwrap()
        .catch((err) => console.error("Fehler beim Laden der Gruppe:", err));
    }
  }, [dispatch, groupId]);

  const clearSelection = useCallback(() => {
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
    document.body.focus();
  }, []);

  const removeMember = useCallback(
    async (memberId: string) => {
      if (!groupId) return;
      try {
        await dispatch(removeMemberFromGroup({ groupId, memberId })).unwrap();
        clearSelection();
      } catch (err) {
        console.error("Fehler beim Entfernen des Mitglieds:", err);
      }
    },
    [dispatch, groupId, clearSelection]
  );

  const editMember = useCallback(
    async (memberId: string, newName: string) => {
      if (!groupId) return;
      try {
        await dispatch(
          editMemberInGroup({ groupId, memberId, newName })
        ).unwrap();
        clearSelection();
      } catch (err) {
        console.error("Fehler beim Bearbeiten des Mitglieds:", err);
      }
    },
    [dispatch, groupId, clearSelection]
  );

  const closeError = useCallback(() => {
    clearSelection();
  }, [clearSelection]);

  return {
    group,
    members,
    isLoading,
    error,
    removeMember,
    editMember,
    closeError,
  };
}
