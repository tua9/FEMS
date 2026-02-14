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
};
