import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { authApi } from "../services";
import { authActions } from "../redux";
import { roles } from "../constants";
import { useAuthForm } from "./useAuthForm";
import { LoginHook } from "../types/hookTypes";

export const useLogin = (): LoginHook => {
  const {
    error,
    setError,
    localError,
    setLocalError,
    clearAllErrors,
    handleFieldChange,
    handleApiError, 
  } = useAuthForm();

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (formData: Record<string, string>) => {
    try {
      setError(undefined);
      setLocalError(undefined);

      if (!formData.email.trim() || !formData.password.trim()) {
        setLocalError("Bitte füllen Sie alle Felder aus.");
        return;
      }

      if (localError) return;

      const user = await authApi.login(formData.email, formData.password);
      if (!user) throw new Error("Fehler: Benutzerdaten fehlen.");

      dispatch(authActions.login({ user }));
      clearAllErrors();

      switch (user.role) {
        case roles.USER:
          navigate("/tests", { replace: true });
          break;
        case roles.TEST_CREATOR:
          navigate("/admin/groups", { replace: true });
          break;
        default:
          setError("Unbekannte Rolle. Bitte wenden Sie sich an den Support.");
      }
    } catch (err) {
      handleApiError(err, true); 
    }
  };

  return {
    error,
    setError,
    localError,
    setLocalError,
    clearAllErrors,
    handleSubmit,
    handleFieldChange,
    handleApiError, 
  };
};
