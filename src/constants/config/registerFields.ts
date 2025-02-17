//  constants/config/registerFields.ts
import { fieldConfigs } from "./fieldConfigs";
import { FieldConfig, Group } from "../../types/constantsTypes"; 

export const registerFields = {
  baseFields: [
    fieldConfigs.username,
    fieldConfigs.email,
    fieldConfigs.password,
    fieldConfigs.confirmPassword,
  ],
  groupField: (groups: Group[]): FieldConfig => ({
    name: "groupId",
    type: "select",
    label: "Gruppe",
    validator: (value: string) => value.trim() !== "",
    errorMessage: "Bitte wählen Sie eine Gruppe aus.",
    options: groups.map((group) => ({
      value: group.id,
      label: group.name,
    })),
  }),
};
