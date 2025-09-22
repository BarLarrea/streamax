import jwt from "jsonwebtoken";

const verifyAccessToken = (req, res, next) => {
    const authHeader = req.headers["authorization"];

    if (!authHeader)
        return res.status(401).json({ message: "Missing Access Token" });

    if (!authHeader.startsWith("Bearer ")) {
        return res
            .status(401)
            .json({ message: "Invalid Authorization header format" });
    }

    const accessToken = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(accessToken, process.env.ACCESS_JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ message: "Invalid or expired token" });
    }
};
export default verifyAccessToken;
