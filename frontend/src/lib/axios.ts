import { authService } from "@/services/authService";
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:5001/api",
  withCredentials: true,
  headers: {
    "Cache-Control": "no-cache",
    Pragma: "no-cache",
    Expires: "0",
  },
});

api.defaults.timeout = 1000 * 60 * 10;

// Force-cache-busting query param on GETs to avoid stale responses
api.interceptors.request.use((config) => {
  if ((config.method || '').toLowerCase() === 'get') {
    config.params = { ...(config.params || {}), _ts: Date.now() };

    // Axios v1 uses AxiosHeaders object; support both shapes.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const h: any = config.headers;
    if (h && typeof h.set === 'function') {
      h.set('Cache-Control', 'no-cache');
      h.set('Pragma', 'no-cache');
      h.set('Expires', '0');
    } else {
      config.headers = {
        ...(config.headers || {}),
        'Cache-Control': 'no-cache',
        Pragma: 'no-cache',
        Expires: '0',
      } as any;
    }
  }
  return config;
});

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

    // 401 / 403 → logout luôn, nhưng tránh chuyển hướng nếu đang ở trang login hoặc trang public
    const publicPaths = ["/", "/login", "/report-issue", "/forgot-password"];
    if (error.response?.status === 401 || error.response?.status === 403) {
      if (!publicPaths.includes(window.location.pathname)) {
        await authService.signOut();
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  },
);

export default api;
