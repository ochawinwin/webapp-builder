export type UserType = "seeker" | "company";

export interface AuthUser {
  id: string;
  email: string;
  userType: UserType;
}

export interface Session {
  user: AuthUser;
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}
