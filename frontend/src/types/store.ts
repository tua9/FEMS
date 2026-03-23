import type { User } from "./user";

export interface AuthState {
  accessToken: string | null;
  user: User | null;
  loading: boolean;
  isInitialized: boolean;

  setAccessToken: (accessToken: string | null) => void;

  clearState: () => void;
  signIn: (username: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  fetchUserProfile: () => Promise<void>;
  refreshToken: () => Promise<void>;
  updateProfile: (payload: { phone?: string; dob?: string; displayName?: string }) => Promise<void>;
}
