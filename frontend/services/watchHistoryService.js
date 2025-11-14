import api from "./api.js";
import { API_URLS } from "../config/urls.js";

/* Get active watching list for a specific profile */
export const getWatchingNowService = async (profileId) => {
    const res = await api.get(API_URLS.WATCH_HISTORY.WATCHING_NOW(profileId));
    return res.data;
};

/* Get full watch history for a specific profile */
export const getWatchHistoryByProfileService = async (profileId) => {
    const res = await api.get(API_URLS.WATCH_HISTORY.BY_PROFILE(profileId));
    return res.data;
};

/* Update progress for a specific content */
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
    return res.data;
};

/* Get completed contents for a profile */
export const getCompletedContentsService = async (profileId) => {
    const res = await api.get(API_URLS.WATCH_HISTORY.COMPLETED(profileId));
    return res.data;
};

export async function getPopularContentsService() {
    const res = await api.get(API_URLS.WATCH_HISTORY.POPULAR);
    return res.data.data;
}
