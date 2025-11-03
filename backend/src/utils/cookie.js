const isLocal = process.env.NODE_ENV !== "production";

export function setUpRefreshTokenCookie(res, refreshToken) {
    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true, // always true
        sameSite: isLocal ? "none" : "strict",
        path: "/",
        maxAge: 7 * 24 * 60 * 60 * 1000
    });
}

export function clearRefreshTokenCookie(res) {
    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: true,
        sameSite: isLocal ? "none" : "strict",
        path: "/"
    });
}
