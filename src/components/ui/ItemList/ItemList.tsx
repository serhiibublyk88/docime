import { ListGroup, Form } from "react-bootstrap";
import { FaEdit, FaSave, FaTimes, FaTrash } from "react-icons/fa";
import { ItemListProps } from "../../../types/uiTypes";
import { useCallback } from "react";
import styles from "./ItemList.module.css";

export const ItemList: React.FC<ItemListProps> = ({
  items,
  editItemId,
  editValue,
  onItemClick,
  onEdit,
  onSave,
  onCancel,
  onDelete,
  setEditValue,
}) => {
  const clearSelection = useCallback(() => {
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
    document.body.focus();
  }, []);

  const handleSave = useCallback(() => {
    if (editValue.trim()) {
      onSave();
      clearSelection();
    }
  }, [onSave, clearSelection, editValue]);

  const handleCancel = useCallback(() => {
    onCancel();
    clearSelection();
  }, [onCancel, clearSelection]);

  const handleDelete = useCallback(
    (id: string) => {
      onDelete(id);
      clearSelection();
    },
    [onDelete, clearSelection]
  );

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === "Enter") {
        handleSave();
      } else if (event.key === "Escape") {
        handleCancel();
      }
    },
    [handleSave, handleCancel]
  );

  return (
    <ListGroup>
      {items.map((item, index) => (
        <ListGroup.Item
          key={item.id}
          tabIndex={0}
          className={`${styles.item} ${
            editItemId === item.id ? styles.editing : ""
          } d-flex justify-content-between align-items-center list-group-item-action border-0 fs-5`}
          onClick={() => onItemClick(item.id)}
        >
          {editItemId === item.id ? (
            <Form.Control
              type="text"
              value={editValue}
              onChange={(e) => setEditValue(e.currentTarget.value)}
              onKeyDown={handleKeyDown}
              autoFocus
              className={styles.editInput}
            />
          ) : (
            <span>
              {index + 1}. {item.name}
            </span>
          )}

          <div
            className={styles.iconContainer}
            onClick={(e) => e.stopPropagation()}
          >
            {editItemId === item.id ? (
              <>
                <FaSave
                  className={`${styles.icon} ${styles.saveIcon}`}
                  title="Speichern"
                  onClick={handleSave}
                />
                <FaTimes
                  className={`${styles.icon} ${styles.cancelIcon}`}
                  title="Abbrechen"
                  onClick={handleCancel}
                />
              </>
            ) : (
              <>
                <FaEdit
                  className={`${styles.icon} ${styles.editIcon}`}
                  title="Bearbeiten"
                  onClick={() => onEdit(item.id, item.name)}
                />
                <FaTrash
                  className={`${styles.icon} ${styles.deleteIcon}`}
                  title="Löschen"
                  onClick={() => handleDelete(item.id)}
                />
              </>
            )}
          </div>
        </ListGroup.Item>
      ))}
    </ListGroup>
  );
};
