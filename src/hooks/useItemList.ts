import { useState, useCallback } from "react";

export const useItemList = () => {
  const [editItemId, setEditItemId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<string | null>(null); // ✅ Теперь допускает null

  const resetSelection = useCallback(() => {
    setTimeout(() => {
      setEditItemId(null);
      setEditValue(null); // ✅ Сбрасываем в null
    }, 50);

    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  }, []);

  const handleEditClick = useCallback((id: string, name: string) => {
    setEditItemId(id);
    setEditValue(name ?? ""); // ✅ Если name вдруг undefined, ставим ""
  }, []);

  const handleSaveClick = useCallback(() => {
    if (!editItemId || !editValue?.trim()) return;
    resetSelection();
  }, [editItemId, editValue, resetSelection]);

  const handleCancelEdit = useCallback(() => {
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
    editItemId,
    editValue,
    handleEditClick,
    handleSaveClick,
    handleCancelEdit,
    handleKeyDown,
    setEditValue,
  };
};
