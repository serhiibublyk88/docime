import { useState, useCallback, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { AxiosError } from "axios";
import { AuthForm } from "../types/hookTypes"; 

export const useAuthForm = (): AuthForm => {
  const [error, setError] = useState<string | undefined>();
  const [localError, setLocalError] = useState<string | undefined>();
  const location = useLocation();

  const clearAllErrors = useCallback(() => {
    setError(undefined);
    setLocalError(undefined);
  }, []);

  useEffect(() => {
    clearAllErrors();
  }, [location.pathname, clearAllErrors]);

  const handleFieldChange = () => {
    if (error || localError) {
      setError(undefined);
      setLocalError(undefined);
    }
  };

  const handleApiError = (err: unknown, isLogin = false) => {
    if (err instanceof AxiosError && err.response) {
      const statusCode = err.response.status;

      if (statusCode === 401) {
        setError(
          isLogin
            ? "Ungültige E-Mail oder Passwort. Bitte versuchen Sie es erneut."
            : "Ungültige Zugangsdaten. Bitte versuchen Sie es erneut."
        );
        return;
      }

      if (statusCode === 500) {
        setError("Serverfehler. Bitte versuchen Sie es später erneut.");
      } else {
        setError(
          err.response.data?.message ||
            "Ein unbekannter Fehler ist aufgetreten."
        );
      }
    } else {
      setError("Ein unbekannter Fehler ist aufgetreten.");
    }
  };

  return {
    error,
    setError,
    localError,
    setLocalError,
    clearAllErrors,
    handleFieldChange,
    handleApiError,
  };
};
