import mongoose from "mongoose";
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

    if (!newRecord) {
        return { status: "error", data: null };
    }

    return { status: "success", data: newRecord.toObject() };
};

// Archive watch history when profile is deleted and keep the data for analytics
export const archiveWatchHistoryByProfileId = async (profileId) => {
    if (!isValidId(profileId)) {
        return { status: "invalid_id", data: null };
    }

    const result = await WatchHistory.updateMany(
        { profileId },
        { isArchived: true }
    ).lean();

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
        return  { status: "invalid_id", data: null };
    }
    return await WatchHistory.findOneAndUpdate(
        { profileId, contentId },
        { progress },
        { new: true }
    ).lean();
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

    const result = await WatchHistory.find(
        { profileId },
        "contentId progress isCompleted"
    )
        .lean()
        .sort({ updatedAt: -1 });

    if (result.length === 0) {
        return { status: "not_found", data: [] };
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
        return { status: "not_found", data: [] };
    }

    return { status: "success", data: record };
};
