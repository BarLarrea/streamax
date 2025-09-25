import User from "../models/userModel.js";
import Profile from "../models/profileModel.js";
import WatchHistory from "../models/watchHistoryModel.js";

const getUserById = async (id) => {
    return await User.findById(id);
};

const getUserByUserName = async (userName) => {
    return await User.findOne({ userName });
};

const getUserByEmail = async (email) => {
    return await User.findOne({ email });
};

const createUser = async (data) => {
    return await User.create(data);
};

const saveUser = async (user) => {
    return await user.save();
};

const deleteUserAndDependencies = async (id) => {
    await Profile.deleteMany({ userId: id });
    await WatchHistory.deleteMany({ userId: id });

    return await User.findByIdAndDelete(id);
};

const getAllUsers = async () => {
    return await User.find().select("-password");
};

const getAllActiveUsers = async () => {
    return await User.find({ isActive: true }).select("-password");
};

const getAllInactiveUsers = async () => {
    return await User.find({ isActive: false }).select("-password");
};

export {
    getUserById,
    getUserByUserName,
    getUserByEmail,
    createUser,
    saveUser,
    deleteUserAndDependencies,
    getAllUsers,
    getAllActiveUsers,
    getAllInactiveUsers
};
