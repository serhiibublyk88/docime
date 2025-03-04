import { Container, Row, Col } from "react-bootstrap";
import {
  DeleteGroupModal,
  Loader,
  AlertMessage,
  ItemList,
} from "../../components";
import { useGroups, useItemList } from "../../hooks";



export const GroupsPage: React.FC = () => {
  const { isLoading, showAlert, groups } = useGroups();

  const {
    items,
    editItemId,
    editValue,
    deleteGroupId,
    handleItemClick,
    handleEditClick,
    handleSaveClick,
    handleCancelEdit,
    handleDeleteClick,
    confirmDeleteGroup,
    closeDeleteModal,
    handleKeyDown, 
    setEditValue,
  } = useItemList();

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

              {items.length > 0 && (
                <ItemList
                  items={items}
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
