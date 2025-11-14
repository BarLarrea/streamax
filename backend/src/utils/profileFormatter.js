export function formatProfile(profile) {
    return {
        profileId: profile._id,
        profileName: profile.profileName,
        avatar: profile.avatar,
        likedContent: profile.likedContent,
        lastWatched: profile.lastWatched?.map((item) => ({
            contentId: item.contentId,
            duration: item.duration,
            progress: item.progress,
            updatedAt: item.updatedAt
        }))
    };
}

export function formatProfileFull(profile) {
    return {
        profileId: profile._id,
        profileName: profile.profileName,
        avatar: profile.avatar,
        likedContent: profile.likedContent,
        lastWatched: profile.lastWatched?.map((item) => ({
            contentId: item.contentId,
            progress: item.progress,
            updatedAt: item.updatedAt
        })),
        createdAt: profile.createdAt,
        updatedAt: profile.updatedAt
    };
}
