import User from "../models/userModel.js";

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

async function deleteUserById(id) {
    return await User.findByIdAndDelete(id);
}

export {
    getUserById,
    getUserByUserName,
    getUserByEmail,
    createUser,
    deleteUserById,
    saveUser
};
