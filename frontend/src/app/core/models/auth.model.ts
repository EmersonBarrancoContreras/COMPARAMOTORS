// auth.model.ts
export interface AuthTokens {
  token: string;
  refreshToken?: string;
  message?: string;
}

export interface LoginRequest {
  username: string;
  email?: string;
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
  };
  message?: string;
}
