import * as contentRepo from "../repositories/contentRepository.js";

import {
    buildMovieData,
    buildSeriesData,
    buildSeasonData,
    buildEpisodeData,
    buildCollectionData
} from "../services/contentBuilder.js";

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


export { createContent };