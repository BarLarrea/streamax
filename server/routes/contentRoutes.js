import express from "express";

import verifyAccessToken from "../middlewares/authMiddleware.js";
import checkUserStatus from "../middlewares/userStatusMiddleware.js";

import {
    getAllContents,
    getContentById
} from "../controllers/contentController.js";

const router = express.Router();

const contentPipeline = [verifyAccessToken, checkUserStatus];

router.get("/", contentPipeline, getAllContents);
router.get("/:id", contentPipeline, getContentById);

export default router;
