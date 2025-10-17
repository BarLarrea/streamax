import * as contentRepo from "../repositories/contentRepository.js";
import { filterAllowedFieldsByType } from "../services/contentFilter.js";
import { buildContentByType } from "../services/contentBuilder.js";
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

        const contentData = buildContentByType(filteredBody);

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

// Get all contents with dynamic filters + pagination
const getAllContents = async (req, res) => {
    try {
        const { type, genres, releaseYear, actors, directors, limit, page } =
            req.query;

        // --- Dynamic Filters ---
        const filters = {};

        if (type) filters.type = type;
        if (genres)
            filters.genres = {
                $in: genres.split(",").map((g) => g.toLowerCase().trim())
            };
        if (releaseYear) filters.releaseYear = Number(releaseYear);
        if (actors)
            filters.actors = {
                $in: actors.split(",").map((a) => a.trim())
            };
        if (directors)
            filters.directors = {
                $in: directors.split(",").map((d) => d.trim())
            };

        // --- Pagination ---
        const pageNum = Number(page) || 1;
        const limitNum = Number(limit) || 20;
        const skip = (pageNum - 1) * limitNum;

        // --- Query ---
        const { contents, totalDocuments } = await contentRepo.getAllContents(
            filters,
            skip,
            limitNum
        );

        if (totalDocuments === 0) {
            return res.status(404).json({
                message: "No contents found matching your filters",
                filters
            });
        }

        // --- Response ---
        return res.status(200).json({
            success: true,
            filters,
            page: pageNum,
            limit: limitNum,
            totalDocuments,
            totalPages: Math.ceil(totalDocuments / limitNum),
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

// Search contents by title, description, actors, directors, genres
const searchContents = async (req, res) => {
    try {
        let query = req.query.q;
        if (!query || !query.trim()) {
            return res.status(400).json({
                message: "Search query cannot be empty or just spaces"
            });
        }

        // --- Query ---
        query = query.trim().replace(/\s+/g, " "); // Normalize spaces in the middle of the query word

        // --- Pagination ---
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 20;
        const skip = (page - 1) * limit;

        // --- Search ---
        const { contents, totalDocuments } = await contentRepo.searchContents(
            query,
            limit,
            skip
        );

        if (totalDocuments === 0) {
            return res
                .status(404)
                .json({ message: "No contents found matching your query" });
        }

        // --- Response ---
        return res.status(200).json({
            success: true,
            query,
            page,
            limit,
            totalDocuments,
            totalPages: Math.ceil(totalDocuments / limit),
            contents: contents.map(formatContentByType)
        });
    } catch (error) {
        console.error("Error searching contents:", error);
        return res.status(500).json({ message: "Server error" });
    }
};

// ==================== HIERARCHY ACTIONS ====================
// (Series -> Seasons -> Episodes)

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
