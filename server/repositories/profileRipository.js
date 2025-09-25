import Profile from "../models/profileModel.js";

export const saveProfile = async (profile) => {
    return await profile.save();
};

export const findProfileByUserAndName = async (userId, profileName) => {
    return await Profile.findOne({ userId, profileName });
};

// const ____ = async () => {
//     return;
// };

// const ____ = async () => {
//     return;
// };

// const ____ = async () => {
//     return;
// };

// const ____ = async () => {
//     return;
// };

// const ____ = async () => {
//     return;
// };

// const ____ = async () => {
//     return;
// };
