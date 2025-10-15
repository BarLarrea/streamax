const allowedFieldsByType = {
    movie: [
        "title",
        "description",
        "genres",
        "duration",
        "videoUrl",
        "releaseYear",
        "posterUrl",
        "collectionId"
    ],
    series: ["title", "description", "genres", "releaseYear", "posterUrl"],
    season: ["title", "seriesId", "seasonNumber", "releaseYear"],
    episode: [
        "title",
        "seriesId",
        "seasonId",
        "episodeNumber",
        "duration",
        "videoUrl",
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
