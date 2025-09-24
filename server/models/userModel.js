import mongoose from "mongoose";
import { type } from "os";

// Sub-schema for refresh tokens (each represents one active session)
const refreshTokenSchema = new mongoose.Schema(
    {
        token: {
            type: String,
            required: true
        },
        jti: {
            type: String,
            required: true
        }, // Unique identifier for the session (Session ID)
        createdAt: {
            type: Date,
            default: Date.now
        }, // When the session was created
        lastUsed: {
            type: Date,
            default: Date.now
        } // Last time the refresh token was used
    },
    { _id: false }
);

const userSchema = new mongoose.Schema(
    {
        userName: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        password: {
            type: String,
            required: true
        },
        isAdmin: {
            type: Boolean,
            default: false,
            required: true
        },
        isActive: {
            type: Boolean,
            default: true
        },
        profiles: {
            type: [
                {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Profile"
                }
            ],
            validate: {
                validator: function (arr) {
                    return arr.length <= 5;
                },
                message: "A user can have at most 5 profiles"
            }
        },
        refreshTokens: {
            type: [refreshTokenSchema],
            validate: {
                validator: function (arr) {
                    return arr.length <= 5;
                },
                message:
                    "A user can be logged in on a maximum of 5 devices simultaneously"
            }
        }
    },
    { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;
