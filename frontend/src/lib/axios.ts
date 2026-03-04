import { authService } from "@/services/authService";
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:5001/api",
  withCredentials: true,
  headers: {
    "Cache-Control": "no-cache",
  },
});

api.defaults.timeout = 1000 * 60 * 10;

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;

    // Nếu đã retry rồi thì không làm nữa
    if (error.response?.status === 410 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        await authService.refreshToken();
        // BE sẽ set cookie mới

        return api(originalRequest); // retry lại request cũ
      } catch (err) {
        await authService.signOut();
        location.href = "/login";
        return Promise.reject(err);
      }
    }

    // 401 / 403 → logout luôn, nhưng tránh chuyển hướng nếu đang ở trang login
    if (error.response?.status === 401 || error.response?.status === 403) {
      if (window.location.pathname !== "/login") {
        await authService.signOut();
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  },
);

export default api;
