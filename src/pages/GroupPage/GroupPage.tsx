import { useState, useCallback } from "react";
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
    groupsForCarousel, // ✅ Группы для карусели
    removeMember,
    editMember,
    closeError,
  } = useGroup(id || "");

  console.log("🔍 [GroupPage] groupsForCarousel:", groupsForCarousel);

  const [editItemId, setEditItemId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<string>("");
  const [deleteMemberId, setDeleteMemberId] = useState<string | null>(null);

  // ✅ Универсальная функция очистки
  const clearSelection = useCallback(() => {
    setEditItemId(null);
    setEditValue("");
    setDeleteMemberId(null);

    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
    document.body.focus();
  }, []);

  // ✅ Функции для работы с участниками
  const handleEdit = useCallback(
    (memberId: string, name: string) => {
      clearSelection();
      setEditItemId(memberId);
      setEditValue(name);
    },
    [clearSelection]
  );

  const handleSave = useCallback(async () => {
    if (editItemId && editValue.trim()) {
      await editMember(editItemId, editValue.trim());
      clearSelection();
    }
  }, [editItemId, editValue, editMember, clearSelection]);

  const handleCancel = useCallback(clearSelection, [clearSelection]);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === "Enter") {
        handleSave();
      } else if (event.key === "Escape") {
        clearSelection();
      }
    },
    [handleSave, clearSelection]
  );

  const handleDeleteClick = useCallback(
    (memberId: string) => {
      clearSelection();
      setDeleteMemberId(memberId);
    },
    [clearSelection]
  );

  const confirmDeleteMember = useCallback(async () => {
    if (deleteMemberId) {
      await removeMember(deleteMemberId);
      clearSelection();
    }
  }, [deleteMemberId, removeMember, clearSelection]);

  const closeDeleteModal = useCallback(clearSelection, [clearSelection]);

  // ✅ Обработка клика по элементу списка (можно расширить)
  const handleItemClick = useCallback((id: string) => {
    console.log(`Item clicked: ${id}`);
  }, []);

  console.log("Props for Carousel:", groupsForCarousel);

  return (
    <Container fluid>
      <Row className="align-items-start">
        <Col xs={12} md={8} lg={6} className="mx-auto mt-5">
          {/* ✅ Карусель рендерится только если есть данные */}
          {groupsForCarousel.length > 0 ? (
            <Carousel
              items={groupsForCarousel}
              selectedItemId={id || ""}
              onSelect={(newGroupId) => navigate(`/admin/groups/${newGroupId}`)}
            />
          ) : (
            <p className="text-center text-muted">Keine Gruppen verfügbar</p>
          )}

          {isLoading && (
            <div className="text-center">
              <Loader size="md" />
            </div>
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
              onItemClick={handleItemClick} // ✅ Добавлен onItemClick
              onSave={handleSave}
              onCancel={handleCancel}
              onKeyDown={handleKeyDown}
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
