import * as contentRepo from "../repositories/contentRepository.js";
import { filterAllowedFieldsByType } from "../services/contentFilter.js";
import {
    buildMovieData,
    buildSeriesData,
    buildSeasonData,
    buildEpisodeData,
    buildCollectionData
} from "../services/contentBuilder.js";

// ----- ADMIN -----
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

// ----- GENERAL -----
const getAllContents = async (req, res) => {};
const getContentById = async (req, res) => {};
const searchContents = async (req, res) => {};
const getContentsByGenre = async (req, res) => {};

// ----- HIERARCHY -----
const getSeasonsBySeriesId = async (req, res) => {};
const getEpisodesBySeasonId = async (req, res) => {};

// ---- EXTERNAL ----
const importExternalMetadata = async (req, res) => {};
const refreshExternalRatings = async (req, res) => {};

export {
    createContent,
    updateContent,
    deleteContentById,
    getAllContents,
    getContentById,
    searchContents,
    getContentsByGenre,
    getSeasonsBySeriesId,
    getEpisodesBySeasonId,
    importExternalMetadata,
    refreshExternalRatings
};
