import type { User } from "./user";

export interface AuthState {
  accessToken: string | null;
  user: User | null;
  loading: boolean;

  clearState: () => void;
  signIn: (username: string, password: string, role: string) => Promise<void>;
  signOut: () => Promise<void>;
  fetchUserProfile: () => Promise<void>;
}
