import bcrypt from "bcryptjs";
import User from "../models/userModel.js";
import { validateEmail, validatePassword } from "../utils/validation.js";

const getUserById = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json({
            id: user._id,
            userName: user.userName,
            email: user.email,
            profiles: user.profiles
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
        const userId = req.params.id;
        const { userName, email, password, profiles } = req.body;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (userName) {
            const existingName = await User.findOne({ userName });
            if (existingName && existingName._id.toString() !== userId) {
                return res
                    .status(400)
                    .json({ message: "User name already exists" });
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
            const existingEmail = await User.findOne({
                email: normalizedEmail
            });
            if (existingEmail && existingEmail._id.toString() !== userId) {
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

        if (profiles) {
            user.profiles = profiles;
        }

        await user.save();

        return res.status(200).json({
            message: "User updated successfully",
            user: {
                id: user._id,
                userName: user.userName,
                email: user.email,
                profiles: user.profiles
            }
        });
    } catch (error) {
        console.error("Update User Error:", error);
        return res
            .status(500)
            .json({ message: "Server error, failed to update user" });
    }
};

export { getUserById, updateUserDetails };
