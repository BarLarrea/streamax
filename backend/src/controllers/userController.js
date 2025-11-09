import bcrypt from "bcryptjs";
import * as userRepo from "../repositories/userRepository.js";
import { validateEmail, validatePassword } from "../utils/validation.js";
import { formatUser } from "../utils/userFormatter.js";
import { findProfilesByUserID } from "../repositories/profileRepository.js";
import { archiveWatchHistoryByProfileId } from "../repositories/watchHistoryRepository.js";
import { findAndDeleteProfileById } from "../repositories/profileRepository.js";

const getUserById = async (req, res) => {
    try {
        const userId = req.targetUserId;

        const user = await userRepo.getUserById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json({ user: formatUser(user) });
    } catch (error) {
        console.error("Get User Error:", error);
        return res
            .status(500)
            .json({ message: "Server error, failed to get user" });
    }
};

const updateUserDetails = async (req, res) => {
    try {
        const userId = req.targetUserId; //Get target user ID from middleware

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
            console.log("Email updated to:", normalizedEmail);
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
        const userId = req.targetUserId;
        if (!userId) {
            return res.status(400).json({ message: "User ID is required" });
        }

        let deletedProfiles = [];
        let profilesWatchHistoryArchived = [];

        const userProfiles = await userRepo.findProfilesByUserID(userId);

        if (userProfiles && userProfiles.length > 0) {
            for (const profile of userProfiles) {
                let { status, data } = await archiveWatchHistoryByProfileId(
                    profile._id
                );
                profilesWatchHistoryArchived.push({
                    profileId: profile._id,
                    status,
                    data
                });
                if (status !== "success") {
                    console.warn(
                        `Failed to archive watch history for profile ${profile._id}`
                    );
                }
            }

            for (const profile of userProfiles) {
                deletedProfiles.push(
                    await findAndDeleteProfileById(profile._id)
                );
            }

            const deletedUser = await userRepo.deleteUser(userId);

            if (!deletedUser) {
                return res.status(404).json({ message: "User not found" });
            }

            return res.status(200).json({
                success: true,
                message: "User and related data deleted successfully",
                deletedProfiles,
                profilesWatchHistoryArchived
            });
        }

        const deletedUser = await userRepo.deleteUser(userId);
        if (!deletedUser) {
            return res.status(404).json({ message: "User not found" });
        }
        return res.status(200).json({
            success: true,
            message: "User deleted successfully",
            deletedProfiles,
            profilesWatchHistoryArchived
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
        const userId = req.targetUserId;

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
        user.refreshTokens = []; //
        await userRepo.saveUser(user);

        return res.status(200).json({
            message: "Password changed successfully, all profiles logged out"
        });
    } catch (error) {
        console.error("Change Password Error:", error);
        return res
            .status(500)
            .json({ message: "Server error, failed to change password" });
    }
};

//
// Admin Only
//

const getAllUsers = async (req, res) => {
    try {
        const users = await userRepo.getAllUsers();

        const formattedUsers = users.map((user) => formatUser(user));

        return res.status(200).json({ users: formattedUsers });
    } catch (error) {
        console.error("Get All Users Error:", error);
        return res
            .status(500)
            .json({ message: "Server error, failed to get users" });
    }
};

const changeUserStatus = async (req, res) => {
    try {
        const userId = req.targetUserId;

        const user = await userRepo.getUserById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        user.isActive = !user.isActive;

        if (!user.isActive) {
            user.refreshTokens = [];
        }

        await userRepo.saveUser(user);

        return res.status(200).json({
            message: `User has been ${
                user.isActive ? "activated" : "deactivated"
            } successfully`
        });
    } catch (error) {
        console.error("Change User Status Error:", error);
        return res
            .status(500)
            .json({ message: "Server error, failed to change user status" });
    }
};

const makeUserAdmin = async (req, res) => {
    try {
        const { adminCode } = req.body;
        if (!adminCode || adminCode !== process.env.ADMIN_CODE) {
            return res.status(403).json({ message: "Invalid admin code" });
        }

        const userId = req.targetUserId;
        if (!userId) {
            return res.status(400).json({ message: "User ID is required" });
        }

        const user = await userRepo.getUserById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        user.isAdmin = true;

        await userRepo.saveUser(user);

        console.log(
            `[ADMIN ACTION] ${
                req.user.id
            } granted admin to ${userId} at ${new Date()}`
        );

        return res
            .status(200)
            .json({ message: "User has been granted admin privileges" });
    } catch (error) {
        console.error("Make User Admin Error:", error);
        return res
            .status(500)
            .json({ message: "Server error, failed to make user admin" });
    }
};

const revokeUserAdmin = async (req, res) => {
    try {
        const { adminCode } = req.body;
        if (!adminCode || adminCode !== process.env.ADMIN_CODE) {
            return res.status(403).json({ message: "Invalid admin code" });
        }

        const userId = req.targetUserId;
        if (!userId) {
            return res.status(400).json({ message: "User ID is required" });
        }

        const user = await userRepo.getUserById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        user.isAdmin = false;

        await userRepo.saveUser(user);

        console.log(
            `[ADMIN ACTION] ${
                req.user.id
            } revoked admin from ${userId} at ${new Date()}`
        );

        return res
            .status(200)
            .json({ message: "User admin privileges have been revoked" });
    } catch (error) {
        console.error("Revoke User Admin Error:", error);
        return res
            .status(500)
            .json({ message: "Server error, failed to revoke admin status" });
    }
};

export {
    getUserById,
    updateUserDetails,
    deleteUserById,
    changeUserPassword,
    getAllUsers,
    changeUserStatus,
    makeUserAdmin,
    revokeUserAdmin
};
