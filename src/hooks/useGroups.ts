import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useAppDispatch } from "../hooks";
import {
  fetchGroups,
  deleteGroup,
  editGroup,
  selectGroups,
  groupsActions,
} from "../redux";
import { Group } from "../types/reduxTypes";

export const useGroups = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const groups: Group[] = useSelector(selectGroups);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [deleteGroupId, setDeleteGroupId] = useState<string | null>(null);
  const [showError, setShowError] = useState<boolean>(false);
  const [editItemId, setEditItemId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<string>("");

  useEffect(() => {
    setIsLoading(true);
    setShowError(false);

    dispatch(fetchGroups())
      .catch(() => setShowError(true))
      .finally(() => setIsLoading(false));
  }, [dispatch]);

  const hideError = useCallback(() => setShowError(false), []);

  const handleItemClick = useCallback(
    (id: string) => {
      if (!editItemId) {
        navigate(`/admin/groups/${id}`);
      }
    },
    [editItemId, navigate]
  );

  // ✅ Универсальная очистка выделений
  const clearSelection = useCallback(() => {
    setEditItemId(null);
    setEditValue("");
    setDeleteGroupId(null);

    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
    document.body.focus();
  }, []);

  // ✅ Удаление группы
  const handleDeleteClick = useCallback(
    (groupId: string) => {
      clearSelection(); 
      setDeleteGroupId(groupId);
    },
    [clearSelection]
  );

  const confirmDeleteGroup = useCallback(() => {
    if (deleteGroupId) {
      dispatch(deleteGroup(deleteGroupId));
      clearSelection();
    }
  }, [deleteGroupId, dispatch, clearSelection]);

  const closeDeleteModal = useCallback(clearSelection, [clearSelection]);

  // ✅ Начало редактирования
  const handleEditClick = useCallback((id: string, name: string) => {
    setEditItemId(id);
    setEditValue(name);
  }, []);

  // ✅ Сохранение изменений
  const handleSaveClick = useCallback(() => {
    if (!editItemId || !editValue.trim()) return;

    const updatedGroups: Group[] = groups.map((group) =>
      group.id === editItemId ? { ...group, name: editValue.trim() } : group
    );

    dispatch(groupsActions.setGroups(updatedGroups));
    dispatch(editGroup(editItemId, editValue.trim()));
    clearSelection(); 
  }, [editItemId, editValue, groups, dispatch, clearSelection]);

  return {
    isLoading,
    deleteGroupId,
    showError,
    hideError,
    groups,
    handleItemClick,
    handleDeleteClick,
    confirmDeleteGroup,
    closeDeleteModal,
    handleEditClick,
    handleSaveClick,
    editItemId,
    editValue,
    setEditValue,
    handleCancel: clearSelection, 
  };
};
