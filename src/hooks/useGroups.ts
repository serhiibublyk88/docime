import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useAppDispatch } from "../hooks/useAppDispatch";
import {
  fetchGroups,
  deleteGroup,
  editGroup,
  selectGroups,
  groupActions,
} from "../redux";
import { Group } from "../types/reduxTypes";

export const useGroups = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const groups: Group[] = useSelector(selectGroups);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [editGroupId, setEditGroupId] = useState<string | null>(null);
  const [groupName, setGroupName] = useState<string>("");
  const [deleteGroupId, setDeleteGroupId] = useState<string | null>(null);
  const [showAlert, setShowAlert] = useState<boolean>(false);

  useEffect(() => {
    setIsLoading(true);
    dispatch(fetchGroups()).finally(() => setIsLoading(false));
  }, [dispatch]);

  useEffect(() => {
    setShowAlert(!isLoading && groups.length === 0);
  }, [groups.length, isLoading]);

  const handleEditClick = useCallback(
    (
      event: React.MouseEvent<SVGElement>,
      groupId: string,
      currentName: string
    ) => {
      event.stopPropagation();
      setEditGroupId(groupId);
      setGroupName(currentName);
    },
    []
  );

  const resetSelection = useCallback(() => {
    setTimeout(() => {
      setEditGroupId(null);
      setGroupName("");
    }, 50);

    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  }, []);

  const handleSaveClick = useCallback(
    async (event: React.MouseEvent<SVGElement>) => {
      event.stopPropagation();
      if (!editGroupId || !groupName.trim()) return;

      const updatedGroups: Group[] = groups.map((group) =>
        group.id === editGroupId ? { ...group, name: groupName.trim() } : group
      );

      dispatch(groupActions.setGroups(updatedGroups));
      await dispatch(editGroup(editGroupId, groupName.trim()));
      resetSelection();
    },
    [editGroupId, groupName, groups, dispatch, resetSelection]
  );

  const handleCancelEdit = useCallback(
    (event: React.MouseEvent<SVGElement>) => {
      event.stopPropagation();
      resetSelection();
    },
    [resetSelection]
  );

  const handleDeleteClick = useCallback(
    (event: React.MouseEvent<SVGElement>, groupId: string) => {
      event.stopPropagation();
      setDeleteGroupId(groupId);
    },
    []
  );

  const confirmDeleteGroup = useCallback(() => {
    if (deleteGroupId) {
      dispatch(deleteGroup(deleteGroupId));
      setDeleteGroupId(null);
    }
  }, [deleteGroupId, dispatch]);

  const handleKeyDown = useCallback(
    async (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === "Enter") {
        await handleSaveClick(event as unknown as React.MouseEvent<SVGElement>);
      } else if (event.key === "Escape") {
        handleCancelEdit(event as unknown as React.MouseEvent<SVGElement>);
      }
    },
    [handleSaveClick, handleCancelEdit]
  );

  const handleNavigateToGroup = useCallback(
    (groupId: string) => {
      if (!editGroupId) {
        navigate(`/admin/groups/${groupId}`);
      }
    },
    [editGroupId, navigate]
  );

  return {
    isLoading,
    editGroupId,
    groupName,
    deleteGroupId,
    showAlert,
    groups,
    setGroupName,
    handleEditClick,
    handleSaveClick,
    handleCancelEdit,
    handleDeleteClick,
    confirmDeleteGroup,
    handleKeyDown,
    handleNavigateToGroup,
  };
};
