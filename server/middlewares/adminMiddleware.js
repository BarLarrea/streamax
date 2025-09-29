const isAdmin = (req, res, next) => {
    if (req.user && req.user.role === "admin") {
        const now = new Date().toISOString();
        console.log(`Admin access granted to ${req.user.username} at ${now}`);
        next();
    } else {
        const now = new Date().toISOString();
        console.warn(
            `Admin access denied to ${
                req.user ? req.user.username : "unknown user"
            } at ${now}`
        );
        return res.status(403).json({ message: "Access denied. Admins only." });
    }
};

export default isAdmin;
