import { Container, Row, Col } from "react-bootstrap";
import {
  ConfirmActionModal,
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
    handleDeleteClick,
    confirmDeleteGroup,
    closeDeleteModal,
    setEditValue,
    deleteGroupId,
    handleCancel,
  } = useGroups();

  return (
    <Container fluid>
      <Row className="align-items-start">
        <Col xs={12} md={8} lg={6} className="mx-auto mt-5">
          <h2 className="mb-3 text-center">Gruppen:</h2>

          {isLoading ? (
            <div className="text-center">
              <Loader size="md" />
            </div>
          ) : showError ? (
            <AlertMessage
              message="Fehler beim Laden der Gruppen."
              type="danger"
              onClose={hideError}
            />
          ) : groups.length > 0 ? (
            <ItemList
              items={groups.map((group) => ({
                id: group.id,
                name: group.name,
              }))}
              editItemId={editItemId}
              editValue={editValue}
              onItemClick={handleItemClick}
              onEdit={(id) => handleEditClick(id, "")}
              onSave={handleSaveClick}
              onCancel={handleCancel}
              onDelete={handleDeleteClick}
              setEditValue={setEditValue}
            />
          ) : (
            <p className="text-center mt-4">Keine Gruppen verfügbar.</p>
          )}
        </Col>
      </Row>

      {/* ✅ Подтверждение удаления группы */}
      {deleteGroupId && (
        <ConfirmActionModal
          show={!!deleteGroupId}
          title="Gruppe löschen"
          message="Sind Sie sicher, dass Sie diese Gruppe löschen möchten? Diese Aktion kann nicht rückgängig gemacht werden."
          confirmText="Löschen"
          confirmVariant="danger"
          onConfirm={confirmDeleteGroup}
          onClose={closeDeleteModal}
          aria-label="Gruppe löschen Modal"
        />
      )}
    </Container>
  );
};
