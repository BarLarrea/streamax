import Content from "../models/contentModel.js";
import { isValidId } from "../utils/dalUtils.js";

// ==================== CREATE / UPDATE / DELETE ====================

export const createContent = async (data) => {
    return await Content.create(data);
};

export const saveContent = async (content) => {
    return await content.save();
};

export const updateContent = async (id, data) => {
    return await Content.findByIdAndUpdate(id, data, { new: true });
};

export const deleteContent = async (id) => {
    return await Content.findByIdAndDelete(id);
};

// ==================== READ / QUERY / SEARCH ====================

export const getContentById = async (contentId) => {
    if (!isValidId(contentId)) {
        return { status: "invalid_id", data: null };
    }

    const content = await Content.findById(contentId)
        .populate({
            path: "collectionId",
            select: "_id title"
        })
        .populate({
            path: "seriesId",
            select: "_id title posterUrl releaseYear"
        })
        .populate({
            path: "seasonId",
            select: "_id title seasonNumber"
        })
        .lean();

    if (!content) {
        return { status: "not_found", data: null };
    }

    return { status: "ok", data: content };
};

export const getAllContents = async (
    filters = {},
    skip = 0,
    limit = 20,
    sort = { releaseYear: -1 } // default sort
) => {
    try {
        const [contents, totalDocuments] = await Promise.all([
            Content.find(filters).sort(sort).skip(skip).limit(limit).lean(),
            Content.countDocuments(filters)
        ]);

        return { contents, totalDocuments };
    } catch (error) {
        console.error("Error fetching contents:", error);
        throw error;
    }
};

export const searchContents = async (query, limit, skip) => {
    const regex = new RegExp(query, "i"); // case-insensitive search

    const filter = {
        $or: [
            { title: regex },
            { alternativeTitles: regex },
            { genres: regex },
            { actors: regex },
            { directors: regex }
        ]
    };

    const [contents, totalDocuments] = await Promise.all([
        Content.find(filter)
            .skip(skip)
            .limit(limit)
            .sort({ releaseYear: -1 }) // Newest first
            .lean(),
        Content.countDocuments(filter)
    ]);

    return { contents, totalDocuments };
};

export const getContentsByGenreAdvanced = async (
    genre,
    filters = {},
    skip = 0,
    limit = 20,
    sort = { createdAt: -1 }
) => {
    const query = {
        genres: { $in: [genre.toLowerCase()] },
        ...filters
    };

    const [contents, totalDocuments] = await Promise.all([
        Content.find(query).sort(sort).skip(skip).limit(limit).lean(),
        Content.countDocuments(query)
    ]);

    return { contents, totalDocuments };
};

export const countContents = async (filter) => {
    return await Content.countDocuments(filter);
};

export const getContents = async (filter, skip, limit, sort) => {
    return await Content.find(filter).sort(sort).skip(skip).limit(limit).lean();
};

// ==================== HIERARCHY ====================

export const getSeasonsBySeriesId = async (seriesId) => {
    if (!isValidId(seriesId)) {
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
    if (!isValidId(seasonId)) {
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
