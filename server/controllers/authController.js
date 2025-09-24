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

        if (user.refreshTokens.length === 5) {
            return res.status(403).json({
                message:
                    "A user can be logged in on a maximum of 5 devices simultaneously"
            });
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

        // Set first refresh token as HttpOnly cookie
        return res
            .cookie("refreshToken", refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production", // only over HTTPS in prod
                sameSite: "strict",
                maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
            })
            .status(200)
            .json({
                message: `The user ${userName} is logged in successfully!`,
                user: formatUser(user),
                accessToken
            });
    } catch (error) {
        console.error("Login Error:", error);
        return res
            .status(500)
            .json({ message: "Server Error, Failed to Login" });
    }
};

const refreshAccessToken = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) {
            return res
                .status(401)
                .json({ message: "No refresh token provided" });
        }

        const payload = jwt.verify(
            refreshToken,
            process.env.REFRESH_JWT_SECRET
        );

        const user = await userRepo.getUserById(payload.userId);
        if (!user) {
            return res.status(401).json({ message: "User not found" });
        }

        // Check if refresh token still exists in user's sessions
        const session = user.refreshTokens.find(
            (refreshToken) =>
                refreshToken.jti === payload.jti &&
                refreshToken.token === refreshToken
        );
        if (!session) {
            return res
                .status(403)
                .json({ message: "Invalid or expired refresh token" });
        }

        // Update lastUsed for this session
        session.lastUsed = new Date();
        await userRepo.saveUser(user);

        // Generate a new access token
        const newAccessToken = generateAccessToken(user);

        return res.status(200).json({
            message: "Access token refreshed successfully",
            accessToken: newAccessToken
        });
    } catch (error) {
        console.error("Refresh access token error:", error);
        return res
            .status(403)
            .json({ message: "Invalid or expired refresh token" });
    }
};

export { registerUser, loginUser, refreshAccessToken };
