import api from "@/lib/axios";

export const authService = {
  signIn: async (username: string, password: string, role: string) => {
    const response = await api.post(
      "/auth/signin",
      {
        username,
        password,
        role,
      },
      { withCredentials: true },
    );
    return response.data;
  },

  signOut: async () => {
    return api.post("/auth/signout", {}, { withCredentials: true });
  },

  fetchUserProfile: async () => {
    const response = await api.get("/users/profile", { withCredentials: true });
    return response.data.user;
  },
};
