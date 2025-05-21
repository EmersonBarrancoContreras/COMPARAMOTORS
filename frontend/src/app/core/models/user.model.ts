// user.model.ts
export interface Role {
  name: string;
  permissions?: Permission[];
}

export interface Permission {
  name: string;
}

export interface User {
  id?: number;
  username: string;
  email: string;
  roles?: Role[];
  password?: string;
  enabled?: boolean;
  name?: string;
}
