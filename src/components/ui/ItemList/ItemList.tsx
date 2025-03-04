import { ListGroup, Form } from "react-bootstrap";
import { FaEdit, FaSave, FaTimes, FaTrash } from "react-icons/fa";
import { ItemListProps } from "../../../types/uiTypes";
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
  onKeyDown,
  setEditValue,
}) => {
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
              onKeyDown={onKeyDown}
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
                  onClick={onSave}
                />
                <FaTimes
                  className={`${styles.icon} ${styles.cancelIcon}`}
                  title="Abbrechen"
                  onClick={onCancel}
                />
              </>
            ) : (
              <>
                <FaEdit
                  className={`${styles.icon} ${styles.editIcon}`}
                  title="Bearbeiten"
                  onClick={(event) => onEdit(item.id, item.name, event)}
                />
                <FaTrash
                  className={`${styles.icon} ${styles.deleteIcon}`}
                  title="Löschen"
                  onClick={(event) => onDelete(item.id, event)}
                />
              </>
            )}
          </div>
        </ListGroup.Item>
      ))}
    </ListGroup>
  );
};
