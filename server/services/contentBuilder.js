export const buildMovieData = (body) => {
    const {
        title,
        description,
        genres,
        duration,
        videoUrl,
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

    const contentData = {
        type: "movie",
        title,
        description,
        genres,
        duration,
        videoUrl,
        releaseYear,
        posterUrl,
        collectionId
    };

    return { valid: true, data: contentData };
};

export const buildSeriesData = (body) => {
    const { title, description, genres, releaseYear, posterUrl } = body;

    if (!title || !description || !genres?.length || !releaseYear) {
        return {
            valid: false,
            error: "Series must include title, description, genres, and releaseYear"
        };
    }

    const contentData = {
        type: "series",
        title,
        description,
        genres,
        releaseYear,
        posterUrl
    };

    return { valid: true, data: contentData };
};

export const buildSeasonData = (body) => {
    const { title, seriesId, seasonNumber, releaseYear } = body;

    if (!title || !seriesId || !seasonNumber || !releaseYear) {
        return {
            valid: false,
            error: "Season must include title, seriesId, seasonNumber, and releaseYear"
        };
    }

    const contentData = {
        type: "season",
        title,
        seriesId,
        seasonNumber,
        releaseYear
    };

    return { valid: true, data: contentData };
};

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
