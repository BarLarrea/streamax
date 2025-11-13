import api from "./api.js";
import { API_URLS } from "../config/urls.js";

// ===== USER LEVEL USAGES ====== //

export const createProfileService = async (name, avatar) => {
    const user = localStorage.getItem("user");
    const userId = user ? JSON.parse(user).userId : null;
    if (!user) {
        throw new Error("User not logged in");
    }
    return await api.post(API_URLS.PROFILES.ROOT, {
        userId: userId,
        profileName: name,
        avatar: avatar
    });
};

export const editProfile = async (profileId, name, avatar) => {
    const result = await api.patch(API_URLS.PROFILES.BY_ID(profileId), {
        profileName: name,
        avatar: avatar
    });

    return result.data;
};

export const deleteProfile = async (profileId) => {
    const result = await api.delete(API_URLS.PROFILES.BY_ID(profileId));

    return result.data;
};

// ===== PROFILE LEVEL USAGES ====== //
export const getProfileByIdService = async (profileId) => {
    const res = await api.get(API_URLS.PROFILES.BY_ID(profileId));
    return res.data;
};

export const updateLastWatchedService = async (
    profileId,
    contentId,
    progress
) => {
    const res = await api.put(API_URLS.PROFILES.LAST_WATCHED(profileId), {
        contentId,
        progress
    });
    return res.data;
};
