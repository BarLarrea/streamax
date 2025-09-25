import e from "express";
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

const getProfileById = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ message: "Profile id is missing" });
        }

        const profile = await profileRipo.findProfileById(id);
        if (!profile) {
            return res.status(404).json({ message: "Profile not found" });
        }

        return res.status(200).json({
            message: "Profile fetched successfully",
            profile: formatProfile(profile)
        });
    } catch (error) {
        console.error("Error in getProfileById:", error.message);
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

        const profiles = await profileRipo.findeProfilesByUserID(userId);
        return res.status(200).json({
            message: "Profiles fetched successfully",
            profiles: profiles.map(formatProfile)
        });
    } catch (error) {
        console.error("Error in getProfilesByUserID:", error.message);
        return res.status(500).json({ error: "Server error" });
    }
};

const updateProfileDetails = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ message: "Profile id is missing" });
        }

        const { profileName, avatar } = req.body;

        if (!profileName && !avatar) {
            return res.status(400).json({ message: "No fields to update" });
        }

        const profile = await profileRipo.findProfileById(id);
        if (!profile) {
            return res.status(404).json({ message: "Profile not found" });
        }

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
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ message: "Profile id is missing" });
        }

        const profile = await profileRipo.findProfileById(id);
        if (!profile) {
            return res.status(404).json({ message: "Profile not found" });
        }

        const user = await userRepo.getUserById(profile.userId);

        if (!user) {
            return res
                .status(404)
                .json({ message: "Associated user not found" });
        }

        await userRepo.removeProfileFromUser(user._id, profile._id);

        await profileRipo.findeAndDeleteProfileById(id);

        return res
            .status(200)
            .json({ message: "Profile deleted successfully" });
    } catch (error) {
        console.error("Error in deleteProfileById:", error.message);
        return res.status(500).json({ error: "Server error" });
    }
};

const updateLastWatched = (profile, contentId, progress) => {
    const existing = profile.lastWatched.find(
        (item) => item.contentId.toString() === contentId
    );

    if (existing) {
        existing.progress = progress;
        existing.updatedAt = new Date();

        // move the updated item to the end
        profile.lastWatched = [
            ...profile.lastWatched.filter(
                (item) => item.contentId.toString() !== contentId
            ),
            existing
        ];
    } else {
        // remove the oldest (first) item
        if (profile.lastWatched.length >= 5) {
            profile.lastWatched.shift();
        }

        // add the new item to the end
        profile.lastWatched = [
            ...profile.lastWatched,
            { contentId, progress, updatedAt: new Date() }
        ];
    }
};

const updateLastWatchedController = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ message: "Profile id is missing" });
        }
        const { contentId, progress } = req.body;

        if (!contentId || progress == null) {
            return res
                .status(400)
                .json({ message: "Content ID or progress is missing" });
        }

        const profile = await profileRipo.findProfileById(id);
        if (!profile) {
            return res.status(404).json({ message: "Profile not found" });
        }

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

// Toggle like/unlike content
const toggleLikeContent = async (req, res) => {
    try {
        const { id } = req.params; // profileId
        const { contentId } = req.body;

        // TODO: implement logic:
        // 1. Validate inputs
        // 2. Find profile by id
        // 3. If contentId exists → remove it
        // 4. If contentId doesn't exist → add it
        // 5. Save profile and return formatted response

        return res.status(200).json({
            message: "Liked content updated successfully",
            profile: {} // replace with formatProfile(profile)
        });
    } catch (error) {
        console.error("Error in toggleLikeContent:", error.message);
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
    // getAllProfiles
};
