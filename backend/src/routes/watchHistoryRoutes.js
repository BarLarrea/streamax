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

// ----- CREATE / UPDATE / DELETE -----
router.post("/", ...watchHistoryPipeline, createWatchHistoryRecord);
router.patch(
    "/archive/:profileId",
    ...watchHistoryPipeline,
    archiveWatchHistoryByProfileId
);
router.patch("/progress", ...watchHistoryPipeline, updateProgress);
router.delete(
    "/profile/:profileId",
    ...watchHistoryPipeline,
    deleteWatchHistoryByProfileId
);

// ----- READ -----
router.get("/watching-now/:profileId", ...watchHistoryPipeline, getWatchingNow);
router.get(
    "/profile/:profileId",
    ...watchHistoryPipeline,
    getWatchHistoryByProfileId
);
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
router.get(
    "/completed/:profileId",
    ...watchHistoryPipeline,
    getCompletedContentsByProfileId
);

// ----- POPULAR CONTENTS -----
router.get("/popular", ...watchHistoryPipeline, getPopularContents);

export default router;
