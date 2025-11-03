export const API_URLS = {
    BASE: "http://localhost:3000/api",

    AUTH: {
        LOGIN: "/auth/login",
        REGISTER: "/auth/register",
        LOGOUT: "/auth/logout",
        REFRESH: "/auth/refresh"
    },

    USERS: {
        ROOT: "/users",
        BY_ID: (id) => `/users/${id}`
    },

    PROFILES: {
        ROOT: "/profiles",
        BY_ID: (id) => `/profiles/${id}`
    },

    CONTENT: {
        ROOT: "/content",
        SEARCH: (query) => `/content/search?q=${encodeURIComponent(query)}`
    }
};
