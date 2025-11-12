const allowedFieldsByType = {
    movie: [
        "title",
        "alternativeTitles",
        "description",
        "genres",
        "duration",
        "videoUrl",
        "trailerUrl",
        "releaseYear",
        "posterUrl",
        "collectionId",
        "directors",
        "actors",
        "language",
        "rating"
    ],
    series: [
        "title",
        "alternativeTitles",
        "description",
        "genres",
        "releaseYear",
        "posterUrl",
        "trailerUrl",
        "directors",
        "actors",
        "language",
        "rating"
    ],
    season: ["title", "seriesId", "seasonNumber", "releaseYear", "trailerUrl"],
    episode: [
        "title",
        "seriesId",
        "seasonId",
        "episodeNumber",
        "duration",
        "videoUrl",
        "trailerUrl",
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

    filtered.type = type;

    return filtered;
};
