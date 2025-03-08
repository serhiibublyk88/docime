import { ListGroup, Form } from "react-bootstrap";
import {
  FaEdit,
  FaSave,
  FaTimes,
  FaTrash,
  FaCopy,
  FaUserPlus,
} from "react-icons/fa";
import { Test } from "../../../types/reduxTypes";
import styles from "./TestList.module.css";

interface TestListProps {
  tests: Test[];
  editTestId: string | null;
  editValue: string;
  onEdit: (id: string, title: string) => void;
  onSave: () => void;
  onCancel: () => void;
  onDelete: (id: string) => void;
  onCopy: (id: string) => void;
  setEditValue: (value: string) => void;
  onUpdateGroups: (
    testId: string,
    groupId: string,
    action: "add" | "remove"
  ) => void;
}

export const TestList: React.FC<TestListProps> = ({
  tests,
  editTestId,
  editValue,
  onEdit,
  onSave,
  onCancel,
  onDelete,
  onCopy,
  setEditValue,
  onUpdateGroups,
}) => {
  return (
    <ListGroup>
      {tests.map((test, index) => (
        <ListGroup.Item
          key={test.id}
          className={`${styles.testItem} d-flex flex-column border-0`}
        >
          {/* Верхняя строка (Номер теста, Название, Кнопки) */}
          <div
            className={`d-flex justify-content-between align-items-center fs-5 ${styles.testHeader}`}
          >
            {editTestId === test.id ? (
              <Form.Control
                type="text"
                value={editValue}
                onChange={(e) => setEditValue(e.currentTarget.value)}
                autoFocus
                className={styles.editInput}
              />
            ) : (
              <div className="d-flex align-items-center">
                <span className="me-3">{index + 1}.</span>
                <span className="me-3">{test.title}</span>
              </div>
            )}

            {/* Дата + Кнопки управления */}
            <div className="d-flex align-items-center">
              <small className="text-muted fs-6 fw-normal me-3">
                {new Date(test.createdAt).toLocaleDateString()}
              </small>

              <div className={styles.iconContainer}>
                {editTestId === test.id ? (
                  <>
                    <FaSave
                      className={`${styles.icon} ${styles.iconSave}`}
                      title="Speichern"
                      onClick={onSave}
                    />
                    <FaTimes
                      className={`${styles.icon} ${styles.iconCancel}`}
                      title="Abbrechen"
                      onClick={onCancel}
                    />
                  </>
                ) : (
                  <>
                    <FaEdit
                      className={`${styles.icon} ${styles.iconEdit}`}
                      title="Bearbeiten"
                      onClick={() => onEdit(test.id, test.title)}
                    />
                    <FaCopy
                      className={`${styles.icon} ${styles.iconCopy}`}
                      title="Kopieren"
                      onClick={() => onCopy(test.id)}
                    />
                    <FaTrash
                      className={`${styles.icon} ${styles.iconDelete}`}
                      title="Löschen"
                      onClick={() => onDelete(test.id)}
                    />
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Контейнер "Добавить группу" + Список групп */}
          <div className="d-flex align-items-center">
            {/*  Иконка "Добавить группу" слева */}
            <div className={styles.iconAddGroupContainer}>
              <FaUserPlus
                className={`${styles.icon} ${styles.iconAddGroup}`}
                title="Gruppenzugang hinzufügen"
                onClick={() => {}}
              />
            </div>

            {/*  Список групп с чекбоксами */}
            <ListGroup className={`${styles.groupList} w-100`}>
              {test.availableForGroups.length > 0 ? (
                test.availableForGroups.map((group) => (
                  <ListGroup.Item
                    key={group.id}
                    className={`d-flex justify-content-between align-items-center border-0 fs-6 mt-1 ${styles.groupItem}`}
                  >
                    <span>{group.name}</span>
                    <input
                      type="checkbox"
                      className={styles.checkbox}
                      checked
                      onChange={() =>
                        onUpdateGroups(test.id, group.id, "remove")
                      }
                    />
                  </ListGroup.Item>
                ))
              ) : (
                <ListGroup.Item
                  className={`text-center border-0 ${styles.emptyGroup}`}
                >
                  Es gibt keine Gruppen mit Zugang für diesen Test.
                </ListGroup.Item>
              )}
            </ListGroup>
          </div>
        </ListGroup.Item>
      ))}
    </ListGroup>
  );
};
