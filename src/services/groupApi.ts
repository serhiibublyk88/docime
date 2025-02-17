import { api } from "./apiClient";
import { Group } from "../types/apiTypes";

export const groupApi = {
  getGroups: async (): Promise<Group[]> => {
    const response = await api.get<Group[]>("/groups/public");
    return response.data;
  },
};
