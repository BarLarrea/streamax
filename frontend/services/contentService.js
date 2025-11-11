import { API_URLS } from "../config/urls.js";
import api from "./api.js";

/* ===========================
   ADMIN AREA (requires admin)
=========================== */

/* Create new content */
export const createContentService = async (contentData) => {
    const res = await api.post(
        `${API_URLS.ADMIN.ROOT}${API_URLS.ADMIN.CONTENT.CREATE}`,
        contentData,
        {
            headers: { "Content-Type": "application/json" } // 👈 הוספה מפורשת
        }
    );
    return res.data;
};

/* Update existing content */
export const updateContentService = async (id, formData) => {
    const res = await api.patch(
        `${API_URLS.ADMIN.ROOT}${API_URLS.ADMIN.CONTENT.BY_ID(id)}`,
        formData
    );
    return res.data;
};

/* Delete content by ID */
export const deleteContentService = async (id) => {
    const res = await api.delete(
        `${API_URLS.ADMIN.ROOT}${API_URLS.ADMIN.CONTENT.BY_ID(id)}`
    );
    return res.data;
};

/* ================================
   PUBLIC / USER / PROFILE CONTENT
=================================== */

/* Search content */
export const searchContentService = async (query) => {
    const res = await api.get(API_URLS.CONTENT.SEARCH(query));
    return res.data;
};

/* Get all content */
export const getAllContentsService = async () => {
    const res = await api.get(API_URLS.CONTENT.ROOT);
    return res.data;
};

/* Get content by ID */
export const getContentByIdService = async (id) => {
    const res = await api.get(API_URLS.CONTENT.BY_ID(id));
    return res.data;
};

/* Get all seasons for a specific series */
export const getSeasonsBySeriesService = async (seriesId) => {
    const res = await api.get(API_URLS.CONTENT.SERIES_SEASONS(seriesId));
    return res.data;
};

/* Get all episodes for a specific season */
export const getEpisodesBySeasonService = async (seasonId) => {
    const res = await api.get(API_URLS.CONTENT.SEASON_EPISODES(seasonId));
    return res.data;
};
