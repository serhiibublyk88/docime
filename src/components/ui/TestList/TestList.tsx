import { useState, useEffect, useRef } from "react";
import { ListGroup, Form, Button } from "react-bootstrap";
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
  allGroups: { id: string; name: string }[];
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
  allGroups,
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
  const [checkedGroups, setCheckedGroups] = useState<
    Record<string, Set<string>>
  >({});
  const dropdownTestId = useRef<string | null>(null); // ✅ Запоминаем открытый список

  /// 🔄 **Обновляем `checkedGroups`, но НЕ трогаем `dropdownTestId`**
  useEffect(() => {
    const newCheckedGroups: Record<string, Set<string>> = {};
    tests.forEach((test) => {
      newCheckedGroups[test.id] = new Set(
        test.availableForGroups?.map((g) => g.id) || []
      );
    });
    setCheckedGroups(newCheckedGroups);
  }, [tests]);

  /// ✅ Открыть/закрыть список групп (НЕ сбрасываем `dropdownTestId` при ререндере)
  const toggleGroupDropdown = (testId: string) => {
    dropdownTestId.current = dropdownTestId.current === testId ? null : testId;
    // ✅ Принудительно обновляем компонент (чтобы `useRef` отобразил изменение)
    setCheckedGroups((prev) => ({ ...prev }));
  };

  /// ✅ Обновление `checkedGroups` ЛОКАЛЬНО, отправка API через `setTimeout`
  const handleGroupToggle = (testId: string, groupId: string) => {
    setCheckedGroups((prev) => {
      const updatedSet = new Set(prev[testId] || []);
      const isChecked = updatedSet.has(groupId);

      if (isChecked) {
        updatedSet.delete(groupId);
      } else {
        updatedSet.add(groupId);
      }

      return { ...prev, [testId]: updatedSet };
    });

    // 🔥 Отправляем обновление на сервер (с задержкой, чтобы UI не моргал)
    setTimeout(() => {
      onUpdateGroups(
        testId,
        groupId,
        checkedGroups[testId]?.has(groupId) ? "remove" : "add"
      );
    }, 300);
  };

  /// ✅ Закрытие списка только по кнопке "OK"
  const handleConfirmSelection = () => {
    dropdownTestId.current = null;
    setCheckedGroups((prev) => ({ ...prev }));
  };

  return (
    <ListGroup>
      {tests.map((test, index) => (
        <ListGroup.Item
          key={test.id}
          className={`${styles.testItem} d-flex flex-column border-0`}
        >
          {/* Верхняя строка */}
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

            {/* Дата + Кнопки */}
            <div className="d-flex align-items-center">
              <small className="text-muted fs-6 fw-normal me-3">
                {test.createdAt
                  ? new Date(test.createdAt).toLocaleDateString()
                  : "N/A"}
              </small>

              <div className={styles.iconContainer}>
                {editTestId === test.id ? (
                  <>
                    <FaSave
                      className={`${styles.icon} ${styles.iconEdit}`}
                      title="Speichern"
                      onClick={onSave}
                    />
                    <FaTimes
                      className={`${styles.icon} ${styles.iconDelete}`}
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
            <div className={styles.iconAddGroupContainer}>
              <FaUserPlus
                className={`${styles.icon} ${styles.iconAddGroup}`}
                title="Gruppenzugang hinzufügen"
                onClick={() => toggleGroupDropdown(test.id)}
              />
            </div>

            <ListGroup className={`${styles.groupList} w-100`}>
              {test.availableForGroups.length ? (
                test.availableForGroups.map((group) => (
                  <ListGroup.Item
                    key={group.id}
                    className={`d-flex justify-content-between align-items-center border-0 fs-6 mt-1 ${styles.groupItem}`}
                  >
                    <span>{group.name}</span>
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

          {/* Выпадающий список всех групп */}
          {dropdownTestId.current === test.id && (
            <div className={styles.dropdownGroupList}>
              <ListGroup className="w-100">
                {allGroups.map((group) => (
                  <ListGroup.Item
                    key={group.id}
                    className="d-flex justify-content-between align-items-center border-0"
                  >
                    <span>{group.name}</span>
                    <Form.Check
                      type="checkbox"
                      checked={checkedGroups[test.id]?.has(group.id) || false}
                      onChange={() => handleGroupToggle(test.id, group.id)}
                    />
                  </ListGroup.Item>
                ))}
              </ListGroup>
              <Button
                variant="success"
                className="w-100 mt-2"
                onClick={handleConfirmSelection}
              >
                OK
              </Button>
            </div>
          )}
        </ListGroup.Item>
      ))}
    </ListGroup>
  );
};
