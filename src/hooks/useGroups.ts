import { useEffect, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import { useAppDispatch } from "../hooks";
import { fetchGroups, deleteGroup, selectGroups } from "../redux";
import { Group } from "../types/reduxTypes";

export const useGroups = () => {
  const dispatch = useAppDispatch();
  const groups: Group[] = useSelector(selectGroups);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [deleteGroupId, setDeleteGroupId] = useState<string | null>(null);
  const [showAlert, setShowAlert] = useState<boolean>(false);

  useEffect(() => {
    setIsLoading(true);
    dispatch(fetchGroups()).finally(() => setIsLoading(false));
  }, [dispatch]);

  useEffect(() => {
    setShowAlert(!isLoading && groups.length === 0);
  }, [groups.length, isLoading]);

  const handleDeleteClick = useCallback((groupId: string) => {
    setDeleteGroupId(groupId);
  }, []);

  const confirmDeleteGroup = useCallback(() => {
    if (deleteGroupId) {
      dispatch(deleteGroup(deleteGroupId));
      setDeleteGroupId(null);
    }
  }, [deleteGroupId, dispatch]);

  return {
    isLoading,
    deleteGroupId,
    showAlert,
    groups,
    handleDeleteClick,
    confirmDeleteGroup,
  };
};
