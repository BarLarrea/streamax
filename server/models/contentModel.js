import mongoose from "mongoose";

const contentSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true
        },
        type: {
            type: String,
            enum: ["movie", "series"],
            required: true
        },
        genres: [
            {
                type: String,
                required: true
            }
        ], // in case there is more than a single genre
        posterUrl: String,
        description: String,
        releaseYear: Number,
        videoUrl: String, // for movies only
        availableSeasons: {
            type: Number,
            default: 0
        },
        availableEpisodes: {
            type: Number,
            default: 0
        },
        notes: String
    },
    { timestamps: true }
);

const Content = mongoose.model("Content", contentSchema);
export default Content;
