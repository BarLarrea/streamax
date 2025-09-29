import express from "express";

import {
    createProfile,
    getProfileById,
    getProfilesByUserID,
    updateProfileDetails,
    deleteProfileById,
    updateLastWatchedController,
    toggleLikeContent
} from "../controllers/profileController.js";

const router = express.Router();

router.post("/", createProfile);
router.get("/:id", getProfileById);
router.get("/", getProfilesByUserID);
router.patch("/:id", updateProfileDetails);
router.delete("/:id", deleteProfileById);
router.put("/last-watched/:id", updateLastWatchedController);
router.put("/toggle-like/:id", toggleLikeContent);

export default router;
