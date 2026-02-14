import type { User } from "./user";

export interface AuthState {
  accessToken: string | null;
  user: User | null;
  loading: boolean;

  signIn: (username: string, password: string, role: string) => Promise<void>;
}
