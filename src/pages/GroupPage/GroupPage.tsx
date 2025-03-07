import { useParams, useNavigate } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import { useGroup } from "../../hooks";
import {
  Carousel,
  ItemList,
  Loader,
  AlertMessage,
  MemberDeleteModal,
} from "../../components";

export const GroupPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    members,
    isLoading,
    error,
    groupsForCarousel,
    editItemId,
    editValue,
    deleteMemberId,
    setEditValue,
    handleEdit,
    handleSave,
    handleCancel, // ✅ Используем исправленный handleCancel
    handleDeleteClick,
    confirmDeleteMember,
    closeDeleteModal,
    closeError,
  } = useGroup(id || "");

  return (
    <Container fluid>
      <Row className="align-items-start">
        <Col xs={12} md={8} lg={6} className="mx-auto mt-5">
          {isLoading ? (
            <div className="text-center">
              <Loader size="md" />
            </div>
          ) : groupsForCarousel.length > 0 ? (
            <Carousel
              items={groupsForCarousel}
              selectedItemId={id || ""}
              onSelect={(newGroupId) => navigate(`/admin/groups/${newGroupId}`)}
            />
          ) : (
            <p className="text-center text-muted">Keine Gruppen verfügbar</p>
          )}

          {!isLoading && error && (
            <AlertMessage type="danger" message={error} onClose={closeError} />
          )}

          {!isLoading && !error && members.length === 0 && (
            <p className="text-center text-muted">
              Keine Mitglieder in dieser Gruppe
            </p>
          )}

          {!isLoading && !error && members.length > 0 && (
            <ItemList
              items={members.map((member) => ({
                id: member._id,
                name: member.username ?? "Unbekannter Benutzer",
              }))}
              editItemId={editItemId}
              editValue={editValue}
              setEditValue={setEditValue}
              onItemClick={() => {}}
              onSave={handleSave}
              onCancel={handleCancel} // ✅ Теперь правильно сбрасывает редактирование
              onEdit={handleEdit}
              onDelete={handleDeleteClick}
            />
          )}
        </Col>
      </Row>

      {deleteMemberId && (
        <MemberDeleteModal
          show={!!deleteMemberId}
          memberName={
            members.find((m) => m._id === deleteMemberId)?.username ||
            "Unbekanntes Mitglied"
          }
          onDelete={confirmDeleteMember}
          onClose={closeDeleteModal}
        />
      )}
    </Container>
  );
};
