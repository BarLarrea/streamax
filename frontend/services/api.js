import { API_URLS } from "../config/urls.js";
import { showError } from "../utils/notifications.js";

// ---- Axios Instance ----
const api = axios.create({
    baseURL: API_URLS.BASE,
    withCredentials: true
});

// ---- Request Interceptor ---- (out)
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

// ---- Response Interceptor (Auto Refresh) ---- (in)
api.interceptors.response.use(
    (res) => res,
    async (error) => {
        const originalRequest = error.config;

        if (originalRequest.url.includes(API_URLS.AUTH.REFRESH)) {
            return Promise.reject(error);
        }

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const { data } = await api.post(API_URLS.AUTH.REFRESH);
                localStorage.setItem("accessToken", data.accessToken);

                originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
                return api(originalRequest);
            } catch (err) {
                await api.post(API_URLS.AUTH.LOGOUT);

                localStorage.removeItem("accessToken");
                localStorage.removeItem("profileId");

                console.error("Token refresh failed:", err);
                showError("Session expired. Please log in again.");

                window.location.href = "#/login";
            }
        }

        return Promise.reject(error);
    }
);

export default api;
