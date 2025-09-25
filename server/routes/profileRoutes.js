import express from "express";

import {
    createProfile,
    // getProfileById,
    // getUserProfiles,
    // updateUserDetails,
    // deleteProfileById,
    // getAllProfiles
} from "../controllers/profileController.js";

const router = express.Router();

router.post("/", createProfile);
// router.get("/:id", getProfileById);
// router.get("/", getUserProfiles);
// router.patch("/:id", updateUserDetails);
// router.delete("/:id", deleteProfileById);

// //Admin Routes
// router.get("/", getAllProfiles);

export default router;
