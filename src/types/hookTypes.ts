export interface AuthForm {
  error: string | undefined;
  setError: (error?: string) => void;
  localError: string | undefined;
  setLocalError: (error?: string) => void;
  clearAllErrors: () => void;
  handleFieldChange: () => void;
  handleApiError: (err: unknown, isLogin?: boolean) => void;
}

export interface LoginHook extends AuthForm {
  handleSubmit: (formData: Record<string, string>) => Promise<void>;
}

export interface RegisterHook extends AuthForm {
  showCreatorModal: boolean;
  isCreator: boolean;
  groups: { id: string; name: string }[];
  setIsCreator: (value: boolean) => void;
  setShowCreatorModal: (value: boolean) => void;
  handleSubmit: (formData: Record<string, string>) => Promise<void>;
}
