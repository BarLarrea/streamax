import jwt from "jsonwebtoken";
import { v4 as uuid } from "uuid";

const ACCESS_JWT_SECRET = process.env.ACCESS_JWT_SECRET;
const ACCESS_JWT_EXPIRATION = process.env.ACCESS_JWT_EXPIRATION;

const REFRESH_JWT_SECRET = process.env.REFRESH_JWT_SECRET;
const REFRESH_JWT_EXPIRATION = process.env.REFRESH_JWT_EXPIRATION;

function generateAccessToken(user) {
    if (!user) {
        throw new Error("Invalid user payload for access token generation");
    }
    const payload = {
        userId: user._id,
        userName: user.userName,
        isAdmin: user.isAdmin
    };

    return jwt.sign(payload, ACCESS_JWT_SECRET, {
        expiresIn: ACCESS_JWT_EXPIRATION
    });
}

function generateRefreshToken(userId) {
    if (!userId) {
        throw new Error("Invalid userId for refresh token generation");
    }

    const jti = uuid(); // unique session ID

    const payload = { userId, jti };

    const refreshToken = jwt.sign(payload, REFRESH_JWT_SECRET, {
        expiresIn: REFRESH_JWT_EXPIRATION
    });

    return { refreshToken, jti };
}

export { generateAccessToken, generateRefreshToken };
