import mongoose from "mongoose";

const watchHistorySchema = new mongoose.Schema(
    {
        profileId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Profile",
            required: true
        },

        contentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Content",
            required: true
        },

        type: {
            type: String,
            enum: ["movie", "episode"],
            required: true
        },

        duration: {
            type: Number,
            required: true
        }, // helps to avoid approaching the db to get content duration each time

        progress: { type: Number, default: 0 }, // seconds

        isCompleted: { type: Boolean, default: false },

        isArchived: { type: Boolean, default: false }, // when profile is deleted but we want to keep data for analytics

        archivedAt: { type: Date, default: null }
    },
    { timestamps: true }
);

// Indexes:
// Fast queries per profile (get full watch history for one profile)
watchHistorySchema.index({ profileId: 1 });

// Fast queries per content (how many profiles watched this movie/episode)
watchHistorySchema.index({ contentId: 1 });

//Ensure only ONE record per profile per episode (no duplicates)
watchHistorySchema.index({ profileId: 1, contentId: 1 }, { unique: true });

const WatchHistory = mongoose.model("WatchHistory", watchHistorySchema);

export default WatchHistory;
