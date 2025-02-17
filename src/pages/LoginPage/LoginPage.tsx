import { useNavigate } from "react-router-dom";
import { useLogin } from "../../hooks";
import { ValidatedForm } from "../../components";
import { Button } from "react-bootstrap";
import { loginFields } from "../../constants";

export const LoginPage = () => {
  const {
    error,
    setError,
    localError,
    setLocalError,
    clearAllErrors,
    handleSubmit,
    handleFieldChange,
  } = useLogin();
  
  const navigate = useNavigate();

  return (
    <div className="main-content">
      <h2 className="mb-4">Anmelden</h2>

      <ValidatedForm
        onSubmit={handleSubmit}
        error={error}
        setError={setError}
        localError={localError}
        setLocalError={setLocalError}
        clearLocalErrors={clearAllErrors}
        onFieldChange={handleFieldChange}
        fields={loginFields}
        className="bg-dark text-white rounded shadow-lg p-4"
      >
        <Button type="submit" variant="outline-light" className="w-100 mb-3">
          Anmelden
        </Button>

        <Button
          type="button"
          variant="outline-secondary"
          className="w-100"
          onClick={() => navigate("/register")}
        >
          Registrieren
        </Button>

        <p className="mt-2 text-muted small">
          Kein Konto? Klicken Sie auf Registrieren
        </p>
      </ValidatedForm>
    </div>
  );
};
