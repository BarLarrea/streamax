import mongoose from "mongoose";

const contentSchema = new mongoose.Schema(
    {
        type: {
            type: String,
            enum: ["movie", "series", "season", "episode", "collection"],
            required: true
        },
        title: { type: String, required: true },

        // General metadata
        description: String,
        releaseYear: Number,
        genres: [String],
        posterUrl: { type: String, default: "defaultPoster.png" },
        duration: Number,
        videoUrl: String,

        // Hierarchy references
        seriesId: { type: mongoose.Schema.Types.ObjectId, ref: "Content" },
        seasonId: { type: mongoose.Schema.Types.ObjectId, ref: "Content" },
        seasonNumber: Number,
        episodeNumber: Number,

        // Franchise / Collection
        franchiseId: { type: mongoose.Schema.Types.ObjectId, ref: "Content" },
        partNumber: Number
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
    { franchiseId: 1, partNumber: 1 },
    { unique: true, partialFilterExpression: { type: "movie" } }
);

const Content = mongoose.model("Content", contentSchema);
export default Content;
