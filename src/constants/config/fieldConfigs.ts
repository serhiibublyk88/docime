//  constants/config/fieldConfigs.ts
import { FieldConfig } from "../../types/constantsTypes"; 

export const fieldConfigs: Record<string, FieldConfig> = {
  email: {
    name: "email",
    type: "email",
    label: "E-Mail",
    validator: (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
    errorMessage: "Bitte geben Sie eine gültige E-Mail-Adresse ein.",
  },
  password: {
    name: "password",
    type: "password",
    label: "Passwort",
    validator: (value: string) => value.trim() !== "",
    errorMessage: "Das Passwort darf nicht leer sein.",
  },
  confirmPassword: {
    name: "confirmPassword",
    type: "password",
    label: "Passwort bestätigen",
    validator: (value: string, formData) => value === formData?.password,
    errorMessage:
      "Die Bestätigung des Passworts stimmt nicht mit dem Passwort überein.",
  },
  username: {
    name: "username",
    type: "text",
    label: "Benutzername",
    validator: (value: string) => value.trim() !== "",
    errorMessage: "Der Benutzername darf nicht leer sein.",
  },
};
