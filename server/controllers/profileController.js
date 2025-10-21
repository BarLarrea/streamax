import Profile from "../models/profileModel.js";
import * as profileRipo from "../repositories/profileRepository.js";
import * as userRepo from "../repositories/userRepository.js";
import { formatProfile } from "../utils/profileFormatter.js";
import * as contentRepo from "../repositories/contentRepository.js";

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

const getProfilesByUserID = async (req, res) => {
    try {
        const { userId } = req.body;
        if (!userId) {
            return res.status(400).json({ message: "User id is missing" });
        }

        const user = await userRepo.getUserById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const profiles = await profileRipo.findAndDeleteProfileById(userId);
        return res.status(200).json({
            message: "Profiles fetched successfully",
            profiles: profiles.map(formatProfile)
        });
    } catch (error) {
        console.error("Error in getProfilesByUserID:", error.message);
        return res.status(500).json({ error: "Server error" });
    }
};

//
// Aravid from verifyProfileOwnership middleware attaches the profile to req.profile (include validation)
//

const getProfileById = async (req, res) => {
    try {
        const profile = req.profile;

        return res.status(200).json({
            message: "Profile fetched successfully",
            profile: formatProfile(profile)
        });
    } catch (error) {
        console.error("Error in getProfileById:", error.message);
        return res.status(500).json({ error: "Server error" });
    }
};

const updateProfileDetails = async (req, res) => {
    try {
        const { profileName, avatar } = req.body;

        if (!profileName && !avatar) {
            return res.status(400).json({ message: "No fields to update" });
        }

        const profile = req.profile;

        if (profileName && profileName !== profile.profileName) {
            const existingName = await profileRipo.findProfileByUserAndName(
                profile.userId,
                profileName
            );
            if (existingName) {
                return res.status(403).json({
                    message:
                        "Profile name is already in use, choose another name"
                });
            }
            profile.profileName = profileName;
        }

        if (avatar && avatar !== profile.avatar) {
            profile.avatar = avatar;
        }

        await profileRipo.saveProfile(profile);

        return res.status(200).json({
            message: "Profile updated successfully",
            profile: formatProfile(profile)
        });
    } catch (error) {
        console.error("Error in updateProfileDetails:", error.message);
        return res.status(500).json({ error: "Server error" });
    }
};

const deleteProfileById = async (req, res) => {
    try {
        const profile = req.profile;

        const user = await userRepo.getUserById(profile.userId);

        if (!user) {
            return res
                .status(404)
                .json({ message: "Associated user not found" });
        }

        await userRepo.removeProfileFromUser(user._id, profile._id);

        await profileRipo.findAndDeleteProfileById(profile._id);

        return res
            .status(200)
            .json({ message: "Profile deleted successfully" });
    } catch (error) {
        console.error("Error in deleteProfileById:", error.message);
        return res.status(500).json({ error: "Server error" });
    }
};

const updateLastWatched = (profile, contentId, progress) => {
    console.log("Updating last watched:", {
        profileId: profile._id,
        contentId,
        progress
    });
    const index = profile.lastWatched.findIndex(
        (object) => object.contentId.toString() === contentId.toString()
    );
    if (index !== -1) {
        profile.lastWatched[index].progress = progress;
        profile.lastWatched[index].updatedAt = new Date();

        const existing = profile.lastWatched[index]; //get the existing item
        profile.lastWatched.splice(index, 1); // remove it from its current position
        profile.lastWatched.push(existing); // push it to the end
    } else {
        // remove the oldest (first) item
        if (profile.lastWatched.length >= 5) {
            profile.lastWatched.shift();
        }
        profile.lastWatched.push({
            contentId,
            progress,
            updatedAt: new Date()
        });
    }
};

const updateLastWatchedController = async (req, res) => {
    try {
        const { contentId, progress } = req.body;

        if (!contentId || progress == null) {
            return res
                .status(400)
                .json({ message: "Content ID or progress is missing" });
        }

        const profile = req.profile;

        updateLastWatched(profile, contentId, progress);

        await profileRipo.saveProfile(profile);

        return res.status(200).json({
            message: "Last watched updated successfully",
            profile: formatProfile(profile)
        });
    } catch (error) {
        console.error("Error in updateLastWatchedController:", error.message);
        return res.status(500).json({ error: "Server error" });
    }
};

const toggleLikeContent = async (req, res) => {
    try {
        const { contentId } = req.body;

        if (!contentId) {
            return res.status(400).json({ message: "Content id is missing" });
        }

        const content = await contentRepo.findContentById(contentId);

        if (!content) {
            return res.status(404).json({ message: "Content not found" });
        }

        const profile = req.profile;

        const isLiked = profile.likedContent.some(
            (cid) => cid.toString() === contentId.toString()
        );

        let status;
        if (isLiked) {
            // Remove like
            profile.likedContent = profile.likedContent.filter(
                (cid) => cid.toString() !== contentId.toString()
            );
            status = "unliked";
        } else {
            // Add like
            profile.likedContent.push(contentId);
            status = "liked";
        }

        await profileRipo.saveProfile(profile);

        return res.status(200).json({
            message: `Content successfully ${status}`,
            profile: formatProfile(profile)
        });
    } catch (error) {
        console.error("Error in toggleLikeContent:", error.message);
        return res.status(500).json({ error: "Server error" });
    }
};

const getAllProfiles = async (req, res) => {
    try {
        const profiles = await profileRipo.findAllProfiles();
        return res.status(200).json({
            message: "All profiles fetched successfully",
            profiles: profiles.map(formatProfile)
        });
    } catch (error) {
        console.error("Error in getAllProfiles:", error.message);
        return res.status(500).json({ error: "Server error" });
    }
};

export {
    createProfile,
    getProfileById,
    getProfilesByUserID,
    updateProfileDetails,
    deleteProfileById,
    updateLastWatchedController,
    toggleLikeContent,
    getAllProfiles
};
