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

  // ✅ Новая версия clearSelection: Жёстко снимаем фокус и выделение
  const clearSelection = useCallback(() => {
    setEditItemId(null);
    setEditValue("");
    setDeleteGroupId(null);

    // 🔹 Убираем фокус со всех элементов
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }

    // 🔹 Принудительно ставим фокус на body
    document.body.focus();
  }, []);

  // 🔹 Удаление: сбрасываем фокус ПЕРЕД открытием модалки
  const handleDeleteClick = useCallback(
    (groupId: string) => {
      clearSelection(); // ✅ Снимаем выделение ПЕРЕД модалкой
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

  const closeDeleteModal = useCallback(() => {
    clearSelection();
  }, [clearSelection]);

  const handleEditClick = useCallback((id: string, name: string) => {
    setEditItemId(id);
    setEditValue(name);
  }, []);

  const handleSaveClick = useCallback(() => {
    if (!editItemId || !editValue.trim()) return;

    const updatedGroups: Group[] = groups.map((group) =>
      group.id === editItemId ? { ...group, name: editValue.trim() } : group
    );

    dispatch(groupsActions.setGroups(updatedGroups));
    dispatch(editGroup(editItemId, editValue.trim()));

    clearSelection();
  }, [editItemId, editValue, groups, dispatch, clearSelection]);

  const handleCancelEdit = useCallback(() => {
    clearSelection();
  }, [clearSelection]);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === "Enter") {
        handleSaveClick();
      } else if (event.key === "Escape") {
        clearSelection();
      }
    },
    [handleSaveClick, clearSelection]
  );

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
    handleCancelEdit,
    handleKeyDown,
    editItemId,
    editValue,
    setEditValue,
  };
};
