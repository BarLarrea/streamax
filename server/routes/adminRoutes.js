import express from "express";

import {
    getUserById,
    getAllUsers,
    deleteUserById,
    changeUserStatus,
    makeUserAdmin,
    revokeUserAdmin
} from "../controllers/userController.js";
// import { getAllProfiles } from "../controllers/profileController.js";
// import {
//     getAllContents,
//     createContent,
//     updateContent,
//     deleteContent
// } from "../controllers/contentController.js";

import verifyAccessToken from "../middlewares/authMiddleware.js";
import checkUserStatus from "../middlewares/userStatusMiddleware.js";
import isAdmin from "../middlewares/adminMiddleware.js";
import setTargetUserId from "../middlewares/setTargetUserId.js";

const adminPipeline = [
    verifyAccessToken,
    checkUserStatus,
    isAdmin,
    setTargetUserId
];

const router = express.Router();

//
// User Management
//
router.get("/users", ...adminPipeline, getAllUsers);
router.patch("/users/:id/status", ...adminPipeline, changeUserStatus);
router.patch("/users/:id/make-admin", ...adminPipeline, makeUserAdmin);
router.patch("/users/:id/revoke-admin", ...adminPipeline, revokeUserAdmin);

// mutual
router.get("/users/:id", ...adminPipeline, getUserById);
router.delete("/users/:id", ...adminPipeline, deleteUserById);

export default router;
