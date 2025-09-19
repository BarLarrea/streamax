import mongoose from "mongoose";

const episodeScema = new mongoose.Schema(
    {
        contentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Content",
            required: true
        },
        season: {
            type: Number,
            required: true
        },
        episodeNumber: {
            type: Number,
            required: true
        },
        title: {
            type: String,
            required: true
        },
        description: {
            type: String
        },
        videoUrl: {
            type: String
        },
        duration: {
            type: Number
        },
        notes: String
    },
    { timestamps: true }
);

const Episode = mongoose.model("Episode", episodeScema);
export default Episode;
