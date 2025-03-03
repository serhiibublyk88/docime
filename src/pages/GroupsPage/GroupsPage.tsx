import { Container, Row, Col, ListGroup, Form } from "react-bootstrap";
import { FaEdit, FaSave, FaTimes, FaTrash } from "react-icons/fa";
import { DeleteGroupModal, Loader, AlertMessage } from "../../components";
import { useGroups } from "../../hooks/useGroups";
import styles from "./GroupsPage.module.css";

export const GroupsPage: React.FC = () => {
  const {
    isLoading,
    editGroupId,
    groupName,
    deleteGroupId,
    showAlert,
    groups,
    setGroupName,
    handleEditClick,
    handleSaveClick,
    handleCancelEdit,
    handleDeleteClick,
    confirmDeleteGroup,
    handleKeyDown,
    handleNavigateToGroup,
  } = useGroups();

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
                  onClose={() => {}}
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

                      <div className={styles.iconContainer}>
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
          onClose={() => {}}
        />
      )}
    </Container>
  );
};
