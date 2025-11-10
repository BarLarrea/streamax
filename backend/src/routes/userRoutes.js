import express from "express";

import verifyAccessToken from "../middlewares/authMiddleware.js";
import checkUserStatus from "../middlewares/userStatusMiddleware.js";
import setTargetUserId from "../middlewares/setTargetUserId.js";

import {
    getUserById,
    updateUserDetails,
    deleteUserById,
    changeUserPassword
} from "../controllers/userController.js";

const userPipeline = [verifyAccessToken, checkUserStatus, setTargetUserId];
const router = express.Router();

router.get("/me", ...userPipeline, getUserById);
router.patch("/me", ...userPipeline, updateUserDetails);
router.delete("/me", ...userPipeline, deleteUserById);
router.patch("/me/password", ...userPipeline, changeUserPassword);

export default router;
