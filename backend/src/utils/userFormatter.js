export function formatUser(user) {
    return {
        userId: user._id,
        userName: user.userName,
        email: user.email,
        profiles:
            user.profiles?.map((profile) => ({
                profileId: profile._id,
                profileName: profile.profileName,
                avatar: profile.avatar
            })) || []
    };
}
