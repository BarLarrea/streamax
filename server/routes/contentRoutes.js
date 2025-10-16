import express from "express";

import verifyAccessToken from "../middlewares/authMiddleware.js";
import checkUserStatus from "../middlewares/userStatusMiddleware.js";

import {
    getAllContents,
    getContentById,
    searchContents,
    getSeasonsBySeriesId,
    getEpisodesBySeasonId
} from "../controllers/contentController.js";

const router = express.Router();

const contentPipeline = [verifyAccessToken, checkUserStatus];

router.get("/search", contentPipeline, searchContents);
router.get("/", contentPipeline, getAllContents);
router.get("/:id", contentPipeline, getContentById);
router.get("/series/:seriesId/seasons", contentPipeline, getSeasonsBySeriesId);
router.get(
    "/seasons/:seasonId/episodes",
    contentPipeline,
    getEpisodesBySeasonId
);

export default router;
