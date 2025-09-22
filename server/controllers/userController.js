import bcrypt from "bcryptjs";

import User from "../models/userModel.js";
import { validateEmail, validatePassword } from "../utils/validation.js";

const registerUser = async (req, res) => {
    const { userName, email, password } = req.body;

    if (!userName || !email || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }

    const normalizedEmail = email.toLowerCase();
    if (!validateEmail(normalizedEmail)) {
        return res.status(400).json({ message: "Invalid email format" });
    }

    if (!validatePassword(password)) {
        return res
            .status(400)
            .json({
                message:
                    "Password must be at least: 8 characters, one uppercase letter, one lowercase letter,one number, and one special character"
            });
    }

    try {
        const existingName = await User.findOne({ userName });
        if (existingName) {
            return res
                .status(400)
                .json({ message: "User Name or Password are already exist" });
        }

        const existingEmail = await User.findOne({ email: normalizedEmail });
        if (existingEmail) {
            return res
                .status(400)
                .json({ message: "User Name or Password are already exist" });
        }

        console.log("Validation passed, ready to create new user...");

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            userName: userName,
            email: normalizedEmail,
            password: hashedPassword
        });

        await newUser.save();

        return res.status(201).json({
            message: "User registered successfully",
            user: {
                userName: newUser.userName,
                email: newUser.email
            }
        });
    } catch (error) {
        console.error("Error creating user:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

const loginUser = async (req, res) => {
    const { userName, password } = req.body;

    if (!userName || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        const user = await User.findOne({ userName });
        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        return res.status(200).json({
            message: `The user ${userName} is logged in successfully!`
        });
    } catch (error) {
        console.error("Login Error:", error);
        return res
            .status(500)
            .json({ message: "Server Error, Failed to Login" });
    }
};

export { registerUser, loginUser };
