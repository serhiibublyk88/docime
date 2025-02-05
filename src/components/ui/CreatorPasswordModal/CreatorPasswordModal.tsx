import { useState, useEffect, useRef } from "react";
import { authApi } from "../../../services/api";
import styles from "./CreatorPasswordModal.module.css";

interface Props {
  onSuccess: () => void;
  onClose: () => void;
}

const CreatorPasswordModal = ({ onSuccess, onClose }: Props) => {
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleSubmit = async () => {
    setError(null);

    try {
      const success = await authApi.checkCreatorPassword(password); 
      if (success) {
        onSuccess();
      } else {
        setError("Das Passwort ist ungültig.");
      }
    } catch {
      setError("Fehler bei der Passwortüberprüfung.");
    }
  };

  return (
    <div className={styles.modalContainer}>
      <div className={styles.backdrop} onClick={onClose}></div>
      <div className={styles.modal}>
        <h3>Geben Sie das Passwort für Testersteller ein</h3>
        {error && <p className={styles.error}>{error}</p>}
        <input
          ref={inputRef}
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Passwort"
          autoComplete="off"
          name="creator-password-input"
        />
        <div className={styles.buttons}>
          <button type="button" onClick={handleSubmit}>
            Überprüfen
          </button>
          <button type="button" onClick={onClose}>
            Abbrechen
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreatorPasswordModal;
