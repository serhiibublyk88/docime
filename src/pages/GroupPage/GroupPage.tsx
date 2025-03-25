import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { useGroup } from "../../hooks";
import {
  Carousel,
  ItemList,
  Loader,
  AlertMessage,
  ConfirmActionModal,
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
    handleCancel,
    handleDeleteClick,
    confirmDeleteMember,
    closeDeleteModal,
    closeError,
  } = useGroup(id || "");

  const [initialLoadDone, setInitialLoadDone] = useState(false);

  // ✅ Только при первой загрузке — показываем Loader
  useEffect(() => {
    if (!isLoading) {
      setInitialLoadDone(true);
    }
  }, [isLoading]);

  return (
    <Container fluid>
      <Row className="align-items-start">
        <Col xs={12} md={8} lg={6} className="mx-auto mt-5">
          {!initialLoadDone ? (
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

          {error && (
            <AlertMessage type="danger" message={error} onClose={closeError} />
          )}

          {!error && members.length === 0 && (
            <p className="text-center text-muted">
              Keine Mitglieder in dieser Gruppe
            </p>
          )}

          {!error && members.length > 0 && (
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
              onCancel={handleCancel}
              onEdit={(id) => {
                const member = members.find((m) => m._id === id);
                handleEdit(id, member?.username ?? "Unbekannter Benutzer");
              }}
              onDelete={handleDeleteClick}
            />
          )}
        </Col>
      </Row>

      {deleteMemberId && (
        <ConfirmActionModal
          show={!!deleteMemberId}
          title="Mitglied entfernen"
          message={`Bist du sicher, dass du ${
            members.find((m) => m._id === deleteMemberId)?.username ||
            "dieses Mitglied"
          } aus der Gruppe entfernen möchtest?`}
          confirmText="Entfernen"
          confirmVariant="danger"
          onConfirm={confirmDeleteMember}
          onClose={closeDeleteModal}
          aria-label="Mitglied entfernen Modal"
        />
      )}
    </Container>
  );
};
