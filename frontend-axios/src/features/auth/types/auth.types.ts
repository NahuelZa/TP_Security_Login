export type Role = "user" | "admin";

export interface UserPublic {
  id: number;
  username: string;
  full_name: string;
  email: string;
  role: Role;
  disabled: boolean;
}

export interface UserRegisterPayload {
  username: string;
  full_name: string;
  email: string;
  password: string;
}