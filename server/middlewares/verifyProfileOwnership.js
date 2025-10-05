import * as profileRepo from "../repositories/profileRipository.js";

const verifyProfileOwnership = async (req, res, next) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ message: "Profile id is missing" });
        }

        const profile = await profileRepo.findProfileById(id);

        if (!profile) {
            return res.status(404).json({ message: "Profile not found" });
        }

        if (profile.userId.toString() !== req.user.userId) {
            return res
                .status(403)
                .json({ message: "Unauthorized to access this profile" });
        }

        req.profile = profile; // Attach profile to request object for further use

        next();
    } catch (error) {
        console.error("Error in verifyProfileOwnership:", error.message);
        return res.status(500).json({ error: "Server error" });
    }
};
export default verifyProfileOwnership;
