import { Modal, Button } from "react-bootstrap";

interface DeleteGroupModalProps {
  show: boolean;
  groupName: string;
  onDelete: () => void;
  onClose: () => void;
}

export const DeleteGroupModal: React.FC<DeleteGroupModalProps> = ({
  show,
  groupName,
  onDelete,
  onClose,
}) => {
  return (
    <Modal show={show} onHide={onClose} centered backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title>Gruppe löschen</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>
          Sind Sie sicher, dass Sie die Gruppe <strong>{groupName}</strong>{" "}
          löschen möchten? Diese Aktion kann nicht rückgängig gemacht werden.
        </p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline-secondary" onClick={onClose}>
          Abbrechen
        </Button>
        <Button variant="outline-danger" onClick={onDelete}>
          Löschen
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
