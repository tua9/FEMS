import { authService } from "@/services/authService";
import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true,
    headers: {
        "Cache-Control": "no-cache",
        "ngrok-skip-browser-warning": "true",
    },
});

console.log("Current API URL:", import.meta.env.VITE_API_URL);

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

        // 401 → logout luôn (hết hạn Auth), nhưng tránh chuyển hướng nếu đang ở trang public
        const publicPaths = ["/", "/login", "/report-issue", "/forgot-password"];
        if (error.response?.status === 401) {
            if (!publicPaths.includes(window.location.pathname)) {
                await authService.signOut();
                window.location.href = "/login";
            }
        }

        return Promise.reject(error);
    },
);

export default api;
