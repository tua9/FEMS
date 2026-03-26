import api from "@/lib/axios";

export const authService = {
  signIn: async (username: string, password: string) => {
    const response = await api.post(
      "/auth/signin",
      { username, password },
      { withCredentials: true },
    );
    return response.data;
  },

  signOut: async () => {
    await api.post("/auth/logout");
  },

  fetchUserProfile: async () => {
    const response = await api.get("/auth/me");
    // Backend returns user directly in response.data
    return response.data;
  },

  refreshToken: async () => {
    const response = await api.post("/auth/refresh-token", null, {
      withCredentials: true,
    });
    return response.data.accessToken;
  },
  
  updateProfile: async (payload: { phone?: string; dob?: string; displayName?: string }) => {
    const response = await api.patch("/auth/profile", payload);
    return response.data;
  },

  forgotPassword: async (email: string) => {
    const response = await api.post("/auth/forgot-password", { email });
    return response.data;
  },

  verifyResetToken: async (email: string, token: string) => {
    const response = await api.post("/auth/verify-reset-token", { email, token });
    return response.data;
  },

  resetPassword: async (email: string, token: string, newPassword: string) => {
    const response = await api.post("/auth/reset-password", { email, token, newPassword });
    return response.data;
  },

  changePassword: async (currentPassword: string, newPassword: string) => {
    const response = await api.post("/auth/change-password", { currentPassword, newPassword });
    return response.data;
  },

  signInWithGoogle: async (accessToken: string) => {
    const response = await api.post(
      "/auth/google",
      { accessToken },
      { withCredentials: true },
    );
    return response.data;
  },
};
