import express from "express";

import {
    getUserById,
    updateUserDetails,
    deleteUserById,
    changeUserPassword
} from "../controllers/userController.js";

const router = express.Router();

router.get("/:id", getUserById);
router.patch("/:id", updateUserDetails);
router.delete("/:id", deleteUserById);
router.put("/:id/password", changeUserPassword);

export default router;
