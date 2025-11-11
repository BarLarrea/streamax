export const API_URLS = {
    BASE: "http://localhost:3000/api",

    AUTH: {
        LOGIN: "/auth/login",
        REGISTER: "/auth/register",
        LOGOUT: "/auth/logout",
        REFRESH: "/auth/refresh"
    },

    ADMIN: {
        ROOT: "/admin",
        CONTENT: {
            CREATE: "/contents",
            BY_ID: (id) => `/contents/${id}`
        },
        USERS: {
            ROOT: "/users",
            BY_ID: (id) => `/users/${id}`,
            CHANGE_STATUS: (id) => `/users/${id}/status`,
            MAKE_ADMIN: (id) => `/users/${id}/make-admin`,
            REVOKE_ADMIN: (id) => `/users/${id}/revoke-admin`
        },
        PROFILES: {
            ROOT: "/profiles"
        }
    },

    CONTENT: {
        ROOT: "/content",
        SEARCH: (query) => `/content/search?q=${encodeURIComponent(query)}`,
        BY_ID: (id) => `/content/${id}`,
        SERIES_SEASONS: (seriesId) => `/content/series/${seriesId}/seasons`,
        SEASON_EPISODES: (seasonId) => `/content/seasons/${seasonId}/episodes`
    }
};
