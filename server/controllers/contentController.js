import * as contentRepo from "../repositories/contentRepository.js";

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

        let contentData;

        switch (type) {
            case "movie":
                contentData = buildMovieData(req.body);
                break;

            case "series":
                contentData = buildSeriesData(req.body);
                break;

            case "season":
                contentData = buildSeasonData(req.body);
                break;

            case "episode":
                contentData = buildEpisodeData(req.body);
                break;

            case "collection":
                contentData = buildCollectionData(req.body);
                break;
            default:
                return res
                    .status(400)
                    .json({ message: "Invalid content type" });
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

export const updateContent = async (req, res) => {};

export const deleteContent = async (req, res) => {};

// ----- GENERAL -----
export const getAllContents = async (req, res) => {};
export const getContentById = async (req, res) => {};
export const searchContents = async (req, res) => {};
export const getContentsByGenre = async (req, res) => {};

// ----- HIERARCHY -----
export const getSeasonsBySeriesId = async (req, res) => {};
export const getEpisodesBySeasonId = async (req, res) => {};

// ----- RECOMMENDATIONS & POPULARITY -----
export const getRecommendedContents = async (req, res) => {};
export const getPopularContents = async (req, res) => {};
export const getRecentContents = async (req, res) => {};

// ----- EXTERNAL SERVICES / STATS -----
export const refreshExternalRatings = async (req, res) => {};
export const incrementViewCount = async (req, res) => {};

export { createContent };
