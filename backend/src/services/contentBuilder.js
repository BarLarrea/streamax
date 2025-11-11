import mongoose from "mongoose";

// ----- MOVIE -----
export const buildMovieData = (body) => {
    const {
        title,
        alternativeTitles,
        description,
        genres,
        duration,
        videoUrl,
        trailerUrl,
        releaseYear,
        posterUrl,
        collectionId
    } = body;

    if (
        !title ||
        !duration ||
        !videoUrl ||
        !description ||
        !genres?.length ||
        !releaseYear
    ) {
        return {
            valid: false,
            error: "Movie must include duration, videoUrl, description, genres, and releaseYear"
        };
    }

    // Defensive fix for invalid or empty ObjectId
    const validCollectionId =
        collectionId && mongoose.isValidObjectId(collectionId)
            ? collectionId
            : undefined;

    const contentData = {
        type: "movie",
        title,
        alternativeTitles: alternativeTitles || [],
        description,
        genres: genres.map((g) => g.toLowerCase()),
        duration,
        videoUrl,
        trailerUrl,
        releaseYear,
        posterUrl,
        collectionId: validCollectionId
    };

    return { valid: true, data: contentData };
};

// ----- SERIES -----
export const buildSeriesData = (body) => {
    const {
        title,
        alternativeTitles,
        description,
        genres,
        releaseYear,
        trailerUrl,
        posterUrl
    } = body;

    if (!title || !description || !genres?.length || !releaseYear) {
        return {
            valid: false,
            error: "Series must include title, description, genres, and releaseYear"
        };
    }

    const contentData = {
        type: "series",
        title,
        alternativeTitles: alternativeTitles || [],
        description,
        genres: genres.map((g) => g.toLowerCase()),
        releaseYear,
        trailerUrl,
        posterUrl
    };

    return { valid: true, data: contentData };
};

// ----- SEASON -----
export const buildSeasonData = (body) => {
    const { title, seriesId, seasonNumber, releaseYear, trailerUrl } = body;

    if (!title || !seriesId || !seasonNumber || !releaseYear) {
        return {
            valid: false,
            error: "Season must include title, seriesId, seasonNumber, and releaseYear"
        };
    }

    if (!mongoose.isValidObjectId(seriesId)) {
        return {
            valid: false,
            error: "Invalid seriesId format — must be a valid ObjectId"
        };
    }

    const contentData = {
        type: "season",
        title,
        seriesId,
        seasonNumber,
        releaseYear,
        trailerUrl
    };

    return { valid: true, data: contentData };
};

// ----- EPISODE -----
export const buildEpisodeData = (body) => {
    const {
        title,
        seriesId,
        seasonId,
        episodeNumber,
        duration,
        videoUrl,
        description,
        posterUrl
    } = body;

    if (
        !title ||
        !seriesId ||
        !seasonId ||
        !episodeNumber ||
        !duration ||
        !videoUrl
    ) {
        return {
            valid: false,
            error: "Episode must include title, seriesId, seasonId, episodeNumber, duration, and videoUrl"
        };
    }

    if (!mongoose.isValidObjectId(seriesId)) {
        return { valid: false, error: "Invalid seriesId format" };
    }
    if (!mongoose.isValidObjectId(seasonId)) {
        return { valid: false, error: "Invalid seasonId format" };
    }

    const contentData = {
        type: "episode",
        title,
        seriesId,
        seasonId,
        episodeNumber,
        duration,
        videoUrl,
        description,
        posterUrl
    };

    return { valid: true, data: contentData };
};

// ----- COLLECTION -----
export const buildCollectionData = (body) => {
    const { title } = body;

    if (!title) {
        return { valid: false, error: "Title is required for collection" };
    }

    const contentData = {
        type: "collection",
        title
    };

    return { valid: true, data: contentData };
};

// ----- MASTER FUNCTION -----
export const buildContentByType = (body) => {
    if (!body.type) return null;

    switch (body.type) {
        case "movie":
            return buildMovieData(body);
        case "series":
            return buildSeriesData(body);
        case "season":
            return buildSeasonData(body);
        case "episode":
            return buildEpisodeData(body);
        case "collection":
            return buildCollectionData(body);
    }
};
