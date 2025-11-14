import api from "./api.js";
import { API_URLS } from "../config/urls.js";

// ==== POST ==== //
export async function createWatchHistoryRecordService(profileId, contentId) {
    const res = await api.post(API_URLS.WATCH_HISTORY.ROOT, {
        profileId,
        contentId
    });
    return res.data.data;
}

// ==== PUT / PATCH ==== //
export const updateWatchProgressService = async (
    profileId,
    contentId,
    progress
) => {
    const res = await api.patch(API_URLS.WATCH_HISTORY.UPDATE_PROGRESS, {
        profileId,
        contentId,
        progress
    });
    return res.data.data;
};

// ==== GET ==== //

export const getWatchingNowService = async (profileId) => {
    const res = await api.get(API_URLS.WATCH_HISTORY.WATCHING_NOW(profileId));
    return res.data;
};

export const getWatchHistoryByProfileService = async (profileId) => {
    const res = await api.get(API_URLS.WATCH_HISTORY.BY_PROFILE(profileId));
    return res.data;
};

export const getCompletedContentsService = async (profileId) => {
    const res = await api.get(API_URLS.WATCH_HISTORY.COMPLETED(profileId));
    return res.data;
};

export async function getPopularContentsService() {
    const res = await api.get(API_URLS.WATCH_HISTORY.POPULAR);
    return res.data.data;
}

export async function getLastProgressService(profileId, contentId) {
    const response = await api.get(
        API_URLS.WATCH_HISTORY.LAST_PROGRESS(profileId, contentId)
    );

    return response.data?.progress || 0;
}

export async function getSingleRecordService(profileId, contentId) {
    const response = await api.get(
        API_URLS.WATCH_HISTORY.LAST_PROGRESS(profileId, contentId)
    );

    return response.data.data;
}

export async function getDailyViewsForUserService(userId) {
    const res = await api.get(`/watch-history/stats/daily/${userId}`);
    return res.data.profiles;
}

export async function getGenrePopularityService() {
    const res = await api.get(`/watch-history/stats/genres`);
    return res.data.data;
}
