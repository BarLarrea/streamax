import { getContentByIdService } from "../../services/contentService.js";
import { showSpinner, hideSpinner } from "../../utils/loading.js";
import {
    createWatchHistoryRecordService,
    updateWatchProgressService,
    getSingleRecordService
} from "../../services/watchHistoryService.js";

import { updateProfileLastWatchedService } from "../../services/profileService.js";

export async function initWatchPage() {
    const root = document.querySelector(".watch-page");
    if (!root) return;

    const hash = window.location.hash || "";
    const parts = hash.split("/");
    const rawId = parts[2];
    const contentId = rawId.includes("?") ? rawId.split("?")[0] : rawId;
    const profileId = localStorage.getItem("profileId");

    if (!contentId || !profileId) {
        window.location.hash = "#/home";
        return;
    }

    const videoEl = document.getElementById("video-player");
    const exitBtn = document.getElementById("exit-watch-btn");

    showSpinner();
    try {
        const response = await getContentByIdService(contentId);
        const content = response?.content || response?.data?.content;

        if (!content || !content.videoUrl) {
            window.location.hash = `#/content/${contentId}`;
            return;
        }

        videoEl.src = content.videoUrl;

        let progressRecord = null;

        try {
            const record = await getSingleRecordService(profileId, contentId);

            if (record?.watchHistoryId) {
                progressRecord = record;
            } else {
                progressRecord = await createWatchHistoryRecordService(
                    profileId,
                    contentId
                );
            }
        } catch (err) {
            console.warn("Error reading record:", err.message);
        }

        let lastSentProgress = progressRecord?.progress || 0;

        // --- Save when leaving page ---
        window.addEventListener("beforeunload", async () => {
            const current = Math.floor(videoEl.currentTime);
            if (current > 0) {
                lastSentProgress = current;
                await handleupdate(
                    profileId,
                    contentId,
                    current,
                    videoEl.duration
                );
            }
        });

        // --- Save when tab loses focus ---
        document.addEventListener("visibilitychange", async () => {
            if (document.hidden) {
                const current = Math.floor(videoEl.currentTime);
                if (current > 0) {
                    lastSentProgress = current;
                    await handleupdate(
                        profileId,
                        contentId,
                        current,
                        videoEl.duration
                    );
                }
            }
        });

        // Seek on load
        videoEl.addEventListener("loadedmetadata", () => {
            if (lastSentProgress > 0 && lastSentProgress < videoEl.duration) {
                videoEl.currentTime = lastSentProgress;
            }
        });

        // Update progress every 5 seconds
        videoEl.addEventListener("timeupdate", async () => {
            const currentProgress = Math.floor(videoEl.currentTime);

            if (currentProgress < lastSentProgress + 5) return;

            lastSentProgress = currentProgress;

            await handleupdate(
                profileId,
                contentId,
                currentProgress,
                videoEl.duration
            );
        });

        // On end mark as watched
        videoEl.addEventListener("ended", async () => {
            const finalProgress = Math.floor(videoEl.duration);

            lastSentProgress = finalProgress;

            await handleupdate(
                profileId,
                contentId,
                finalProgress,
                videoEl.duration
            );
        });

        exitBtn.addEventListener("click", () => {
            window.location.hash = `#/content/${contentId}`;
        });

        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape") {
                window.location.hash = `#/content/${contentId}`;
            }
        });
    } catch (err) {
        console.error("Error loading watch page:", err);
        window.location.hash = `#/content/${contentId}`;
    } finally {
        hideSpinner();
    }
}

async function handleupdate(profileId, contentId, progress, duration) {
    try {
        await updateWatchProgressService(profileId, contentId, progress);

        const updatedProfile = await updateProfileLastWatchedService(
            profileId,
            contentId,
            progress,
            duration
        );

        localStorage.setItem("selectedProfile", JSON.stringify(updatedProfile));
    } catch (error) {
        console.error(error.message);
    }
}
