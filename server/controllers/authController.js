import bcrypt from "bcryptjs";

import * as userRepo from "../repositories/userRepository.js";
import { validateEmail, validatePassword } from "../utils/validation.js";
import { generateAccessToken, generateRefreshToken } from "../utils/jwt.js";
import { formatUser } from "../utils/formatUser.js";

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
        return res.status(400).json({
            message:
                "Password must be at least: 8 characters, one uppercase letter, one lowercase letter,one number, and one special character"
        });
    }

    try {
        const existingName = await userRepo.getUserByUserName(userName);
        if (existingName) {
            return res.status(400).json({ message: "Username already exists" });
        }

        const existingEmail = await userRepo.getUserByEmail(normalizedEmail);
        if (existingEmail) {
            return res.status(400).json({ message: "Email already exists" });
        }

        console.log("Validation passed, ready to create new user...");

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await userRepo.createUser({
            userName,
            email: normalizedEmail,
            password: hashedPassword
        });

        return res.status(201).json({
            message: "User registered successfully",
            user: formatUser(newUser)
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
        const user = await userRepo.getUserByUserName(userName);
        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        if (!user.isActive) {
            return res.status(401).json({ message: "User inactive" });
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const accessToken = generateAccessToken(user);

        const { refreshToken, jti } = generateRefreshToken(user._id);

        user.refreshTokens.push({
            token: refreshToken,
            jti,
            createdAt: new Date(),
            lastUsed: new Date()
        });

        await userRepo.saveUser(user);

        return res.status(200).json({
            message: `The user ${userName} is logged in successfully!`,
            user: formatUser(user),
            accessToken,
            refreshToken
        });
    } catch (error) {
        console.error("Login Error:", error);
        return res
            .status(500)
            .json({ message: "Server Error, Failed to Login" });
    }
};

export { registerUser, loginUser };
