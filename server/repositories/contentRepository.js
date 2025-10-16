import mongoose from "mongoose";
import Content from "../models/contentModel.js";

// ==================== CREATE / UPDATE / DELETE ====================

export const createContent = async (data) => {
    return await Content.create(data);
};

export const saveContent = async (content) => {
    return await content.save();
};

export const updateContent = async (id, data) => {
    return await Content.findByIdAndUpdate(
        id,
        data,
        { new: true },
        { runValidators: true } // Ensure data adheres to schema
    );
};

export const deleteContent = async (id) => {
    return await Content.findByIdAndDelete(id);
};

// ==================== READ / QUERY / SEARCH ====================

export const getContentById = async (contentId) => {
    if (!mongoose.Types.ObjectId.isValid(contentId)) {
        return { status: "invalid_id", data: null };
    }

    const content = await Content.findById(contentId)
        .populate({
            path: "collectionId",
            select: "title _id"
        })
        .populate({
            path: "seriesId",
            select: "title posterUrl releaseYear"
        })
        .populate({
            path: "seasonId",
            select: "title seasonNumber"
        })
        .lean();

    if (!content) {
        return { status: "not_found", data: null };
    }

    return { status: "ok", data: content };
};

export const getAllContents = async (filters = {}, options = {}) => {
    try {
        const query = Content.find(filters); // built the query object

        // Apply options (sort, limit, skip, select)
        if (options.sort) query.sort(options.sort);
        if (options.limit) query.limit(options.limit);
        if (options.skip) query.skip(options.skip);
        if (options.select) query.select(options.select);

        const results = await query.exec(); // do the actual query
        return results;
    } catch (error) {
        console.error("Error fetching contents:", error);
        throw error;
    }
};

// export const searchContents = async (query) => {
//     const regex = new RegExp(query, "i");
//     return await Content.find({
//         $or: [{ title: regex }, { description: regex }, { genres: regex }]
//     });
// };

// ==================== HIERARCHY ====================

export const getSeasonsBySeriesId = async (seriesId) => {
    if (!mongoose.Types.ObjectId.isValid(seriesId)) {
        return { status: "invalid_id", data: null };
    }

    const seasons = await Content.find({ seriesId, type: "season" })
        .sort({ seasonNumber: 1 })
        .lean();

    if (!seasons || seasons.length === 0) {
        return { status: "not_found", data: [] };
    }

    return { status: "ok", data: seasons };
};

export const getEpisodesBySeasonId = async (seasonId) => {
    if (!mongoose.Types.ObjectId.isValid(seasonId)) {
        return { status: "invalid_id", data: null };
    }

    const episodes = await Content.find({ seasonId, type: "episode" })
        .sort({ episodeNumber: 1 })
        .lean();

    if (!episodes || episodes.length === 0) {
        return { status: "not_found", data: [] };
    }

    return { status: "ok", data: episodes };
};
