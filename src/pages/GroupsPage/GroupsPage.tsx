import { Container, Row, Col } from "react-bootstrap";
import {
  DeleteGroupModal,
  Loader,
  AlertMessage,
  ItemList,
} from "../../components";
import { useGroups } from "../../hooks";

export const GroupsPage: React.FC = () => {
  const {
    isLoading,
    showError,
    hideError,
    groups,
    editItemId,
    editValue,
    handleItemClick,
    handleEditClick,
    handleSaveClick,
    handleCancelEdit,
    handleDeleteClick,
    confirmDeleteGroup,
    closeDeleteModal, 
    handleKeyDown,
    setEditValue,
    deleteGroupId,
  } = useGroups();

  return (
    <Container fluid>
      <Row className="align-items-start">
        <Col xs={12} md={8} lg={6} className="mx-auto mt-5">
          <h2 className="mb-3 text-center">Gruppen :</h2>

          {isLoading && (
            <div className="text-center">
              <Loader size="md" />
            </div>
          )}

          {!isLoading && (
            <>
              {showError && (
                <AlertMessage
                  message="Fehler beim Laden der Gruppen."
                  type="danger"
                  onClose={hideError}
                />
              )}

              {!showError && groups.length > 0 && (
                <ItemList
                  items={groups.map((group) => ({
                    id: group.id,
                    name: group.name,
                  }))}
                  editItemId={editItemId}
                  editValue={editValue}
                  onItemClick={handleItemClick}
                  onEdit={handleEditClick}
                  onSave={handleSaveClick}
                  onCancel={handleCancelEdit}
                  onDelete={handleDeleteClick}
                  setEditValue={setEditValue}
                  onKeyDown={handleKeyDown}
                />
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
          onClose={closeDeleteModal} 
        />
      )}
    </Container>
  );
};
