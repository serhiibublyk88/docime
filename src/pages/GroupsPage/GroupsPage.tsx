import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useAppDispatch } from "../../hooks";
import {
  fetchGroups,
  deleteGroup,
  editGroup,
  selectGroups,
  groupActions,
} from "../../redux";
import { ListGroup, Container, Row, Col, Form } from "react-bootstrap";
import { FaEdit, FaSave, FaTimes, FaTrash } from "react-icons/fa";
import { DeleteGroupModal, Loader, AlertMessage } from "../../components";
import styles from "./GroupsPage.module.css";

export const GroupsPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const groups = useSelector(selectGroups);
  const [isLoading, setIsLoading] = useState(false);
  const [editGroupId, setEditGroupId] = useState<string | null>(null);
  const [groupName, setGroupName] = useState<string | null>(null);
  const [deleteGroupId, setDeleteGroupId] = useState<string | null>(null);
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    dispatch(fetchGroups()).finally(() => setIsLoading(false));
  }, [dispatch]);

  useEffect(() => {
    if (!isLoading && groups.length === 0) {
      setShowAlert(true);
    } else {
      setShowAlert(false);
    }
  }, [groups.length, isLoading]);

  const handleEditClick = (
    event: React.MouseEvent,
    groupId: string,
    currentName: string
  ) => {
    event.stopPropagation();
    setEditGroupId(groupId);
    setGroupName(currentName);
  };

  const resetSelection = () => {
    setTimeout(() => {
      setEditGroupId(null);
      setGroupName(null);
    }, 50);

    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  };

  const handleSaveClick = async (event: React.MouseEvent) => {
    event.stopPropagation();
    if (!editGroupId || !groupName?.trim()) return;

    const updatedGroups = groups.map((group) =>
      group.id === editGroupId ? { ...group, name: groupName.trim() } : group
    );

    dispatch(groupActions.setGroups(updatedGroups));
    await dispatch(editGroup(editGroupId, groupName.trim()));
    resetSelection();
  };

  const handleCancelEdit = (event: React.MouseEvent) => {
    event.stopPropagation();
    resetSelection();
  };

  const handleDeleteClick = (event: React.MouseEvent, groupId: string) => {
    event.stopPropagation();
    setDeleteGroupId(groupId);
  };

  const confirmDeleteGroup = () => {
    if (deleteGroupId) {
      dispatch(deleteGroup(deleteGroupId));
      setDeleteGroupId(null);
    }
  };

  const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      await handleSaveClick(e as unknown as React.MouseEvent);
    } else if (e.key === "Escape") {
      handleCancelEdit(e as unknown as React.MouseEvent);
    }
  };

  const handleNavigateToGroup = (groupId: string) => {
    if (!editGroupId) {
      navigate(`/admin/groups/${groupId}`);
    }
  };

  return (
    <Container fluid>
      <Row className="align-items-start">
        <Col xs={12} md={8} lg={6} className="mx-auto mt-5">
          <h2 className="mb-3 text-center">Gruppen :</h2>

          {isLoading ? (
            <div className="text-center">
              <Loader size="md" text="Lädt Gruppen..." />
            </div>
          ) : (
            <>
              {showAlert && (
                <AlertMessage
                  message="Keine Gruppen gefunden."
                  type="danger"
                  onClose={() => setShowAlert(false)}
                />
              )}

              {groups.length > 0 && (
                <ListGroup>
                  {groups.map((group, index) => (
                    <ListGroup.Item
                      key={group.id || index}
                      tabIndex={
                        editGroupId && editGroupId !== group.id ? -1 : 0
                      }
                      className={`${
                        styles.groupItem
                      } d-flex justify-content-between align-items-center list-group-item-action border-0 fs-5 ${
                        editGroupId === group.id ? styles.editing : ""
                      }`}
                      style={{
                        pointerEvents:
                          editGroupId && editGroupId !== group.id
                            ? "none"
                            : "auto",
                      }}
                      onClick={() => handleNavigateToGroup(group.id)}
                    >
                      {editGroupId === group.id ? (
                        <Form.Control
                          type="text"
                          value={groupName ?? ""}
                          onChange={(e) => setGroupName(e.target.value)}
                          onKeyDown={handleKeyDown}
                          autoFocus
                          className={styles.editInput}
                        />
                      ) : (
                        <span>
                          {index + 1}. {group.name}
                        </span>
                      )}

                      <div
                        className={`${styles.iconContainer} ${
                          editGroupId && editGroupId !== group.id
                            ? styles.hiddenIcons
                            : ""
                        }`}
                      >
                        {editGroupId === group.id ? (
                          <>
                            <FaSave
                              className={`${styles.icon} ${styles.saveIcon}`}
                              title="Speichern"
                              onClick={handleSaveClick}
                            />
                            <FaTimes
                              className={`${styles.icon} ${styles.cancelIcon}`}
                              title="Abbrechen"
                              onClick={handleCancelEdit}
                            />
                          </>
                        ) : (
                          <>
                            <FaEdit
                              className={`${styles.icon} ${styles.editIcon}`}
                              title="Bearbeiten"
                              onClick={(event) =>
                                handleEditClick(event, group.id, group.name)
                              }
                            />
                            <FaTrash
                              className={`${styles.icon} ${styles.deleteIcon}`}
                              title="Löschen"
                              onClick={(event) =>
                                handleDeleteClick(event, group.id)
                              }
                            />
                          </>
                        )}
                      </div>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </>
          )}
        </Col>
      </Row>

      {deleteGroupId && (
        <DeleteGroupModal
          show={!!deleteGroupId}
          groupName={
            groups.find((group) => group.id === deleteGroupId)?.name || ""
          }
          onDelete={confirmDeleteGroup}
          onClose={() => setDeleteGroupId(null)}
        />
      )}
    </Container>
  );
};
