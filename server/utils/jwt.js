import jwt from "jsonwebtoken";
import { v4 as uuid } from "uuid";

function generateAccessToken(user) {
    if (!user) {
        throw new Error("Invalid user payload for accsess token generation");
    }
    const payload = {
        userId: user._id,
        userName: user.userName,
        isAdmin: user.isAdmin
    };

    return jwt.sign(payload, process.env.ACCESS_JWT_SECRET, {
        expiresIn: process.env.ACCESS_JWT_EXPIRATION
    });
}

function generateRefreshToken(userId) {
    if (!userId) {
        throw new Error("Invalid userId for refresh token generation");
    }

    const jti = uuid(); // unique session ID

    const payload = { userId, jti };

    const refreshToken = jwt.sign(payload, process.env.REFRESH_JWT_SECRET, {
        expiresIn: process.env.REFRESH_JWT_EXPIRATION
    });

    return { refreshToken, jti };
}

export { generateAccessToken, generateRefreshToken };
