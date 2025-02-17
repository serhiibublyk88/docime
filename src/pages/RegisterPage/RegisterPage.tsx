import { useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";
import { useRegister } from "../../hooks";
import {
  CreatorPasswordModal,
  ValidatedForm,
  AlertMessage,
} from "../../components";
import { registerFields } from "../../constants";

export const RegisterPage = () => {
  const navigate = useNavigate();
  const {
    error,
    setError,
    localError,
    setLocalError,
    showCreatorModal,
    isCreator,
    groups,
    clearAllErrors,
    setIsCreator,
    setShowCreatorModal,
    handleSubmit,
  } = useRegister();

  return (
    <div className="main-content ">
      <h2 className="mb-4">Registrieren</h2>

      {error && (
        <AlertMessage message={error} type="danger" onClose={clearAllErrors} />
      )}

      {showCreatorModal && (
        <CreatorPasswordModal
          onSuccess={() => setIsCreator(true)}
          onClose={() => {
            setShowCreatorModal(false);
            clearAllErrors();
          }}
          onClearParentError={clearAllErrors}
        />
      )}

      <ValidatedForm
        onSubmit={handleSubmit}
        error={error}
        setError={setError}
        localError={localError}
        setLocalError={setLocalError}
        clearLocalErrors={clearAllErrors}
        onFieldChange={clearAllErrors}
        fields={[
          ...registerFields.baseFields,
          ...(isCreator ? [] : [registerFields.groupField(groups)]),
        ]}
        className="bg-dark text-white rounded shadow-lg p-4"
      >
        <Button type="submit" variant="outline-light" className="w-100 mb-3">
          Registrieren
        </Button>
        <Button
          type="button"
          variant="outline-secondary"
          className="w-100"
          onClick={() => navigate("/login")}
        >
          Anmelden
        </Button>

        {!isCreator && (
          <p className="mt-2 text-muted small text-center">
            Als Testersteller registrieren?{" "}
            <a
              href="#"
              className="link-light link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover"
              onClick={(e) => {
                e.preventDefault();
                setShowCreatorModal(true);
              }}
            >
              Hier klicken
            </a>
          </p>
        )}
      </ValidatedForm>
    </div>
  );
};
