import { Modal, Button } from "react-bootstrap";

interface ConfirmActionModalProps {
  show: boolean;
  title: string;
  message: string;
  confirmText: string;
  confirmVariant?: "primary" | "danger" | "success"; 
  onConfirm: () => void;
  onClose: () => void;
}

export const ConfirmActionModal: React.FC<ConfirmActionModalProps> = ({
  show,
  title,
  message,
  confirmText,
  confirmVariant = "danger", 
  onConfirm,
  onClose,
}) => {
  return (
    <Modal show={show} onHide={onClose} centered backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>{message}</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline-secondary" onClick={onClose}>
          Abbrechen
        </Button>
        <Button variant={`outline-${confirmVariant}`} onClick={onConfirm}>
          {confirmText}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
