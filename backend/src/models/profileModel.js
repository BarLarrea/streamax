import mongoose from "mongoose";

const profileSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        profileName: {
            type: String,
            required: true
        },
        avatar: {
            type: String,
            default: "default.png" //only relative path, the avatars will be stored in thr punlic dir in the frontend
        },
        likedContent: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Content"
            }
        ],
        lastWatched: {
            type: [
                {
                    contentId: {
                        type: mongoose.Schema.Types.ObjectId,
                        ref: "Content",
                        required: true
                    },

                    duration: {
                        type: Number,
                        required: true
                    },

                    progress: { type: Number, default: 0 }, // seconds

                    updatedAt: {
                        type: Date,
                        default: Date.now
                    }
                }
            ], // a small "cache" to quickly fetch a few last watched

            validate: {
                validator: function (arr) {
                    return arr.length <= 10;
                },
                message: "You can store up to 10 last watched items only"
            }
        }
    },

    { timestamps: true }
);

profileSchema.index({ userId: 1, profileName: 1 }, { unique: true }); // Ensure unique profile names per user

const Profile = mongoose.model("Profile", profileSchema);
export default Profile;
