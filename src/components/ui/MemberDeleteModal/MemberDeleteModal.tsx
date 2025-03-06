import { Modal, Button } from "react-bootstrap";

interface Props {
  show: boolean;
  memberName: string;
  onDelete: () => void;
  onClose: () => void;
}

export const MemberDeleteModal: React.FC<Props> = ({
  show,
  memberName,
  onDelete,
  onClose,
}) => {
  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Mitglied entfernen</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>
          Bist du sicher, dass du <strong>{memberName}</strong> aus der Gruppe
          entfernen möchtest?
        </p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Abbrechen
        </Button>
        <Button variant="danger" onClick={onDelete}>
          Entfernen
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
