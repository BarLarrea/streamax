const setTargetUserId = (req, res, next) => {
    try {
        if (!req.user.isAdmin) {
            req.targetUserId = req.user.userId;
            return next();
        }

        const { id } = req.params;
        if (!id) {
            return res.status(400).json({
                message: "User ID parameter is required for admin actions"
            });
        }

        req.targetUserId = id;

        next();
    } catch (error) {
        console.error("Error in setTargetUserId middleware:", error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export default setTargetUserId;
