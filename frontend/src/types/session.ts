export interface Session {
  _id: string;
  userId: string;
  refreshToken: string;
  expiresAt: string;
  create_at?: string;
}
