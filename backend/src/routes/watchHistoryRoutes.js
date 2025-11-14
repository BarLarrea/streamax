import express from "express";
import verifyAccessToken from "../middlewares/authMiddleware.js";
import checkUserStatus from "../middlewares/userStatusMiddleware.js";
import {
    createWatchHistoryRecord,
    archiveWatchHistoryByProfileId,
    updateProgress,
    deleteWatchHistoryByProfileId,
    getWatchHistoryByProfileId,
    getWacthHistoryByContentID,
    getWatchHistoryRecord,
    getCompletedContentsByProfileId,
    getWatchingNow,
    getPopularContents
} from "../controllers/watchHistoryController.js";

const router = express.Router();
const watchHistoryPipeline = [verifyAccessToken, checkUserStatus];

// ==== POST ==== //
router.post("/", ...watchHistoryPipeline, createWatchHistoryRecord);

// ==== PUT / PATCH ==== //

router.patch("/progress", ...watchHistoryPipeline, updateProgress);

router.patch(
    "/archive/:profileId",
    ...watchHistoryPipeline,
    archiveWatchHistoryByProfileId
);

// ==== DELETE ==== //

router.delete(
    "/profile/:profileId",
    ...watchHistoryPipeline,
    deleteWatchHistoryByProfileId
);

// ==== GET ==== //
router.get("/watching-now/:profileId", ...watchHistoryPipeline, getWatchingNow); //

router.get(
    "/completed/:profileId",
    ...watchHistoryPipeline,
    getCompletedContentsByProfileId
);

router.get(
    "/profile/:profileId",
    ...watchHistoryPipeline,
    getWatchHistoryByProfileId
); //

router.get(
    "/content/:contentId",
    ...watchHistoryPipeline,
    getWacthHistoryByContentID
);

router.get(
    "/:profileId/:contentId",
    ...watchHistoryPipeline,
    getWatchHistoryRecord
);

router.get("/popular", ...watchHistoryPipeline, getPopularContents);

export default router;
