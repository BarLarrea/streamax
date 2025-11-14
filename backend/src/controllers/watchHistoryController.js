import * as watchHistoryRepo from "../repositories/watchHistoryRepository.js";
import watchHistoryFormatter from "../utils/watchHistoryFormatter.js";
import { getContentById } from "../repositories/contentRepository.js";

// ==================== CREATE / UPDATE / DELETE ====================

export const createWatchHistoryRecord = async (req, res) => {
    let profileId;
    let contentId;

    try {
        // Extract early, so they'll exist for the catch block
        ({ profileId, contentId } = req.body);

        if (!profileId || !contentId) {
            return res.status(400).json({
                message: "profileId and contentId are required"
            });
        }

        const content = await getContentById(contentId);

        if (content.status !== "ok") {
            return res.status(404).json({ message: "Content not found" });
        }

        if (content.data.type !== "movie" && content.data.type !== "episode") {
            return res.status(400).json({ message: "Invalid content type" });
        }

        // Try to create a new record
        const { status, data } =
            await watchHistoryRepo.createWatchHistoryRecord(
                profileId,
                contentId,
                content.data.type,
                content.data.duration
            );

        if (status === "invalid_id") {
            return res.status(400).json({
                message: "Invalid profileId or contentId"
            });
        }

        // Success → return new record
        return res.status(201).json({
            success: true,
            message: "Watch history record created",
            data: watchHistoryFormatter(data)
        });
    } catch (error) {
        // ⚠️ Handle duplicate key
        if (error.code === 11000) {
            console.log(
                "Duplicate record detected. Returning existing record."
            );

            // 🔥 Get the existing record instead of failing
            const existing = await watchHistoryRepo.getWatchHistoryRecord(
                profileId,
                contentId
            );

            if (existing.status === "success") {
                return res.status(200).json({
                    success: true,
                    message: "Watch history record already exists",
                    data: watchHistoryFormatter(existing.data)
                });
            }
        }

        console.error("Error in createWatchHistoryRecord:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const archiveWatchHistoryByProfileId = async (req, res) => {
    try {
        const { profileId } = req.params;

        if (!profileId) {
            return res.status(400).json({ message: "profileId is required" });
        }

        const { status, data } =
            await watchHistoryRepo.archiveWatchHistoryByProfileId(profileId);

        if (status === "invalid_id") {
            return res.status(400).json({ message: "Invalid profileId" });
        }

        if (status === "not_found") {
            return res
                .status(404)
                .json({ message: "No watch history records found to archive" });
        }

        return res.status(200).json({
            success: true,
            message: "Watch history records archived",
            data
        });
    } catch (error) {
        console.error("Error in archiveWatchHistoryByProfileId:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const updateProgress = async (req, res) => {
    try {
        const { profileId, contentId, progress } = req.body;
        if (!profileId || !contentId || progress === undefined) {
            return res.status(400).json({
                message: "profileId, contentId and progress are required"
            });
        }

        const numericProgress = Number(progress);
        if (isNaN(numericProgress) || numericProgress < 0) {
            return res
                .status(400)
                .json({ message: "Progress must be a non-negative number" });
        }

        const watchHistoryRecord = await watchHistoryRepo.getWatchHistoryRecord(
            profileId,
            contentId
        );

        if (watchHistoryRecord.status === "invalid_id") {
            return res
                .status(400)
                .json({ message: "Invalid profileId or contentId" });
        }

        if (watchHistoryRecord.status === "not_found") {
            return res
                .status(404)
                .json({ message: "Watch history record not found" });
        }

        const duration = watchHistoryRecord.data.duration;

        if (!duration || isNaN(duration)) {
            return res.status(400).json({
                message: "Invalid or missing duration in watch history record"
            });
        }

        let repoRes = {};
        let action = "";

        console.log({ numericProgress });

        // if (numericProgress >= duration || duration - numericProgress <= 120)
        // The real condition - will be used when we insert full-length content instead of mock

        const mockContentDutatin = 556;

        if (
            numericProgress >= mockContentDutatin ||
            mockContentDutatin - numericProgress <= 20
        ) {
            repoRes = await watchHistoryRepo.markAsCompleted(
                profileId,
                contentId
            );
            action = "marked as completed";
        } else {
            repoRes = await watchHistoryRepo.updateProgress(
                profileId,
                contentId,
                numericProgress
            );
            action = "progress updated";
        }

        return res.status(200).json({
            success: true,
            message: `Watch history record ${action}`,
            data: watchHistoryFormatter(repoRes.data)
        });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const deleteWatchHistoryByProfileId = async (req, res) => {
    try {
        const { profileId } = req.params;
        if (!profileId) {
            return res.status(400).json({ message: "profileId is required" });
        }

        const { status, data } =
            await watchHistoryRepo.deleteWatchHistoryByProfileId(profileId);

        if (status === "invalid_id") {
            return res.status(400).json({ message: "Invalid profileId" });
        }

        if (status === "not_found") {
            return res
                .status(404)
                .json({ message: "No watch history records found to delete" });
        }

        return res.status(200).json({
            success: true,
            message: "Watch history records deleted",
            data
        });
    } catch (error) {
        console.error("Error in deleteWatchHistoryByProfileId:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

// ==================== READ ====================

export const getWatchHistoryByProfileId = async (req, res) => {
    try {
        const { profileId } = req.params;
        if (!profileId) {
            return res.status(400).json({ message: "profileId is required" });
        }

        const { status, data } =
            await watchHistoryRepo.getWatchHistoryByProfileId(profileId);

        if (status === "invalid_id") {
            return res.status(400).json({ message: "Invalid profileId" });
        }

        if (status === "not_found") {
            return res
                .status(404)
                .json({ message: "No watch history records found" });
        }

        return res.status(200).json({
            success: true,
            message: "Watch history records retrieved",
            data: data.map(watchHistoryFormatter)
        });
    } catch (error) {
        console.error("Error in getWatchHistoryByProfileId:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const getWacthHistoryByContentID = async (req, res) => {
    try {
        const { contentId } = req.params;
        if (!contentId) {
            return res.status(400).json({ message: "contentId is required" });
        }

        const { status, data } =
            await watchHistoryRepo.getWatchHistoryByContentId(contentId);

        if (status === "invalid_id") {
            return res.status(400).json({ message: "Invalid contentId" });
        }

        if (status === "not_found") {
            return res
                .status(404)
                .json({ message: "No watch history records found" });
        }

        return res.status(200).json({
            success: true,
            message: "Watch history records retrieved",
            data: data.map(watchHistoryFormatter)
        });
    } catch (error) {
        console.error("Error in getWacthHistoryByContentID:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const getWatchHistoryRecord = async (req, res) => {
    try {
        const { profileId, contentId } = req.params;
        if (!profileId || !contentId) {
            return res
                .status(400)
                .json({ message: "profileId and contentId are required" });
        }

        const { status, data } = await watchHistoryRepo.getWatchHistoryRecord(
            profileId,
            contentId
        );

        if (status === "invalid_id") {
            return res
                .status(400)
                .json({ message: "Invalid profileId or contentId" });
        }

        if (status === "not_found") {
            return res.status(200).json({
                success: true,
                message: "Watch history record not found",
                data: {
                    progress: 0
                }
            });
        }

        return res.status(200).json({
            success: true,
            message: "Watch history record retrieved",
            data: watchHistoryFormatter(data)
        });
    } catch (error) {
        console.error("Error in getWatchHistoryRecord:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const getCompletedContentsByProfileId = async (req, res) => {
    try {
        const { profileId } = req.params;
        if (!profileId) {
            return res.status(400).json({ message: "profileId is required" });
        }

        const { status, data } = await watchHistoryRepo.getCompletedContents(
            profileId
        );

        if (status !== "success") {
            return res
                .status(404)
                .json({ message: "No completed records found" });
        }

        return res.status(200).json({
            success: true,
            message: "Completed contents retrieved",
            data: data.map(watchHistoryFormatter)
        });
    } catch (error) {
        console.error("Error in getCompletedContents:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const getWatchingNow = async (req, res) => {
    try {
        const { profileId } = req.params;
        if (!profileId) {
            return res.status(400).json({ message: "profileId is required" });
        }

        const { status, data } = await watchHistoryRepo.getWatchingNow(
            profileId
        );

        if (status === "error") {
            return res.status(500).json({ message: "Database query failed" });
        }

        if (status === "empty") {
            return res.status(200).json({
                success: true,
                message: "No active watch records found",
                data: []
            });
        }

        return res.status(200).json({
            success: true,
            message: "Active watching list retrieved",
            data: data.map(watchHistoryFormatter)
        });
    } catch (error) {
        console.error("Error in getWatchingNow:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const getPopularContents = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 20;
        const result = await watchHistoryRepo.aggregatePopularContents(limit);

        if (!result.length) {
            return res.status(200).json({
                success: true,
                message: "No popular content found",
                data: []
            });
        }

        return res.status(200).json({
            success: true,
            message: "Popular contents retrieved successfully",
            data: result.map((r) => ({
                watchCount: r.watchCount,
                ...r.content
            }))
        });
    } catch (error) {
        console.error("Error in getPopularContents:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
