// Remove sessions older than 7 days
export const removeExpiredSessions = (userSessions) => {
    const now = Date.now();
    const weekMs = 7 * 24 * 60 * 60 * 1000;

    const beforeCount = userSessions.length;
    const filteredSessions = userSessions.filter(
        (s) => new Date(s.createdAt).getTime() > now - weekMs
    );

    const removedCount = beforeCount - filteredSessions.length;
    if (removedCount > 0) {
        console.log(`Removed ${removedCount} expired sessions for user`);
    }

    return filteredSessions;
};

// Remove the oldest session if user has >= maxSessions
export const removeOldestSessionIfNeeded = (userSessions, maxSessions = 5) => {
    if (!userSessions || userSessions.length < maxSessions) {
        return userSessions;
    }

    const sortedSessions = [...userSessions].sort(
        (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
    );

    const removed = sortedSessions.shift();
    console.log(
        `Removed oldest session (createdAt: ${removed.createdAt}) to enforce max sessions`
    );

    return sortedSessions;
};
