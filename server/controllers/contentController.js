import * as contentRepo from "../repositories/contentRepository.js";

export const createContent = async (req, res) => {
    try {
        const { type, title } = req.body;
        if (!type || !title) {
            return res
                .status(400)
                .json({ message: "Type and title are required" });
        }

        let contentData;

        if (type === "movie") {
            const {
                description,
                genres,
                duration,
                videoUrl,
                releaseYear,
                posterUrl,
                collectionId
            } = req.body;

            if (
                !duration ||
                !videoUrl ||
                !description ||
                !genres?.length ||
                !releaseYear
            ) {
                return res.status(400).json({
                    message:
                        "Movie must include duration, videoUrl, description, genres, and releaseYear"
                });
            }

            contentData = {
                type,
                title,
                description,
                genres,
                duration,
                videoUrl,
                releaseYear,
                posterUrl,
                collectionId
            };
        } else if (type === "series") {
            const { description, genres, releaseYear, posterUrl } = req.body;

            if (!description || !genres?.length || !releaseYear) {
                return res.status(400).json({
                    message:
                        "Series must include description, genres, and releaseYear"
                });
            }

            contentData = {
                type,
                title,
                description,
                genres,
                releaseYear,
                posterUrl
            };
        } else if (type === "season") {
            const { seriesId, seasonNumber, releaseYear } = req.body;

            if (!seriesId || !seasonNumber || !releaseYear) {
                return res.status(400).json({
                    message:
                        "Season must include seriesId, seasonNumber, and releaseYear"
                });
            }

            contentData = {
                type,
                title,
                seriesId,
                seasonNumber,
                releaseYear
            };
        } else if (type === "episode") {
            const {
                seriesId,
                seasonId,
                episodeNumber,
                duration,
                videoUrl,
                description,
                posterUrl
            } = req.body;

            if (
                !seriesId ||
                !seasonId ||
                !episodeNumber ||
                !duration ||
                !videoUrl
            ) {
                return res.status(400).json({
                    message:
                        "Episode must include seriesId, seasonId, episodeNumber, duration, and videoUrl"
                });
            }

            contentData = {
                type,
                title,
                seriesId,
                seasonId,
                episodeNumber,
                duration,
                videoUrl,
                description,
                posterUrl
            };
        } else if (type === "collection") {
            contentData = {
                type,
                title
            };
        } else {
            return res.status(400).json({ message: "Invalid content type" });
        }

        const newContent = await contentRepo.createContent(contentData);

        return res.status(201).json({
            message: `Content of type '${type}' created successfully!`,
            content: newContent
        });
    } catch (error) {
        console.error("Error creating content:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
