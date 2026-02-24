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

    console.log("9999 - ", response.data.userInfo);

    localStorage.setItem("user", JSON.stringify(response.data.userInfo));

    return response.data;
  },

  signOut: async () => {
    await api.delete("/auth/signout");
    localStorage.removeItem("user");
    return;
  },

  fetchUserProfile: async () => {
    const response = await api.get("/users/profile", { withCredentials: true });
    return response.data.user;
  },

  refreshToken: async () => {
    const response = await api.post("/auth/refresh-token", {
      withCredentials: true,
    });
    return response.data.accessToken;
  },
};
