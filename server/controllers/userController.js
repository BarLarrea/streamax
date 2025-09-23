import bcrypt from "bcryptjs";

import * as userRepo from "../repositories/userRepository.js";
import { validateEmail, validatePassword } from "../utils/validation.js";
import { formatUser } from "../utils/formatUser.js";

const getUserById = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await userRepo.getUserById(id);
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
        const { id } = req.params;
        const { userName, email, password } = req.body;

        const user = await userRepo.getUserById(id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (userName) {
            const existingName = await userRepo.getUserByUserName(userName);
            if (existingName && existingName._id.toString() !== id) {
                return res
                    .status(400)
                    .json({ message: "UserName already exists" });
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
            if (existingEmail && existingEmail._id.toString() !== id) {
                return res
                    .status(400)
                    .json({ message: "Email already in use" });
            }
            user.email = normalizedEmail;
        }

        if (password) {
            if (!validatePassword(password)) {
                return res.status(400).json({
                    message:
                        "Password must be at least 8 characters, include uppercase, lowercase, number, and special character"
                });
            }
            user.password = await bcrypt.hash(password, 10);
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
        const { id } = req.params;

        const deletedUser = await userRepo.deleteUserAndDependencies(id);

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


export { getUserById, updateUserDetails, deleteUserById };
