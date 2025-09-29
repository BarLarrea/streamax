import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import * as userRepo from "../repositories/userRepository.js";
import { validateEmail, validatePassword } from "../utils/validation.js";
import { generateAccessToken, generateRefreshToken } from "../utils/jwt.js";
import { formatUser } from "../utils/formatUser.js";
import {
    setUpRefreshTokenCookie,
    clearRefreshTokenCookie
} from "../utils/cookie.js";

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

        console.log("Validation passed, ready to create new user");

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
    try {
        const { userName, password } = req.body;

        if (!userName || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

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

        setUpRefreshTokenCookie(res, refreshToken);

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

        if (!user.isActive) {
            user.refreshTokens = [];
            return res.status(403).json({
                message: "User inactive, user has disconnected from all devises"
            });
        }

        // Check if refresh token still exists in user's sessions
        const session = user.refreshTokens.find(
            (tokenSession) =>
                tokenSession.jti === payload.jti &&
                tokenSession.token === refreshToken
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

const logoutUser = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) {
            return res.sendStatus(204); // No content - the user is already disconnected (refresh expired)
        }

        const payload = jwt.verify(
            refreshToken,
            process.env.REFRESH_JWT_SECRET
        );

        const user = await userRepo.getUserById(payload.userId);
        if (user) {
            user.refreshTokens = user.refreshTokens.filter(
                (tokenSession) => tokenSession.jti !== payload.jti
            );
            await userRepo.saveUser(user);
        } else {
            console.log("Logout attempted with non-existing userId");
        }

        clearRefreshTokenCookie(res);

        return res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        console.error("Logout error:", error);

        clearRefreshTokenCookie(res); // Always clear cookie even if token invalid

        return res.status(200).json({ message: "Logged out (invalid token)" });
    }
};

export { registerUser, loginUser, refreshAccessToken, logoutUser };
