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
      // API call
      const { accessToken } = await authService.signIn(
        username,
        password,
        role,
      );

      get().setAccessToken(accessToken);

      toast.success("Login successful!");
      await get().fetchUserProfile();
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
    console.log("Fetch User Profile");

    const { user } = get();
    if (user) return;
    console.log("Call Fetch User P: ", user);

    try {
      set({ loading: true });
      const fetched = await authService.fetchUserProfile();
      toast.success("Fetch user success.");
      set({ user: fetched });
    } catch (error) {
      console.log("Error fetching user profile:", error);
      toast.error("Failed to fetch user profile.");
    } finally {
      set({ loading: false });
    }
  },

  refreshToken: async () => {
    console.log("🔄️refresh token");

    try {
      set({ loading: true });
      const { accessToken, user, fetchUserProfile, setAccessToken } = get();

      if (accessToken) return;
      console.log("⛳ AccessToken: ", accessToken);
      console.log(get().accessToken);

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
