import { useState } from "react";
import { ListGroup, Form } from "react-bootstrap";
import { FaEdit, FaSave, FaTimes, FaTrash, FaCopy } from "react-icons/fa";
import styles from "./ItemList.module.css";

interface Item {
  id: string;
  name: string;
}

interface ItemListProps {
  items: Item[];
  onEdit?: (id: string, newName: string) => void;
  onDelete?: (id: string) => void;
  onCopy?: (id: string) => void;
  selectable?: boolean; // Чекбоксы
  selectedItems?: string[];
  onSelect?: (id: string) => void;
}

export const ItemList: React.FC<ItemListProps> = ({
  items,
  onEdit,
  onDelete,
  onCopy,
  selectable,
  selectedItems = [],
  onSelect,
}) => {
  const [editItemId, setEditItemId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<string>("");

  const handleEditClick = (id: string, currentName: string) => {
    setEditItemId(id);
    setEditValue(currentName);
  };

  const handleSaveClick = () => {
    if (onEdit && editItemId) {
      onEdit(editItemId, editValue);
    }
    setEditItemId(null);
  };

  const handleCancelClick = () => {
    setEditItemId(null);
    setEditValue("");
  };

  return (
    <ListGroup>
      {items.map((item) => (
        <ListGroup.Item
          key={item.id}
          className={`${styles.item} d-flex justify-content-between align-items-center`}
        >
          {selectable && (
            <Form.Check
              type="checkbox"
              checked={selectedItems.includes(item.id)}
              onChange={() => onSelect?.(item.id)}
            />
          )}

          {editItemId === item.id ? (
            <Form.Control
              type="text"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              className={styles.editInput}
            />
          ) : (
            <span>{item.name}</span>
          )}

          <div className={styles.iconContainer}>
            {editItemId === item.id ? (
              <>
                <FaSave className={styles.icon} onClick={handleSaveClick} />
                <FaTimes className={styles.icon} onClick={handleCancelClick} />
              </>
            ) : (
              <>
                {onEdit && (
                  <FaEdit
                    className={styles.icon}
                    onClick={() => handleEditClick(item.id, item.name)}
                  />
                )}
                {onCopy && (
                  <FaCopy
                    className={styles.icon}
                    onClick={() => onCopy(item.id)}
                  />
                )}
                {onDelete && (
                  <FaTrash
                    className={styles.icon}
                    onClick={() => onDelete(item.id)}
                  />
                )}
              </>
            )}
          </div>
        </ListGroup.Item>
      ))}
    </ListGroup>
  );
};
