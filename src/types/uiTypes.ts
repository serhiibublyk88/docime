//uiTypes.ts

import { FieldConfig } from "./constantsTypes";

export interface HeaderProps {
  onLeftMenuToggle?: () => void;
  onRightMenuToggle?: () => void;
  shouldShowBurgers: boolean;
  shouldShowRightBurger: boolean;
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

export interface Item {
  id: string;
  name: string;
}

export interface ItemListProps {
  items: {
    id: string;
    name: string;
    additionalInfo?: React.ReactNode;
    icon?: React.ReactNode; //  добавлено
    iconTitle?: string; //  добавлено
    iconColor?: "primary" | "secondary" | "success" | "danger"; //  добавлено
    onIconClick?: () => void; //  добавлено
    actions?: {
      icon: string;
      tooltip: string;
      onClick: () => void;
    }[];
    subItems?: {
      id: string;
      name: string;
      actions?: {
        icon: string;
        tooltip: string;
        onClick: () => void;
      }[];
    }[];
  }[];
  onDelete?: (id: string) => void;
  editItemId?: string | null;
  editValue?: string | null;
  onItemClick?: (id: string) => void;
  onEdit?: (id: string, name?: string) => void;
  onSave?: () => void;
  onCancel?: () => void;
  setEditValue?: (value: string) => void;
  hideIcons?: boolean;
}




