import { FieldConfig } from "./constantsTypes";
// import { JSX } from "react"; // ✅ Импортируем JSX.Element для иконок

export interface HeaderProps {
  onLeftMenuToggle?: () => void; // ✅ Теперь без аргументов
  onRightMenuToggle?: () => void; // ✅ Теперь без аргументов
  shouldShowBurgers: boolean; // ✅ Добавлено
  shouldShowRightBurger: boolean; // ✅ Добавлено
}

export interface MenuItem {
  label: string;
  path: string;
  icon?: JSX.Element;
  addIcon?: JSX.Element;
  onAddClick?: () => void;
}

export interface SideNavProps {
  position?: "left" | "right";
  items: MenuItem[];
  isMobile?: boolean;
  isOpen: boolean;
  onClose: () => void;
}


export interface SideNavConfig {
  isOpen: boolean;
  items: MenuItem[];
  setOpen: (open: boolean) => void; 
}

export interface AlertMessageProps {
  message?: string;
  type?: "danger" | "success" | "warning" | "info";
  onClose?: () => void;
  zIndex?: number;
}

export interface CreatorPasswordModalProps {
  onSuccess: () => void;
  onClose: () => void;
  onClearParentError?: () => void;
}

export interface ValidatedFormProps {
  onSubmit: (data: Record<string, string>) => Promise<void>;
  error?: string;
  setError?: (error?: string) => void;
  localError?: string;
  setLocalError?: (error?: string) => void;
  clearLocalErrors?: () => void;
  onFieldChange?: () => void;
  fields: FieldConfig[];
  children: React.ReactNode;
  className?: string;
}


export interface GroupCreationModalProps {
  show: boolean;
  onClose: () => void;
}

export type LoaderProps = {
  size?: "sm" | "md" | "lg"; 
  variant?: "light" | "dark" | "primary" | "secondary"; 
  centered?: boolean; 
  text?: string; 
};

