// auth.model.ts
export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  refreshToken?: string;
  user?: {
    id?: number;
    username?: string;
    email?: string;
    roles?: string[];
    rol?: string;
  };
}
