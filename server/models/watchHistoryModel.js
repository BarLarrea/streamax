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
        episodeId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Episode" // relevant only if content is a series
        },
        watchedAt: {
            type: Date,
            default: Date.now
        },
        progress: {
            type: Number, // seconds
            default: 0
        }
    },
    { timestamps: true }
);

// Indexes:
// Fast queries per profile (get full watch history for one profile)
watchHistorySchema.index({ profileId: 1 });

// Fast queries per content (how many profiles watched this movie/episode)
watchHistorySchema.index({ contentId: 1 });

//Ensure only ONE record per profile per episode (no duplicates)
watchHistorySchema.index({ profileId: 1, episodeId: 1 }, { unique: true });

const WatchHistory = mongoose.model("WatchHistory", watchHistorySchema);
export default WatchHistory;
