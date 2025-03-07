import { useDispatch, useSelector } from "react-redux";
import { useEffect, useCallback, useMemo, useState } from "react";
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
  selectGroupsForCarousel,
} from "../redux/group/groupSelectors";

export function useGroup(groupId?: string) {
  const dispatch = useDispatch<AppDispatch>();

  const group = useSelector(selectGroup);
  const rawMembers = useSelector(selectGroupMembers);
  const isLoading = useSelector(selectGroupLoading);
  const error = useSelector(selectGroupError);
  const groupsForCarousel = useSelector(selectGroupsForCarousel);

  // ✅ Локальное состояние
  const [editItemId, setEditItemId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<string>("");
  const [deleteMemberId, setDeleteMemberId] = useState<string | null>(null);

  // ✅ Мемоизация массива участников
  const members = useMemo(() => rawMembers ?? [], [rawMembers]);

  useEffect(() => {
    if (groupId) {
      dispatch(fetchGroupById(groupId))
        .unwrap()
        .catch((err) => console.error(" Fehler beim Laden der Gruppe:", err));
    }
  }, [dispatch, groupId]);

  // ✅ Очистка выделения
  const clearSelection = useCallback(() => {
    setEditItemId(null);
    setEditValue("");
    setDeleteMemberId(null);
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
    document.body.focus();
  }, []);

  // ✅ Редактирование участника
  const handleEdit = useCallback((memberId: string, name: string) => {
    setEditItemId(memberId);
    setEditValue(name);
  }, []);

  // ✅ Сохранение изменений
  const handleSave = useCallback(async () => {
    if (editItemId && editValue.trim()) {
      await dispatch(
        editMemberInGroup({
          groupId: groupId!,
          memberId: editItemId,
          newName: editValue.trim(),
        })
      ).unwrap();
      clearSelection(); 
    }
  }, [dispatch, groupId, editItemId, editValue, clearSelection]);

  // ✅ Отмена редактирования
  const handleCancel = useCallback(() => {
    clearSelection();
  }, [clearSelection]);

  // ✅ Удаление участника
  const handleDeleteClick = useCallback((memberId: string) => {
    setDeleteMemberId(memberId);
  }, []);

  const confirmDeleteMember = useCallback(async () => {
    if (deleteMemberId) {
      await dispatch(
        removeMemberFromGroup({ groupId: groupId!, memberId: deleteMemberId })
      ).unwrap();
      clearSelection();
    }
  }, [dispatch, groupId, deleteMemberId, clearSelection]);

  return {
    group,
    members,
    isLoading,
    error,
    groupsForCarousel,
    editItemId,
    editValue,
    deleteMemberId,
    setEditValue,
    handleEdit,
    handleSave,
    handleCancel, 
    handleDeleteClick,
    confirmDeleteMember,
    closeDeleteModal: clearSelection, 
    closeError: clearSelection,
  };
}
