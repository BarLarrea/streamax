import Profile from "../models/profileModel.js";

export const saveProfile = async (profile) => {
    return await profile.save();
};

export const findProfileByUserAndName = async (userId, profileName) => {
    return await Profile.findOne({ userId, profileName });
};

export const findProfileById = async (id) => {
    return await Profile.findById(id);
};

export const findProfilesByUserID = async (userId) => {
    return await Profile.find({ userId });
};

export const findAndDeleteProfileById = async (id) => {
    return await Profile.findByIdAndDelete(id);
};
