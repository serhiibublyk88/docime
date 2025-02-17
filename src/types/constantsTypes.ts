// types/constantsTypes.ts

export interface FieldConfig {
  name: string;
  type: "text" | "email" | "password" | "select";
  label: string;
  validator: (value: string, formData?: Record<string, string>) => boolean;
  errorMessage: string;
  options?: { value: string; label: string }[];
  required?: boolean;
}

export interface Group {
  id: string;
  name: string;
}
