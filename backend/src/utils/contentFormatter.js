// ----- MOVIE -----
export const formattedMovie = (movie) => ({
    type: movie.type,
    id: movie._id,
    title: movie.title,
    alternativeTitles: movie.alternativeTitles,
    description: movie.description,
    releaseYear: movie.releaseYear,
    genres: movie.genres,
    duration: movie.duration,
    videoUrl: movie.videoUrl,
    posterUrl: movie.posterUrl,
    createdAt: movie.createdAt,
    updatedAt: movie.updatedAt,
    language: movie.language,
    rating: movie.rating,
    collection: movie.collectionId
        ? {
              collectionId: movie.collectionId?._id || movie.collectionId,
              collectionName:
                  movie.collectionName || movie.collectionId?.title || null
          }
        : null
});

// ----- SERIES -----
export const formattedSeries = (series) => ({
    type: series.type,
    id: series._id,
    title: series.title,
    alternativeTitles: series.alternativeTitles,
    description: series.description,
    releaseYear: series.releaseYear,
    genres: series.genres,
    posterUrl: series.posterUrl,
    createdAt: series.createdAt,
    updatedAt: series.updatedAt,
    language: series.language,
    rating: series.rating,
    collection: series.collectionId
        ? {
              collectionId: series.collectionId?._id || series.collectionId,
              collectionName:
                  series.collectionName || series.collectionId?.title || null
          }
        : null
});

// ----- SEASON -----
export const formattedSeason = (season) => ({
    type: season.type,
    id: season._id,
    title: season.title,
    seasonNumber: season.seasonNumber,
    description: season.description,
    releaseYear: season.releaseYear,
    posterUrl: season.posterUrl,
    createdAt: season.createdAt,
    updatedAt: season.updatedAt,
    series: season.seriesId
        ? {
              seriesId: season.seriesId?._id || season.seriesId,
              seriesTitle: season.seriesId?.title || null
          }
        : null
});

// ----- EPISODE -----
export const formattedEpisode = (episode) => ({
    type: episode.type,
    id: episode._id,
    title: episode.title,
    episodeNumber: episode.episodeNumber,
    description: episode.description,
    duration: episode.duration,
    videoUrl: episode.videoUrl,
    posterUrl: episode.posterUrl,
    createdAt: episode.createdAt,
    updatedAt: episode.updatedAt,
    season: episode.seasonId
        ? {
              seasonId: episode.seasonId?._id || episode.seasonId,
              seasonTitle: episode.seasonId?.title || null
          }
        : null,
    series: episode.seriesId
        ? {
              seriesId: episode.seriesId?._id || episode.seriesId,
              seriesTitle: episode.seriesId?.title || null
          }
        : null
});

// ----- COLLECTION -----
export const formattedCollection = (collection) => ({
    type: collection.type,
    id: collection._id,
    title: collection.title,
    description: collection.description,
    releaseYear: collection.releaseYear,
    genres: collection.genres || [],
    posterUrl: collection.posterUrl,
    createdAt: collection.createdAt,
    updatedAt: collection.updatedAt
});

// ----- MASTER FUNCTION -----
export const formatContentByType = (content) => {
    if (!content || !content.type) return null;

    switch (content.type) {
        case "movie":
            return formattedMovie(content);
        case "series":
            return formattedSeries(content);
        case "season":
            return formattedSeason(content);
        case "episode":
            return formattedEpisode(content);
        case "collection":
            return formattedCollection(content);
        default:
            return content;
    }
};
