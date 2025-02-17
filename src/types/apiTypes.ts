export interface User {
  id: string;
  username: string;
  role: number;
  email: string;
  group: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  groupId: string | null;
  role: number;
}

export interface Group {
  id: string;
  name: string;
}
