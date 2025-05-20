// user.model.ts
import { Role } from './role.model';

export interface User {
  id?: number;
  username: string;
  password?: string;
  email: string;
  enabled?: boolean;
  roles?: Role[];
  name?: string;
}

export interface UserRequest {
  username: string;
  password: string;
  email: string;
  name?: string;
}

export interface UserResponse {
  id: number;
  username: string;
  email: string;
  enabled: boolean;
  roles: Role[];
  name?: string;
}
