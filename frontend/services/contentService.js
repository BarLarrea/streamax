import { API_URLS } from "../config/urls.js";
import api from "./api.js";

// ======= ADMIN AREA (requires admin) ======= //

/* Create new content */
export const createContentService = async (contentData) => {
    const res = await api.post(
        `${API_URLS.ADMIN.ROOT}${API_URLS.ADMIN.CONTENT.CREATE}`,
        contentData,
        {
            headers: { "Content-Type": "application/json" }
        }
    );
    return res.data;
};

/* Fetch external metadata (IMDb / Rotten Tomatoes) */
export const importExternalMetadataService = async (title, type) => {
    if (!title || !title.trim()) {
        throw new Error("Title is required to fetch metadata.");
    }

    const res = await api.get(
        `${API_URLS.ADMIN.ROOT}${API_URLS.ADMIN.CONTENT.IMPORT_OMDb_META}`,
        {
            params: { title: title.trim(), type }
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

// ===== PUBLIC / USER / PROFILE CONTENT ====== //

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

/* Get contents filtered by genres */
export const getContentsByGenresService = async (
    genres,
    page = 1,
    limit = 20
) => {
    const res = await api.get(API_URLS.CONTENT.ROOT, {
        params: { genres: genres.join(","), page, limit }
    });
    return res.data;
};

/* Get all contents with pagination and optional filters/sorting */
export const getAllContentsPagedService = async (
    page = 1,
    limit = 60,
    params = {}
) => {
    const res = await api.get(API_URLS.CONTENT.ROOT, {
        params: { page, limit, ...params }
    });
    return res.data;
};

export const getContentsByGenreService = async (
    genre,
    page = 1,
    limit = 20,
    sortBy,
    sortOrder,
    watched
) => {
    const profileId = localStorage.getItem("profileId");

    const params = { genre, page, limit, sortBy, sortOrder, profileId };

    if (watched !== undefined) {
        params.watched = watched;
    }

    console.log("Genre params:", params);

    const res = await api.get(API_URLS.CONTENT.GENRE, { params });

    return res.data;
};

// ====== HIERARCHY ===== //

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
