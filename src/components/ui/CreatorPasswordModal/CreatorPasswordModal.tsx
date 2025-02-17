import { useEffect, useRef, useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { authApi } from "../../../services";
import { AlertMessage } from "../../../components";
import { useAuthForm } from "../../../hooks";
import { CreatorPasswordModalProps } from "../../../types/uiTypes"; 

export const CreatorPasswordModal: React.FC<CreatorPasswordModalProps> = ({
  onSuccess,
  onClose,
  onClearParentError,
}) => {
  const [password, setPassword] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);

  const { error, setError, clearAllErrors, handleFieldChange } = useAuthForm();

  useEffect(() => {
    inputRef.current?.focus();
    onClearParentError?.();
  }, [onClearParentError]);

  const handleChange = (value: string) => {
    setPassword(value);
    handleFieldChange();
  };

  const handleSubmit = async () => {
    if (!password.trim()) {
      setError("Das Passwort darf nicht leer sein.");
      return;
    }

    try {
      const success = await authApi.checkCreatorPassword(password);
      if (success) {
        onSuccess();
        handleClose();
      } else {
        setError("Das Passwort ist ungültig.");
      }
    } catch {
      setError("Fehler bei der Passwortüberprüfung.");
    }
  };

  const handleClose = () => {
    clearAllErrors();
    onClose();
  };

  return (
    <>
      {error && (
        <AlertMessage
          message={error}
          type="danger"
          onClose={clearAllErrors}
          zIndex={1070}
        />
      )}

      <Modal
        show
        onHide={handleClose}
        centered
        backdrop="static"
        dialogClassName="form-small"
      >
        <Modal.Header closeButton>
          <Modal.Title>Sind Sie Testersteller?</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={(e) => {e.preventDefault(); handleSubmit()}}>
            <div className="form-floating mb-3">
              <Form.Control
                ref={inputRef}
                type="password"
                value={password}
                onChange={(e) => handleChange(e.target.value)}
                placeholder="Passwort"
                autoComplete="off"
                id="creator-password-input"
              />
              <Form.Label htmlFor="creator-password-input">Passwort</Form.Label>
            </div>
          </Form>
        </Modal.Body>
        <Modal.Footer className="d-flex justify-content-around w-100">
          <Button variant="outline-secondary" onClick={handleClose}>
            Abbrechen
          </Button>
          <Button variant="outline-light" onClick={handleSubmit}>
            Überprüfen
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
