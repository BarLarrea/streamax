import mongoose from "mongoose";

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
        }
    },
    { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;
