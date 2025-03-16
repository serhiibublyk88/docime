import { useState } from "react";
import { ListGroup, Form, Button } from "react-bootstrap";
import {
  FaEdit,
  FaSave,
  FaTimes,
  FaTrash,
  FaCopy,
  FaUserFriends,
  FaPlus,
  FaMinus,
} from "react-icons/fa";
import { TestListProps } from "../../../types/reduxTypes";
import { useNavigate } from "react-router-dom";
import styles from "./TestList.module.css";

export const TestList: React.FC<TestListProps> = ({
  tests,
  allGroups,
  editTestId,
  editValue,
  onSave,
  onCancel,
  onDelete,
  onCopy,
  setEditValue,
  handleGroupChange,
  applyGroupChanges,
  selectedGroups,
}) => {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [hoveredTestId, setHoveredTestId] = useState<string | null>(null);
  const navigate = useNavigate();

  const toggleGroupDropdown = (testId: string) => {
    setOpenDropdown(openDropdown === testId ? null : testId);
    setHoveredTestId(openDropdown === testId ? null : testId);
  };

  const handleConfirmSelection = (testId: string) => {
    setOpenDropdown(null);
    setHoveredTestId(null);
    const groupIds = selectedGroups[testId]?.map((g) => g.id) || [];
    applyGroupChanges(testId, groupIds);
  };

  return (
    <ListGroup>
      {tests.map((test, index) => (
        <ListGroup.Item
          key={test.id}
          className={`${styles.testItem} ${
            hoveredTestId === test.id ? styles.testItemHovered : ""
          } d-flex flex-column border-0`}
        >
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

            <div
              className={`${styles.iconContainer} ${
                hoveredTestId === test.id ? styles.iconContainerVisible : ""
              }`}
            >
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
                    onClick={() => navigate("/admin/create-test")}
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

          <div className="d-flex align-items-center">
            <div
              className={`${styles.iconAddGroupContainer} ${
                hoveredTestId === test.id ? styles.iconAddGroupVisible : ""
              }`}
              title="Gruppenzugriff hinzufügen oder entfernen"
              onClick={() => toggleGroupDropdown(test.id)}
            >
              <div className={styles.combinedIcon}>
                <FaUserFriends className={styles.peopleIcon} />
                <div className={styles.plusMinusContainer}>
                  <FaPlus className={styles.plusIcon} />
                  <FaMinus className={styles.minusIcon} />
                </div>
              </div>
            </div>

            <ListGroup className={`${styles.groupList} w-100`}>
              {selectedGroups[test.id]?.length ? (
                selectedGroups[test.id].map((group) => (
                  <ListGroup.Item
                    key={`${test.id}-${group.id}`}
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

          {openDropdown === test.id && (
            <div className={styles.dropdownGroupList}>
              <ListGroup className="w-100">
                {allGroups.map((group) => {
                  const isChecked = selectedGroups[test.id]?.some(
                    (g) => g.id === group.id
                  );

                  return (
                    <ListGroup.Item
                      key={group.id}
                      className="d-flex justify-content-between align-items-center border-0"
                    >
                      <span>{group.name}</span>
                      <Form.Check
                        type="checkbox"
                        checked={isChecked || false}
                        onChange={() => handleGroupChange(test.id, group.id)}
                      />
                    </ListGroup.Item>
                  );
                })}
              </ListGroup>
              <Button
                variant="outline-light"
                className="w-100 mt-2"
                onClick={() => handleConfirmSelection(test.id)}
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
