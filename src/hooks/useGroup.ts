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
  selectGroupsForCarousel, // ✅ Добавил селектор для карусели
} from "../redux/group/groupSelectors";

export function useGroup(groupId?: string) {
  const dispatch = useDispatch<AppDispatch>();

  const group = useSelector(selectGroup);
  const rawMembers = useSelector(selectGroupMembers);
  const isLoading = useSelector(selectGroupLoading);
  const error = useSelector(selectGroupError);
  const groupsForCarousel = useSelector(selectGroupsForCarousel); // ✅ Берём данные из Redux


  // ✅ Мемоизированный массив участников
  const members = useMemo(() => {
    
    return rawMembers ?? [];
  }, [rawMembers]);

  useEffect(() => {
    if (groupId) {
      
      dispatch(fetchGroupById(groupId))
        .unwrap()
        .catch((err) => console.error("Fehler beim Laden der Gruppe:", err));
    }
  }, [dispatch, groupId]);

  return {
    group,
    members,
    isLoading,
    error,
    groupsForCarousel, 
    removeMember: useCallback(
      async (memberId: string) => {
        if (!groupId) return;
        try {
          await dispatch(removeMemberFromGroup({ groupId, memberId })).unwrap();
        } catch (err) {
          console.error(" Fehler beim Entfernen des Mitglieds:", err);
        }
      },
      [dispatch, groupId]
    ),
    editMember: useCallback(
      async (memberId: string, newName: string) => {
        if (!groupId) return;
        try {
          await dispatch(
            editMemberInGroup({ groupId, memberId, newName })
          ).unwrap();
        } catch (err) {
          console.error(" Fehler beim Bearbeiten des Mitgliedс:", err);
        }
      },
      [dispatch, groupId]
    ),
    closeError: useCallback(() => {
      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
      }
      document.body.focus();
    }, []),
  };
}
