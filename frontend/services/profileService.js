import api from "./api.js";
import { API_URLS } from "../config/urls.js";

export const createProfileService = async (name, avatar) => {
    const user = localStorage.getItem("user");
    const userId = user ? JSON.parse(user).userId : null;
    console.log("Creating profile for userId:", userId);
    if (!user) {
        throw new Error("User not logged in");
    }
    return await api.post(API_URLS.PROFILES.ROOT, {
        userId: userId,
        profileName: name,
        avatar: avatar
    });
};
