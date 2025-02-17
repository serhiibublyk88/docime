// types/uiTypes.ts
import { FieldConfig } from "./constantsTypes";

export interface HeaderProps {
  onLeftMenuToggle?: () => void;
  onRightMenuToggle?: () => void;
  children?: React.ReactNode;
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

