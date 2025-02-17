import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { authApi, groupApi } from "../services";
import { authActions } from "../redux";
import { useDispatch } from "react-redux";
import { roles } from "../constants";
import { useAuthForm } from "./useAuthForm";
import { RegisterHook } from "../types/hookTypes";

export const useRegister = (): RegisterHook => {
  const {
    error,
    setError,
    localError,
    setLocalError,
    clearAllErrors,
    handleApiError,
    handleFieldChange, 
  } = useAuthForm();

  const [showCreatorModal, setShowCreatorModal] = useState(false);
  const [isCreator, setIsCreator] = useState(false);
  const [groups, setGroups] = useState<{ id: string; name: string }[]>([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const data = await groupApi.getGroups();
        setGroups(data);
      } catch {
        setError("Fehler beim Laden der Gruppen.");
      }
    };

    fetchGroups();
  }, [setError]);

  const handleSubmit = async (formData: Record<string, string>) => {
    try {
      if (formData.password !== formData.confirmPassword) {
        setLocalError("Die Passwörter stimmen nicht überein.");
        return;
      }

      const user = await authApi.registerUser({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        role: isCreator ? roles.TEST_CREATOR : roles.USER,
        groupId: isCreator ? null : formData.groupId,
      });

      dispatch(authActions.login({ user }));
      setShowCreatorModal(false);
      clearAllErrors();

      navigate(user.role === roles.USER ? "/tests" : "/admin/groups", {
        replace: true,
      });
    } catch (err) {
      handleApiError(err);
    }
  };

  return {
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
    handleApiError,
    handleFieldChange, 
  };
};
