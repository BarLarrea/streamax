export function setUpRefreshTokenCookie(res, refreshToken) {
    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // HTTPS only in production
        sameSite: process.env.NODE_ENV === "production" ? "strict" : "none", //  allow cross-origin in dev
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        path: "/" // minst be sent for all routes
    });
}

export function clearRefreshTokenCookie(res) {
    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "strict" : "none",
        path: "/"
    });
}
