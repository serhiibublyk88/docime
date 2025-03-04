import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useAppDispatch } from "../hooks";
import { deleteGroup, editGroup, selectGroups, groupActions } from "../redux";
import { Group } from "../types/reduxTypes";

export const useItemList = () => {
   const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const groups: Group[] = useSelector(selectGroups);

  const [editItemId, setEditItemId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<string>("");
  const [deleteGroupId, setDeleteGroupId] = useState<string | null>(null);

  const resetSelection = useCallback(() => {
    setTimeout(() => {
      setEditItemId(null);
      setEditValue("");
    }, 50);

    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  }, []);

  const handleItemClick = useCallback(
    (id: string) => {
      if (!editItemId) {
        console.log("Navigate to:", id);
        navigate(`/admin/groups/${id}}`);
      }
    },
    [editItemId, navigate]
  );

  const handleEditClick = useCallback((id: string, name: string) => {
    setEditItemId(id);
    setEditValue(name);
  }, []);

  const handleSaveClick = useCallback(() => {
    if (!editItemId || !editValue.trim()) return;

    const updatedGroups: Group[] = groups.map((group) =>
      group.id === editItemId ? { ...group, name: editValue.trim() } : group
    );

    dispatch(groupActions.setGroups(updatedGroups));
    dispatch(editGroup(editItemId, editValue.trim()));
    resetSelection();
  }, [editItemId, editValue, groups, dispatch, resetSelection]);

  const handleCancelEdit = useCallback(() => {
    resetSelection();
  }, [resetSelection]);

  const handleDeleteClick = useCallback((id: string) => {
    setDeleteGroupId(id);
    resetSelection(); 
  }, [resetSelection]);

  const confirmDeleteGroup = useCallback(async () => {
    if (deleteGroupId) {
      await dispatch(deleteGroup(deleteGroupId));
      dispatch(
        groupActions.setGroups(groups.filter((g) => g.id !== deleteGroupId))
      );
      setDeleteGroupId(null);
    }
  }, [deleteGroupId, groups, dispatch]);

  const closeDeleteModal = useCallback(() => {
    setDeleteGroupId(null);
    resetSelection(); 
  }, [resetSelection]);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === "Enter") {
        handleSaveClick();
      } else if (event.key === "Escape") {
        handleCancelEdit();
      }
    },
    [handleSaveClick, handleCancelEdit]
  );

  return {
    items: groups,
    editItemId,
    editValue,
    deleteGroupId,
    handleItemClick,
    handleEditClick,
    handleSaveClick,
    handleCancelEdit,
    handleDeleteClick,
    confirmDeleteGroup,
    closeDeleteModal,
    handleKeyDown,
    setEditValue,
  };
};
