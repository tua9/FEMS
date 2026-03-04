import api from "@/lib/axios";

export const authService = {
  signIn: async (username: string, password: string, role: string) => {
    const response = await api.post(
      "/auth/signin",
      { username, password, role },
      { withCredentials: true },
    );
    return response.data;
  },

  signOut: async () => {
    await api.delete("/auth/signout");
  },

  fetchUserProfile: async () => {
    const response = await api.get("/users/profile");
    return response.data.user;
  },

  refreshToken: async () => {
    const response = await api.post(
      "/auth/refresh-token",
      null,
      { withCredentials: true },
    );
    return response.data.accessToken;
  },
};
