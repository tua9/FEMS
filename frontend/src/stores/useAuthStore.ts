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
    set({
      accessToken: null,
      user: null,
      loading: false,
    });
  },

  signIn: async (username: string, password: string, role: string) => {
    try {
      set({ loading: true });
      const { accessToken } = await authService.signIn(username, password, role);
      get().setAccessToken(accessToken);
      toast.success("Login successful!");
      await get().fetchUserProfile();
    } catch (error) {
      // Re-throw so the calling form can catch it and show inline errors.
      // Do NOT call toast.error here — the form handles its own error display.
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  signOut: async () => {
    try {
      get().clearState();
      await authService.signOut();
      toast.success("Logged out successfully!");
    } catch {
      toast.error("Logout failed. Please try again.");
    } finally {
      set({ loading: false });
    }
  },

  fetchUserProfile: async () => {
    const { user } = get();
    if (user) return;

    try {
      set({ loading: true });
      const fetched = await authService.fetchUserProfile();
      set({ user: fetched });
    } catch {
      // Silently fail — refreshToken will handle auth errors globally
    } finally {
      set({ loading: false });
    }
  },

  refreshToken: async () => {
    try {
      set({ loading: true });
      const { accessToken, user, fetchUserProfile, setAccessToken } = get();

      if (accessToken) return;

      const newAccessToken = await authService.refreshToken();
      setAccessToken(newAccessToken);

      if (!user) {
        await fetchUserProfile();
      }
    } catch {
      get().clearState();
      toast.error("Session expired. Please log in again.");
    } finally {
      set({ loading: false });
    }
  },
}));
