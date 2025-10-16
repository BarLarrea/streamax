import * as contentRepo from "../repositories/contentRepository.js";
import { filterAllowedFieldsByType } from "../services/contentFilter.js";
import {
    buildMovieData,
    buildSeriesData,
    buildSeasonData,
    buildEpisodeData,
    buildCollectionData
} from "../services/contentBuilder.js";

import { formatContentByType } from "../utils/contentFormatter.js";

// ==================== ADMIN ACTIONS ====================
const createContent = async (req, res) => {
    try {
        const { type } = req.body;
        if (!type) {
            return res.status(400).json({ message: "Type is required" });
        }

        // Filter body to only include allowed fields for the specified type
        const filteredBody = filterAllowedFieldsByType(type, req.body);
        if (!filteredBody) {
            return res.status(400).json({ message: "Invalid content type" });
        }

        // Normalize genres to lowercase
        if (filteredBody.genres) {
            filteredBody.genres = filteredBody.genres.map((g) =>
                g.toLowerCase()
            );
        }

        const contentData = {};

        switch (type) {
            case "movie":
                contentData = buildMovieData(filteredBody);
                break;

            case "series":
                contentData = buildSeriesData(filteredBody);
                break;

            case "season":
                contentData = buildSeasonData(filteredBody);
                break;

            case "episode":
                contentData = buildEpisodeData(filteredBody);
                break;

            case "collection":
                contentData = buildCollectionData(filteredBody);
                break;
        }

        if (!contentData.valid) {
            return res.status(400).json({ message: contentData.error });
        }

        const newContent = await contentRepo.createContent(contentData.data);

        return res.status(201).json({
            message: `Content of type '${type}' created successfully!`,
            content: newContent
        });
    } catch (error) {
        console.error("Error creating content:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

const updateContent = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ message: "Content ID is required" });
        }

        const existingContent = await contentRepo.getContentById(id);
        if (!existingContent) {
            return res.status(404).json({ message: "Content not found" });
        }

        // Filter body to only include allowed fields for the specified type
        const filteredBody = filterAllowedFieldsByType(
            existingContent.type,
            req.body
        );
        if (!filteredBody) {
            return res.status(400).json({ message: "Invalid content type" });
        }

        if (filteredBody.type && filteredBody.type !== existingContent.type) {
            return res
                .status(400)
                .json({ message: "Content type cannot be changed" });
        }

        if (filteredBody.genres) {
            filteredBody.genres = filteredBody.genres.map((g) =>
                g.toLowerCase()
            );
        }

        const updatedContent = await contentRepo.updateContent(id, {
            ...existingContent.toObject(),
            ...filteredBody
        });

        return res.status(200).json({
            message: "Content updated successfully",
            content: updatedContent
        });
    } catch (error) {
        console.error("Error updating content:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

const deleteContentById = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ message: "Content ID is required" });
        }

        const deletedContent = await contentRepo.deleteContent(id);

        if (!deletedContent) {
            return res.status(404).json({ message: "Content not found" });
        }

        console.log(
            "Deleted content:",
            deletedContent.type,
            deletedContent.title,
            "by admin:",
            req.user.id,
            "at",
            new Date().toISOString()
        );

        return res.status(200).json({
            message: "Content deleted successfully",
            deletedContent
        });
    } catch (error) {
        console.error("Error deleting content:", error);
        return res.status(500).json({
            message: "Server error — failed to delete content",
            error: error.message
        });
    }
};

// ==================== PUBLIC READ ACTIONS ====================
// (Endpoints accessible to all users)

// Get all contents with optional filters, pagination + sorting
const getAllContents = async (req, res) => {
    try {
        const { type, genres, releaseYear, sort, limit, page } = req.query;

        // --- Filters ---
        const filters = {
            ...(type ? { type } : {}),
            ...(genres
                ? {
                      genres: {
                          $in: genres
                              .split(",")
                              .map((g) => g.toLowerCase().trim())
                      }
                  }
                : {}),
            ...(releaseYear ? { releaseYear: Number(releaseYear) } : {})
        };

        // --- Pagination + Sorting ---
        const options = {
            sort: sort ? { [sort]: -1 } : { createdAt: -1 },
            limit: limit ? Number(limit) : 20,
            skip: page ? (Number(page) - 1) * (limit ? Number(limit) : 20) : 0
        };

        // --- Query ---
        const contents = await contentRepo.getAllContents(filters, options);

        if (!contents || contents.length === 0) {
            return res.status(404).json({
                message: "No contents found matching your filters",
                filters
            });
        }

        // --- Response ---
        return res.status(200).json({
            success: true,
            count: contents.length,
            page: page ? Number(page) : 1,
            filters,
            sort: options.sort,
            contents: contents.map(formatContentByType)
        });
    } catch (error) {
        console.error("Error fetching contents:", error);
        return res.status(500).json({ message: "Server error" });
    }
};

const getContentById = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ message: "Content ID is required" });
        }

        const result = await contentRepo.getContentById(id);

        if (result.status === "invalid_id") {
            return res.status(404).json({ message: "Invalid content ID" });
        }

        if (result.status === "not_found") {
            return res.status(404).json({ message: "Content not found" });
        }

        return res
            .status(200)
            .json({ content: formatContentByType(result.data) });
    } catch (error) {
        console.error("Error fetching content by ID:", error);
        return res.status(500).json({ message: "Server error" });
    }
};

const searchContents = async (req, res) => {};

// ==================== HIERARCHY ACTIONS ====================
// (Series → Seasons → Episodes relations)

const getSeasonsBySeriesId = async (req, res) => {
    try {
        const { seriesId } = req.params;
        if (!seriesId) {
            return res.status(400).json({ message: "Series ID is required" });
        }

        const result = await contentRepo.getSeasonsBySeriesId(seriesId);

        if (result.status === "invalid_id") {
            return res.status(400).json({ message: "Invalid series ID" });
        }

        if (result.status === "not_found") {
            return res
                .status(404)
                .json({ message: "No seasons found for this series" });
        }

        // result.status === "ok"
        return res.status(200).json({
            success: true,
            seasonAmount: result.data.length,
            seriesId,
            seasons: result.data.map(formatContentByType)
        });
    } catch (error) {
        console.error("Error fetching seasons by series ID:", error);
        return res.status(500).json({ message: "Server error" });
    }
};

const getEpisodesBySeasonId = async (req, res) => {
    try {
        const { seasonId } = req.params;
        if (!seasonId) {
            return res.status(400).json({ message: "Season ID is required" });
        }

        const result = await contentRepo.getEpisodesBySeasonId(seasonId);

        if (result.status === "invalid_id") {
            return res.status(400).json({ message: "Invalid season ID" });
        }

        if (result.status === "not_found") {
            return res
                .status(404)
                .json({ message: "No episodes found for this season" });
        }

        // result.status === "ok"
        return res.status(200).json({
            success: true,
            episodeAmount: result.data.length,
            seasonId,
            episodes: result.data.map(formatContentByType)
        });
    } catch (error) {
        console.error("Error fetching episodes by season ID:", error);
        return res.status(500).json({ message: "Server error" });
    }
};

// ==================== EXTERNAL SOURCES ====================
// (Data import or external API integration)

const importExternalMetadata = async (req, res) => {};
const refreshExternalRatings = async (req, res) => {};

export {
    createContent,
    updateContent,
    deleteContentById,
    getAllContents,
    getContentById,
    searchContents,
    getSeasonsBySeriesId,
    getEpisodesBySeasonId,
    importExternalMetadata,
    refreshExternalRatings
};
