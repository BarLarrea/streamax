import express from "express";

import verifyAccessToken from "../middlewares/authMiddleware.js";
import checkUserStatus from "../middlewares/userStatusMiddleware.js";
import verifyProfileOwnership from "../middlewares/verifyProfileOwnership.js";

import {
    createProfile,
    getProfilesByUserID,
    getProfileById,
    updateProfileDetails,
    deleteProfileById,
    updateLastWatchedController,
    toggleLikeContent,
    getProfileWithContent
} from "../controllers/profileController.js";

const profilePipeline = [verifyAccessToken, checkUserStatus];

const router = express.Router();

router.post("/", ...profilePipeline, createProfile);
router.get("/", ...profilePipeline, getProfilesByUserID);

// Protected routes - only the profile owner can access
router.get("/:id", ...profilePipeline, verifyProfileOwnership, getProfileById);
router.patch(
    "/:id",
    ...profilePipeline,
    verifyProfileOwnership,
    updateProfileDetails
);
router.delete(
    "/:id",
    ...profilePipeline,
    verifyProfileOwnership,
    deleteProfileById
);
router.put(
    "/last-watched/:id",
    ...profilePipeline,
    verifyProfileOwnership,
    updateLastWatchedController
);
router.put(
    "/toggle-like/:id",
    ...profilePipeline,
    verifyProfileOwnership,
    toggleLikeContent
);
router.get(
    "/:profileId/with-content",
    ...profilePipeline,
    getProfileWithContent
);

export default router;
