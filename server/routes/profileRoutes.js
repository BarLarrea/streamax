import express from "express";

import {
    createProfile,
    getProfileById,
    getProfilesByUserID,
    updateProfileDetails
    // deleteProfileById,
    // getAllProfiles
} from "../controllers/profileController.js";

const router = express.Router();

router.post("/", createProfile);
router.get("/:id", getProfileById);
router.get("/", getProfilesByUserID);
router.patch("/:id", updateProfileDetails);
// router.delete("/:id", deleteProfileById);

// //Admin Routes
// router.get("/", getAllProfiles);

export default router;
