import express from "express";

import { getUserById, updateUserDetails } from "../controllers/userController.js";

const router = express.Router();

router.get("/getUser/:id", getUserById);
router.patch("/updateUser/:id", updateUserDetails);

export default router;
