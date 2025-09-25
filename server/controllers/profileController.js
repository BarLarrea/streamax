import Profile from "../models/profileModel.js";
import * as profileRipo from "../repositories/profileRipository.js";
import * as userRepo from "../repositories/userRepository.js";
import { formatProfile } from "../utils/formatedProfile.js";

const createProfile = async (req, res) => {
    try {
        const { userId, profileName, avatar } = req.body;

        if (!userId || !profileName) {
            return res
                .status(400)
                .json({ message: "User id or profile name is missing" });
        }

        const user = await userRepo.getUserById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (!user.isActive) {
            return res.status(403).json({ message: "User inactive" });
        }

        if (user.profiles.length >= 5) {
            return res
                .status(403)
                .json({ message: "User can't activate more than 5 profiles" });
        }

        const existingName = await profileRipo.findProfileByUserAndName(
            userId,
            profileName
        );

        if (existingName) {
            return res.status(403).json({
                message: "Profile name is already in use, choose another name"
            });
        }

        const newProfile = new Profile({
            userId,
            profileName,
            avatar
        });

        await profileRipo.saveProfile(newProfile);

        console.log("New Profile Created:", newProfile);

        user.profiles.push(newProfile._id);
        await userRepo.saveUser(user);

        return res.status(201).json({
            message: "Profile successfully created",
            profile: formatProfile(newProfile)
        });
    } catch (error) {
        console.error("Error in createProfile:", error.message);
        return res.status(500).json({ error: "Server error" });
    }
};

export {
    createProfile
    // getProfileById,
    // getUserProfiles,
    // updateUserDetails,
    // deleteProfileById,
    // getAllProfiles
};
