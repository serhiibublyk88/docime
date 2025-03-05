import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import { useGroup } from "../../hooks";
import { Carousel, ItemList, Loader, AlertMessage } from "../../components";
import { useSelector } from "react-redux";
import { selectGroups } from "../../redux";

export const GroupPage = () => {
  const { id } = useParams();
  console.log("Полученный groupId из useParams:", id);

  const navigate = useNavigate();
  const { group, members, isLoading, error, removeMember, editMember } =
    useGroup(id || "");
  const groups = useSelector(selectGroups);

  // 🔹 Локальное состояние для редактирования
  const [editItemId, setEditItemId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<string>("");

  const handleEdit = (id: string, name: string) => {
    setEditItemId(id);
    setEditValue(name);
  };

  const handleSave = () => {
    if (editItemId && editValue) {
      editMember(editItemId, editValue);
      setEditItemId(null);
      setEditValue("");
    }
  };

  const handleCancel = () => {
    setEditItemId(null);
    setEditValue("");
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
      handleSave();
    }
  };

  console.log("Group:", group);
  console.log("Members:", members);
  console.log("Is Loading:", isLoading);
  console.log("Error:", error);

  return (
    <Container fluid>
      <Row className="align-items-start">
        <Col xs={12} md={8} lg={6} className="mx-auto mt-5">
          {/* 🔹 Карусель групп */}
          <Carousel
            items={groups}
            selectedItemId={id || ""}
            onSelect={(newGroupId) => navigate(`/admin/groups/${newGroupId}`)}
          />

          {isLoading && (
            <div className="text-center">
              <Loader size="md" />
            </div>
          )}

          {!isLoading && (
            <>
              {error && <AlertMessage type="danger" message={error} />}

              {!error && members.length > 0 && (
                <ItemList
                  items={members.map((member) => ({
                    id: member.id,
                    name: member.username,
                  }))}
                  editItemId={editItemId}
                  editValue={editValue}
                  setEditValue={setEditValue}
                  onItemClick={() => {}}
                  onSave={handleSave}
                  onCancel={handleCancel}
                  onKeyDown={handleKeyDown}
                  onEdit={handleEdit}
                  onDelete={(id) => removeMember(id)}
                />
              )}
            </>
          )}
        </Col>
      </Row>
    </Container>
  );
};
