import { useState, useEffect, useRef } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { useAppDispatch } from "../../../hooks";
import { createGroup } from "../../../redux";
import { GroupCreationModalProps } from "../../../types/uiTypes";

export const GroupCreationModal: React.FC<GroupCreationModalProps> = ({
  show,
  onClose,
}) => {
  const dispatch = useAppDispatch();
  const [groupName, setGroupName] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (show) {
      setGroupName("");
      inputRef.current?.focus();
    }
  }, [show]);

  const handleCreate = async () => {
    if (!groupName.trim()) return;

    await dispatch(createGroup(groupName.trim()));
    onClose();
  };

  return (
    <Modal show={show} onHide={onClose} centered backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title>Neue Gruppe erstellen</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form
          onSubmit={(e) => {
            e.preventDefault();
            handleCreate();
          }}
        >
          <div className="form-floating mb-3">
            <Form.Control
              ref={inputRef}
              type="text"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              placeholder="Gruppenname"
              autoComplete="off"
            />
            <Form.Label>Gruppenname</Form.Label>
          </div>
        </Form>
      </Modal.Body>
      <Modal.Footer className="d-flex justify-content-around w-100">
        <Button variant="outline-secondary" onClick={onClose}>
          Abbrechen
        </Button>
        <Button variant="outline-light" onClick={handleCreate}>
          Erstellen
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
