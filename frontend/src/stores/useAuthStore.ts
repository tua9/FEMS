import { create } from "zustand";
import { authService } from "@/services/authService";
import type { AuthState } from "@/types/store";
import { toast } from "sonner";

export const useAuthStore = create<AuthState>((set, get) => ({
  accessToken: null,
  user: null,
  loading: false,

  signIn: async (username: string, password: string, role: string) => {
    try {
      set({ loading: true });
      // API call
      authService.signIn(username, password, role);

      toast.success("Login successful!");
    } catch (error) {
      console.log("Error: " + error);
      toast.error("Login failed. Please try again.");
    } finally {
      set({ loading: false });
    }
  },
}));
