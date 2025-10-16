import mongoose from "mongoose";

const contentSchema = new mongoose.Schema(
    {
        type: {
            type: String,
            enum: ["movie", "series", "season", "episode", "collection"],
            required: true
        },
        title: { type: String, required: true },

        // General metadata (movies and series)
        description: String,
        releaseYear: { type: Number, min: 1900, max: new Date().getFullYear() },
        genres: [String],
        posterUrl: { type: String, default: "defaultPoster.png" },

        // Movie and Episode
        duration: Number,
        videoUrl: String,

        // Hierarchy references (series => season => episodes)
        seriesId: { type: mongoose.Schema.Types.ObjectId, ref: "Content" },
        seasonId: { type: mongoose.Schema.Types.ObjectId, ref: "Content" },
        seasonNumber: { type: Number, min: 1, max: 100 },
        episodeNumber: { type: Number, min: 1, max: 200 },

        // Collection references (e.g., Marvel Cinematic Universe)
        collectionId: { type: mongoose.Schema.Types.ObjectId, ref: "Content" },
        collectionName: String
    },
    { timestamps: true }
);

// Indexes: //

// Ensure unique season number inside the same series
contentSchema.index(
    { seriesId: 1, seasonNumber: 1 },
    { unique: true, partialFilterExpression: { type: "season" } }
);

// Ensure unique episode number inside the same season
contentSchema.index(
    { seasonId: 1, episodeNumber: 1 },
    { unique: true, partialFilterExpression: { type: "episode" } }
);

// Ensure unique movie part number inside the same franchise
contentSchema.index(
    { collectionId: 1 },
    { unique: true, partialFilterExpression: { $in: ["movie", "series"] } }
);

const Content = mongoose.model("Content", contentSchema);
export default Content;
