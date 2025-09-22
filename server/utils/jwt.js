import jwt from "jsonwebtoken";

function generateAccessToken(user) {
    if (!user) {
        throw new Error("Invalid user payload for token generation");
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

export default generateAccessToken;
