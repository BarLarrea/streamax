import express from "express";

import {
    getUserById,
    updateUserDetails,
    deleteUserById,
    changeUserPassword
} from "../controllers/userController.js";

const router = express.Router();

router.get("/", getUserById);
router.patch("/", updateUserDetails);
router.delete("/", deleteUserById);
router.put("/password", changeUserPassword);

export default router;
