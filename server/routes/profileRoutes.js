import express from "express";

import {
    createProfile,
    getProfilesByUserID,
    getProfileById,
    updateProfileDetails,
    deleteProfileById,
    updateLastWatchedController,
    toggleLikeContent
} from "../controllers/profileController.js";

import verifyAccessToken from "../middlewares/authMiddleware.js";
import checkUserStatus from "../middlewares/userStatusMiddleware.js";
import verifyProfileOwnership from "../middlewares/verifyProfileOwnership.js";

const profilePipeline = [verifyAccessToken, checkUserStatus];

const router = express.Router();

router.post("/", profilePipeline, createProfile);
router.get("/", profilePipeline, getProfilesByUserID);

// Protected routes - only the profile owner can access 
router.get("/:id", profilePipeline, verifyProfileOwnership, getProfileById);
router.patch(
    "/:id",
    profilePipeline,
    verifyProfileOwnership,
    updateProfileDetails
);
router.delete(
    "/:id",
    profilePipeline,
    verifyProfileOwnership,
    deleteProfileById
);
router.put(
    "/last-watched/:id",
    profilePipeline,
    verifyProfileOwnership,
    updateLastWatchedController
);
router.put(
    "/toggle-like/:id",
    profilePipeline,
    verifyProfileOwnership,
    toggleLikeContent
);

export default router;
