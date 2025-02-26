//hookTypes.ts
import { MenuItem } from "./uiTypes";

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

export interface SideNavHook {
  isMobile: boolean; // ✅ Добавили флаг мобильного режима

  isLeftMenuOpen: boolean;
  isRightMenuOpen: boolean; // ✅ Обновили название правого меню
  setIsLeftMenuOpen: () => void;
  setIsRightMenuOpen: () => void; // ✅ Обновили название правого меню

  leftMenuItems: MenuItem[];
  rightMenuItems: MenuItem[];
  user: { role: number } | null;

  isGroupModalOpen: boolean;
  setIsGroupModalOpen: (isOpen: boolean) => void;

  shouldShowBurgers: boolean;
  shouldShowRightBurger: boolean; // ✅ Добавили флаг для правого бургера

}


