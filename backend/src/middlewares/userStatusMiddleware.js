import { getUserById } from "../repositories/userRepository.js";

const checkUserStatus = async (req, res, next) => {
    try {
        const { userId } = req.user;
        const user = await getUserById(userId);

        if (!user) {
            console.log("user not found in userStatusMiddleware");
            return res.status(404).json({ message: "User not found" });
        }

        if (!user.isActive) {
            console.log("user account is deactivated (userStatusMiddleware)");
            return res
                .status(403)
                .json({ message: "User account is deactivated" });
        }

        next();
    } catch (error) {
        console.error("Error in checkUserStatus middleware:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export default checkUserStatus;
