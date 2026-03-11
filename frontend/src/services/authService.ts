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
    return response.data;
  },

  refreshToken: async () => {
    const response = await api.post("/auth/refresh-token", null, {
      withCredentials: true,
    });
    return response.data.accessToken;
  },
};
