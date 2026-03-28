import { create } from "zustand";
import { authService } from "@/services/authService";
import { toast } from "sonner";

export const useAuthStore = create((set, get) => ({
  accessToken: null,
  user: null,
  loading: false,
  isInitialized: false,

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

  signIn: async (username, password) => {
    try {
      set({ loading: true });
      const { accessToken } = await authService.signIn(username, password);
      get().setAccessToken(accessToken);
      toast.success("Login successful!");
      await get().fetchUserProfile();
    } catch (error) {
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  signInWithGoogle: async (googleAccessToken) => {
    try {
      set({ loading: true });
      const { data } = await authService.signInWithGoogle(googleAccessToken);
      get().setAccessToken(data.accessToken);
      toast.success("Login successful!");
      await get().fetchUserProfile();
    } catch (error) {
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

  /** Always refetch /auth/me (e.g. after backend adds populated fields). */
  refreshUserProfile: async () => {
    try {
      set({ loading: true });
      const fetched = await authService.fetchUserProfile();
      set({ user: fetched });
    } catch {
      // Leave existing user on failure
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
    } catch {
      get().clearState();
    } finally {
      set({ loading: false, isInitialized: true });
    }
  },

  updateProfile: async (payload) => {
    try {
      set({ loading: true });
      const { user } = await authService.updateProfile(payload);
      set({ user });
      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to update profile");
      throw error;
    } finally {
      set({ loading: false });
    }
  },
}));
