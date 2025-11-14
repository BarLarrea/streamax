import WatchHistory from "../models/watchHistoryModel.js";
import { isValidId } from "../utils/dalUtils.js";

// ==================== CREATE / UPDATE / DELETE ====================

export const createWatchHistoryRecord = async (profileId, contentId) => {
    if (!isValidId(profileId) || !isValidId(contentId)) {
        return { status: "invalid_id", data: null };
    }

    const newRecord = await WatchHistory.create({
        profileId,
        contentId
    });

    return { status: "success", data: newRecord.toObject() }; // if the create isnt success, an error will be thrown and it will be catched in the controller
};

// Archive watch history when profile is deleted and keep the data for analytics
export const archiveWatchHistoryByProfileId = async (profileId) => {
    if (!isValidId(profileId)) {
        return { status: "invalid_id", data: null };
    }

    const result = await WatchHistory.updateMany(
        { profileId },
        { isArchived: true }
    );

    if (result.matchedCount === 0) {
        return { status: "not_found", data: [] };
    }

    return { status: "success", data: result };
};

export const updateWatchHistoryRecord = async (WatchHistoryRecord) => {
    return await WatchHistory.save();
};

export const updateProgress = async (profileId, contentId, progress) => {
    if (!isValidId(profileId) || !isValidId(contentId)) {
        return { status: "invalid_id", data: null };
    }

    const data = await WatchHistory.findOneAndUpdate(
        { profileId, contentId },
        { progress },
        { new: true }
    );

    return { status: "success", data };
};

export const markAsCompleted = async (profileId, contentId) => {
    if (!isValidId(profileId) || !isValidId(contentId)) {
        return { status: "invalid_id", data: null };
    }

    const data = await WatchHistory.findOneAndUpdate(
        { profileId, contentId },
        { isCompleted: true, progress: 0 },
        { new: true }
    );

    return { status: "success", data };
};

export const deleteWatchHistoryByProfileId = async (profileId) => {
    if (!isValidId(profileId)) {
        return { status: "invalid_id", data: null };
    }

    const result = await WatchHistory.deleteMany({ profileId });

    if (result.deletedCount === 0) {
        return { status: "not_found", data: [] };
    }

    return { status: "success", data: result };
};

export const deleteWatchHistoryByContentId = async (contentId) => {
    if (!isValidId(contentId)) {
        return { status: "invalid_id", data: null };
    }

    const result = await WatchHistory.deleteMany({ contentId });

    if (result.deletedCount === 0) {
        return { status: "not_found", data: [] };
    }

    return { status: "success", data: result };
};

// ==================== READ  ====================

export const getWatchHistoryByProfileId = async (profileId) => {
    if (!isValidId(profileId)) {
        return { status: "invalid_id", data: null };
    }

    const records = await WatchHistory.find(
        { profileId },
        "contentId type durationAtWatch progress isCompleted updatedAt"
    )
        .populate({
            path: "contentId",
            select: "title type posterUrl duration description releaseYear genres"
        })
        .sort({ updatedAt: -1 })
        .limit(20)
        .lean();

    if (!result) {
        return { status: "error", data: null };
    }

    if (result.length === 0) {
        return { status: "empty", data: [] };
    }

    return { status: "success", data: result };
};

export const getWatchHistoryByContentId = async (contentId) => {
    if (!isValidId(contentId)) {
        return { status: "invalid_id", data: null };
    }

    const result = await WatchHistory.find(
        { contentId },
        "profileId progress isCompleted"
    )
        .lean()
        .sort({ updatedAt: -1 });

    if (result.length === 0) {
        return { status: "not_found", data: [] };
    }

    return { status: "success", data: result };
};

export const getWatchHistoryRecord = async (profileId, contentId) => {
    if (!isValidId(profileId) || !isValidId(contentId)) {
        return { status: "invalid_id", data: null };
    }

    const record = await WatchHistory.findOne({
        profileId,
        contentId
    }).lean();

    if (!record) {
        return { status: "not_found", data: null };
    }

    return { status: "success", data: record };
};

export const getCompletedContentsByProfileId = async (profileId) => {
    if (!isValidId(profileId)) {
        return { status: "invalid_id", data: null };
    }

    const result = await WatchHistory.find(
        { profileId, isCompleted: true },
        "contentId durationAtWatch progress updatedAt completedAt"
    )
        .populate({
            path: "contentId",
            select: "title type posterUrl duration description releaseYear genres"
        })
        .lean()
        .sort({ completedAt: -1 });

    if (!result) {
        return { status: "error", data: null };
    }

    if (result.length === 0) {
        return { status: "empty", data: [] };
    }

    return { status: "success", data: result };
};

export const getWatchingNow = async (profileId) => {
    if (!isValidId(profileId)) {
        return { status: "invalid_id", data: null };
    }

    const result = await WatchHistory.find(
        {
            profileId,
            isCompleted: false,
            progress: { $gt: 0 } // watched at least a bit
        },
        "contentId type durationAtWatch progress updatedAt"
    )
        .populate({
            path: "contentId",
            select: "title type posterUrl duration description releaseYear genres" //Reduse API calls in front
        })
        .lean()
        .sort({ updatedAt: -1 });

    if (!result) {
        return { status: "error", data: null };
    }

    if (result.length === 0) {
        return { status: "empty", data: [] };
    }

    return { status: "success", data: result };
};

export const aggregatePopularContents = async (limit = 20) => {
    try {
        const result = await WatchHistory.aggregate([
            {
                $group: {
                    _id: "$contentId",
                    watchCount: { $sum: 1 }
                }
            },
            { $sort: { watchCount: -1 } },
            { $limit: limit },
            {
                $lookup: {
                    from: "contents",
                    localField: "_id",
                    foreignField: "_id",
                    as: "content"
                }
            },
            { $unwind: "$content" },
            {
                $project: {
                    _id: 0,
                    contentId: "$_id",
                    watchCount: 1,
                    "content._id": 1,
                    "content.title": 1,
                    "content.type": 1,
                    "content.posterUrl": 1,
                    "content.genres": 1,
                    "content.releaseYear": 1
                }
            }
        ]);
        return result;
    } catch (error) {
        console.error("Error aggregating popular contents:", error);
        return [];
    }
};

export const getCompletedContentIds = async (profileId) => {
    const records = await WatchHistory.find(
        { profileId, isCompleted: true },
        "contentId"
    ).lean();

    return records.map((r) => r.contentId.toString());
};
