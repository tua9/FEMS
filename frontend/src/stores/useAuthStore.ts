import { create } from "zustand";
import { authService } from "@/services/authService";
import type { AuthState } from "@/types/store";
import { toast } from "sonner";

export const useAuthStore = create<AuthState>((set, get) => ({
  accessToken: null,
  user: null,
  loading: false,

  setAccessToken: (accessToken) => {
    set({ accessToken });
  },

  clearState: () => {
    set({ accessToken: null, user: null, loading: false });
  },

  signIn: async (username: string, password: string, role: string) => {
    try {
      set({ loading: true });
      // API call
      const { accessToken } = await authService.signIn(
        username,
        password,
        role,
      );
      get().setAccessToken(accessToken);

      await get().fetchUserProfile();

      toast.success("Login successful!");
    } catch (error) {
      console.log("Error: " + error);
      toast.error("Login failed. Please try again.");
    } finally {
      set({ loading: false });
    }
  },

  signOut: async () => {
    try {
      get().clearState();
      await authService.signOut();
      toast.success("Logged out successfully!");
    } catch (error) {
      console.log("Error signing out:", error);
      toast.error("Logout failed. Please try again.");
    } finally {
      set({ loading: false });
    }
  },

  fetchUserProfile: async () => {
    try {
      set({ loading: true });
      const user = await authService.fetchUserProfile();
      set({ user });
    } catch (error) {
      console.log("Error fetching user profile:", error);
      toast.error("Failed to fetch user profile.");
    } finally {
      set({ loading: false });
    }
  },

  refreshToken: async () => {
    try {
      set({ loading: true });
      const { user, fetchUserProfile, setAccessToken } = get();
      const newAccessToken = await authService.refreshToken();
      setAccessToken(newAccessToken);

      if (!user) {
        await fetchUserProfile();
      }
    } catch (error) {
      console.log("Error refreshing token:", error);
      get().clearState();
      toast.error("Session expired. Please log in again.");
    } finally {
      set({ loading: false });
    }
  },
}));
