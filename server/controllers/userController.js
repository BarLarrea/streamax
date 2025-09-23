import bcrypt from "bcryptjs";

import * as userRepo from "../repositories/userRepository.js";
import { validateEmail, validatePassword } from "../utils/validation.js";
import { formatUser } from "../utils/formatUser.js";

const getUserById = async (req, res) => {
    const { userId } = req.user;
    try {
        const user = await userRepo.getUserById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json({
            user: formatUser(user)
        });
    } catch (error) {
        console.error("Get User Error:", error);
        return res
            .status(500)
            .json({ message: "Server error, failed to get user" });
    }
};

const updateUserDetails = async (req, res) => {
    try {
        const { userId } = req.user;

        const { userName, email } = req.body;

        const user = await userRepo.getUserById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (userName) {
            const existingName = await userRepo.getUserByUserName(userName);
            if (existingName && existingName._id.toString() !== userId) {
                return res
                    .status(400)
                    .json({ message: "Username already exists" });
            }
            user.userName = userName;
        }

        if (email) {
            const normalizedEmail = email.toLowerCase();
            if (!validateEmail(normalizedEmail)) {
                return res
                    .status(400)
                    .json({ message: "Invalid email format" });
            }
            const existingEmail = await userRepo.getUserByEmail(
                normalizedEmail
            );
            if (existingEmail && existingEmail._id.toString() !== userId) {
                return res
                    .status(400)
                    .json({ message: "Email already in use" });
            }
            user.email = normalizedEmail;
        }

        await userRepo.saveUser(user);

        return res.status(200).json({
            message: "User updated successfully",
            user: formatUser(user)
        });
    } catch (error) {
        console.error("Update User Error:", error);
        return res
            .status(500)
            .json({ message: "Server error, failed to update user" });
    }
};

const deleteUserById = async (req, res) => {
    try {
        const { userId } = req.user;

        const deletedUser = await userRepo.deleteUserAndDependencies(userId);

        if (!deletedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json({
            message: "User and related data deleted successfully"
        });
    } catch (error) {
        console.error("Delete User Error:", error);
        return res
            .status(500)
            .json({ message: "Server error, failed to delete user" });
    }
};

const changeUserPassword = async (req, res) => {
    try {
        const { userId } = req.user;

        console.log(userId);
        const { oldPassword, newPassword } = req.body;

        if (!oldPassword || !newPassword) {
            return res
                .status(400)
                .json({ message: "Both old and new passwords are required" });
        }

        const user = await userRepo.getUserById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            return res
                .status(401)
                .json({ message: "Old password is incorrect" });
        }

        if (!validatePassword(newPassword)) {
            return res.status(400).json({
                message:
                    "Password must be at least 8 characters, include uppercase, lowercase, number, and special character"
            });
        }

        user.password = await bcrypt.hash(newPassword, 10);
        await userRepo.saveUser(user);

        return res
            .status(200)
            .json({ message: "Password changed successfully" });
    } catch (error) {
        console.error("Change Password Error:", error);
        return res
            .status(500)
            .json({ message: "Server error, failed to change password" });
    }
};

export { getUserById, updateUserDetails, deleteUserById, changeUserPassword };
