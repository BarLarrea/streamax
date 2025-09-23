import express from "express";

import {
    getUserById,
    updateUserDetails,
    deleteUserById
} from "../controllers/userController.js";

const router = express.Router();

router.get("/getUser/:id", getUserById);
router.patch("/updateUser/:id", updateUserDetails);
router.delete("/deleteUser/:id", deleteUserById);

export default router;
