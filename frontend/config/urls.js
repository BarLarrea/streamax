export const API_URLS = {
    BASE: "http://localhost:3000/api",

    AUTH: {
        LOGIN: "/auth/login",
        REGISTER: "/auth/register",
        LOGOUT: "/auth/logout",
        REFRESH: "/auth/refresh"
    },

    USERS: {
        ME: "/users/me",
        UPDATE: "/users/me",
        DELETE: "/users/me",
        CHANGE_PASSWORD: "/users/me/password"
    },

    ADMIN: {
        ROOT: "/admin",
        CONTENT: {
            CREATE: "/contents",
            IMPORT_OMDb_META: "/import-metadata",
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

    /* ---------- Public Content Endpoints ---------- */
    CONTENT: {
        ROOT: "/content",
        GENRE: "/content/genre",
        SEARCH: (query) => `/content/search?q=${encodeURIComponent(query)}`,
        BY_ID: (id) => `/content/${id}`,
        SERIES_SEASONS: (seriesId) => `/content/series/${seriesId}/seasons`,
        SEASON_EPISODES: (seasonId) => `/content/seasons/${seasonId}/episodes`
    },

    /* ---------- Profile Endpoints ---------- */
    PROFILES: {
        ROOT: "/profiles",
        CREATE: "/profiles",
        BY_ID: (id) => `/profiles/${id}`,
        UPDATE: (id) => `/profiles/${id}`,
        DELETE: (id) => `/profiles/${id}`,
        LAST_WATCHED: (id) => `/profiles/last-watched/${id}`,
        TOGGLE_LIKE: (id) => `/profiles/toggle-like/${id}`,
        TOGGLE_LIKE: (id) => `/profiles/toggle-like/${id}`,
        WITH_CONTENT: (id) => `/profiles/${id}/with-content`
    },

    /* ---------- Watch History Endpoints ---------- */
    WATCH_HISTORY: {
        ROOT: "/watch-history",
        UPDATE_PROGRESS: "/watch-history/progress",
        POPULAR: "/watch-history/popular",
        BY_PROFILE: (profileId) => `/watch-history/profile/${profileId}`,
        BY_CONTENT: (contentId) => `/watch-history/content/${contentId}`,
        RECORD: (profileId, contentId) =>
            `/watch-history/${profileId}/${contentId}`,
        COMPLETED: (profileId) => `/watch-history/completed/${profileId}`,
        WATCHING_NOW: (profileId) => `/watch-history/watching-now/${profileId}`,
        ARCHIVE_BY_PROFILE: (profileId) =>
            `/watch-history/archive/${profileId}`,
        DELETE_BY_PROFILE: (profileId) => `/watch-history/profile/${profileId}`
    }
};
