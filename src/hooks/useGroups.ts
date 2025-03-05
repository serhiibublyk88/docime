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
  const [showError, setShowError] = useState<boolean>(false);

  // 🔹 Запуск загрузки групп
  useEffect(() => {
    setIsLoading(true);
    setShowError(false);

    dispatch(fetchGroups())
      .catch(() => setShowError(true)) // Ошибка загрузки
      .finally(() => setIsLoading(false));
  }, [dispatch]);

  // 🔹 Функция для скрытия ошибки
  const hideError = useCallback(() => setShowError(false), []);

  // 🔹 Обработчик удаления
  const handleDeleteClick = useCallback((groupId: string) => {
    setDeleteGroupId(groupId);
  }, []);

  // 🔹 Подтверждение удаления
  const confirmDeleteGroup = useCallback(() => {
    if (deleteGroupId) {
      dispatch(deleteGroup(deleteGroupId));
      setDeleteGroupId(null);
    }
  }, [deleteGroupId, dispatch]);

  return {
    isLoading,
    deleteGroupId,
    showError,
    hideError,
    groups,
    handleDeleteClick,
    confirmDeleteGroup,
  };
};
