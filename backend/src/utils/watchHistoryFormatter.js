const watchHistoryFormater = (watchHistoryRecord) => {
    return {
        watchHistoryId: watchHistoryRecord._id.toString(),
        profileId: watchHistoryRecord.profileId.toString(),
        contentId: watchHistoryRecord.contentId.toString(),
        progress: watchHistoryRecord.progress,
        isCompleted: watchHistoryRecord.isCompleted,
        createdAt: watchHistoryRecord.createdAt,
        updatedAt: watchHistoryRecord.updatedAt
    };
};

export default watchHistoryFormater;
