import api from "@/lib/axios";

export const authService = {
 signIn: async (username, password) => {
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
 timeout: 15000,
 });
 return response.data.accessToken;
 },
 
 updateProfile: async (payload) => {
 const response = await api.patch("/auth/profile", payload);
 return response.data;
 },

 forgotPassword: async (email) => {
 const response = await api.post("/auth/forgot-password", { email });
 return response.data;
 },

 verifyResetToken: async (email, token) => {
 const response = await api.post("/auth/verify-reset-token", { email, token });
 return response.data;
 },

 resetPassword: async (email, token, newPassword) => {
 const response = await api.post("/auth/reset-password", { email, token, newPassword });
 return response.data;
 },

 changePassword: async (currentPassword, newPassword) => {
 const response = await api.post("/auth/change-password", { currentPassword, newPassword });
 return response.data;
 },

 signInWithGoogle: async (accessToken) => {
 const response = await api.post(
 "/auth/google",
 { accessToken },
 { withCredentials: true }
 );
 return response.data;
 }
};
