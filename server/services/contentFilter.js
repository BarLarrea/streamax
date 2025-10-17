const allowedFieldsByType = {
    movie: [
        "title",
        "alternativeTitles",
        "description",
        "genres",
        "duration",
        "videoUrl",
        "trilerUrl",
        "releaseYear",
        "posterUrl",
        "collectionId"
    ],
    series: [
        "title",
        "alternativeTitles",
        "description",
        "genres",
        "releaseYear",
        "posterUrl",
        "trilerUrl"
    ],
    season: ["title", "seriesId", "seasonNumber", "releaseYear", "trilerUrl"],
    episode: [
        "title",
        "seriesId",
        "seasonId",
        "episodeNumber",
        "duration",
        "videoUrl",
        "trilerUrl",
        "description",
        "posterUrl"
    ],
    collection: ["title"]
};

export const filterAllowedFieldsByType = (type, body) => {
    const allowedFields = allowedFieldsByType[type];
    if (!allowedFields) return null;

    const filtered = allowedFields.reduce((current, field) => {
        if (body[field] !== undefined) current[field] = body[field];
        return current;
    }, {});

    return filtered;
};
