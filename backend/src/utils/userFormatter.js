import { formatProfile } from "./profileFormatter.js";

export function formatUser(user) {
    return {
        userId: user._id,
        userName: user.userName,
        email: user.email,
        isAdmin: user.isAdmin,
        profiles: user.profiles?.map((profile) => formatProfile(profile)) || []
    };
}
