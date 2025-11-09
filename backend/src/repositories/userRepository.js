import User from "../models/userModel.js";
import Profile from "../models/profileModel.js";
import WatchHistory from "../models/watchHistoryModel.js";

export const getUserById = async (id) => {
    return await User.findById(id).populate("profiles");
};

export const getUserByUserName = async (userName) => {
    return await User.findOne({ userName }).populate("profiles");
};

export const getUserByEmail = async (email) => {
    return await User.findOne({ email: email.toLowerCase() }).populate(
        "profiles"
    );
};

export const createUser = async (data) => {
    return await User.create(data);
};

export const saveUser = async (user) => {
    return await user.save();
};

export const deleteUser = async (id) => {
    return await User.findByIdAndDelete(id);
};

export const getAllUsers = async () => {
    return await User.find().select("-password").populate("profiles");
};

export const getAllActiveUsers = async () => {
    return await User.find({ isActive: true })
        .select("-password")
        .populate("profiles");
};

export const getAllInactiveUsers = async () => {
    return await User.find({ isActive: false }).select("-password");
};

export const removeProfileFromUser = async (userId, profileId) => {
    return await User.findByIdAndUpdate(
        userId,
        { $pull: { profiles: profileId } },
        { new: true }
    );
};
