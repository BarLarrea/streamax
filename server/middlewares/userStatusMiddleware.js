import { getUserById } from "../repositories/userRepository.js";

const checkUserStatus = async (req, res, next) => {
    try {
        const { id } = req.user;
        const user = await getUserById(id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (!user.isActive) {
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
