import loadCarousel from "../../shared/components/carousel/index.js";
import { renderContentCard } from "../../shared/components/contentCard/renderContentCard.js";
import { toggleLikeService } from "../../services/profileService.js";
import { showSpinner, hideSpinner } from "../../utils/loading.js";
import { showError } from "../../utils/notifications.js";
import {
    getContentByIdService,
    getSeasonsBySeriesService,
    getEpisodesBySeasonService
} from "../../services/contentService.js";

import { getLastProgressService } from "../../services/watchHistoryService.js";

export async function initContentPage() {
    const root = document.querySelector(".content-page");
    if (!root) return;

    const hash = window.location.hash || "";
    const parts = hash.split("/");
    const contentId = parts[2];

    if (!contentId) {
        root.innerHTML = `<div class="no-results"><p>Content ID is missing.</p></div>`;
        return;
    }

    showSpinner();

    try {
        // Load content metadata
        const response = await getContentByIdService(contentId);
        const content = response?.content || response?.data?.content;
        if (!content) throw new Error("Content missing");

        const profile = JSON.parse(localStorage.getItem("selectedProfile"));

        // Load watch history for this content
        let watchData = null;

        const decision = resolveWatchData(profile, content.id);

        if (decision.source === "cache") {
            const cached = decision.data;

            watchData = {
                progress: cached.progress,
                duration: cached.duration,
                isCompleted: cached.progress >= cached.duration - 120
            };
        } else {
            try {
                const watchRes = await getLastProgressService(
                    profile.profileId,
                    content.id
                );

                // Server returns correct fields: progress, duration, isCompleted
                watchData = watchRes;
            } catch (err) {
                console.warn("No watch history found in server");
            }
        }

        // 3) Render hero (metadata + like + play/resume logic)
        renderHero(root, content, watchData);

        // 4) Seasons/Episodes shelves (unchanged)
        const type = content.type;

        if (type === "series") {
            await loadSeasonsShelf(root, content.id);
            hideEpisodesSection(root);
        } else if (type === "season") {
            hideSeasonsSection(root);
            await loadEpisodesShelf(root, content.id);
        } else {
            hideSeasonsSection(root);
            hideEpisodesSection(root);
        }
    } catch (err) {
        console.error("Error loading content page:", err);
        showError("Failed to load content details. Please try again.");
        root.innerHTML = `<div class="no-results"><p>Failed to load content details.</p></div>`;
    } finally {
        hideSpinner();
    }
}

function resolveWatchData(profile, contentId) {
    // Try local cache first
    const cached = profile?.lastWatched?.find(
        (item) => item.contentId === contentId
    );
    if (cached) return { source: "cache", data: cached };

    // If not in cache - fetch from backend
    return { source: "server", data: null };
}

/* ----------------------------------------------------------
   HERO RENDERING
---------------------------------------------------------- */
function renderHero(root, content, watchData) {
    const profile = JSON.parse(localStorage.getItem("selectedProfile"));

    const {
        id,
        type,
        title,
        description,
        posterUrl,
        rating,
        duration,
        releaseYear,
        genres = [],
        actors = [],
        directors = [],
        language = [],
        seriesId,
        seasonNumber,
        episodeNumber
    } = content;

    const posterEl = root.querySelector("#content-poster");
    const titleEl = root.querySelector("#content-title");
    const descEl = root.querySelector("#content-description");
    const typePillEl = root.querySelector("#content-type-pill");
    const seriesBadgeEl = root.querySelector("#content-series-badge");

    const releaseEl = root.querySelector("#meta-releaseYear");
    const durationEl = root.querySelector("#meta-duration");
    const ratingEl = root.querySelector("#meta-rating");
    const genresEl = root.querySelector("#meta-genres");
    const actorsEl = root.querySelector("#meta-actors");
    const directorsEl = root.querySelector("#meta-directors");
    const languagesEl = root.querySelector("#meta-languages");

    const playBtn = root.querySelector("#play-btn");
    const likeBtn = root.querySelector("#like-btn");

    if (type === "series") {
        if (playBtn) playBtn.style.display = "none";
    } else {
        if (playBtn) playBtn.style.display = "inline-flex";
    }

    // -------------------------
    // 1) Poster / Title / Desc
    // -------------------------
    if (posterEl) {
        posterEl.src = posterUrl || "assets/posters/defaultPoster.png";
        posterEl.alt = title || "Content poster";
    }

    if (typePillEl) typePillEl.textContent = type || "";

    if (titleEl) titleEl.textContent = title || "Untitled";
    if (descEl) descEl.textContent = description || "No description available.";

    // -------------------------
    // 2) SERIES / SEASON / EPISODE Badge
    // -------------------------
    if (seriesBadgeEl) {
        if (seriesId && typeof seriesId === "object" && seriesId.title) {
            let label = seriesId.title;
            if (seasonNumber != null) label += ` • Season ${seasonNumber}`;
            if (episodeNumber != null) label += ` • Episode ${episodeNumber}`;
            seriesBadgeEl.textContent = label;
            seriesBadgeEl.classList.remove("hidden");
        } else {
            seriesBadgeEl.classList.add("hidden");
        }
    }

    // -------------------------
    // 3) META DATA (Release, Duration, Rating)
    // -------------------------
    if (releaseEl) {
        if (releaseYear) {
            releaseEl.textContent = releaseYear;
            releaseEl.style.display = "inline-flex";
        } else {
            releaseEl.style.display = "none";
        }
    }

    if (durationEl) {
        if (duration) {
            const minutes = Math.round(duration / 60);
            durationEl.textContent = `${minutes} min`;
            durationEl.style.display = "inline-flex";
        } else {
            durationEl.style.display = "none";
        }
    }

    if (ratingEl) {
        if (rating != null) {
            ratingEl.textContent = `IMDb ${rating}`;
            ratingEl.style.display = "inline-flex";
        } else {
            ratingEl.style.display = "none";
        }
    }

    // -------------------------
    // 4) Lists: Genres, Actors, Directors, Language
    // -------------------------
    if (genresEl) {
        genresEl.textContent = genres.length
            ? genres.map((g) => capitalizeFirst(g)).join(", ")
            : "—";
    }

    if (actorsEl) {
        actorsEl.textContent = actors.length ? actors.join(", ") : "—";
    }

    if (directorsEl) {
        directorsEl.textContent = directors.length ? directors.join(", ") : "—";
    }

    if (languagesEl) {
        languagesEl.textContent = language.length ? language.join(", ") : "—";
    }

    // -------------------------
    // 5) WATCH DATA Play / Resume Logic
    // -------------------------
    let startFrom = 0;

    if (playBtn && type !== "series") {
        const {
            progress = 0,
            duration = 0,
            isCompleted = false
        } = watchData || {};

        if (isCompleted) {
            playBtn.innerHTML = `<i class="bi bi-play-fill"></i> Watch Again`;
        } else if (progress > 0) {
            playBtn.innerHTML = `<i class="bi bi-play-fill"></i> Resume`;
        } else {
            playBtn.innerHTML = `<i class="bi bi-play-fill"></i> Play`;
        }

        playBtn.onclick = () => {
            if (progress > 0) {
                window.location.hash = `#/watch/${id}?from=${progress}`;
            } else {
                window.location.hash = `#/watch/${id}`;
            }
        };
    }

    // -------------------------
    // 6) Progress Bar
    // -------------------------
    const progressBar = root.querySelector("#watch-progress");
    if (progressBar && progress > 0) {
        const pct = (progress / watchData.duration) * 100;
        progressBar.style.width = `${pct}%`;
        progressBar.parentElement.classList.remove("hidden");
    }

    // -------------------------
    // 7) LIKE BUTTON
    // -------------------------
    if (likeBtn) {
        setupLikeButton(likeBtn, content);
    }
}

/* ----------------------------------------------------------
   SEASONS SHELF (for series)
---------------------------------------------------------- */
async function loadSeasonsShelf(root, seriesId) {
    const section = root.querySelector("#seasons-section");
    const shelfSelector = "#seasons-carousel";

    if (!section) return;

    try {
        await loadCarousel(shelfSelector);

        const response = await getSeasonsBySeriesService(seriesId);
        const seasons = response?.seasons || [];

        const titleEl = document.querySelector(
            `${shelfSelector} .carousel__title`
        );
        if (titleEl) {
            titleEl.textContent = "Seasons";
        }

        if (!seasons.length) {
            appendEmptyMessage(shelfSelector, "No seasons available.");
            section.classList.remove("hidden");
            return;
        }

        const cards = seasons.map((season) =>
            renderContentCard(season, {
                clickable: true,
                viewState: "new"
            })
        );

        renderCards(`${shelfSelector} .carousel__track`, cards);
        section.classList.remove("hidden");
    } catch (err) {
        console.error("Error loading seasons:", err);
        appendEmptyMessage(
            shelfSelector,
            "Unable to load seasons at the moment."
        );
        section.classList.remove("hidden");
    }
}

/* ----------------------------------------------------------
   EPISODES SHELF (for season)
---------------------------------------------------------- */
async function loadEpisodesShelf(root, seasonId) {
    const section = root.querySelector("#episodes-section");
    const shelfSelector = "#episodes-carousel";

    if (!section) return;

    try {
        await loadCarousel(shelfSelector);

        const response = await getEpisodesBySeasonService(seasonId);
        const episodes = response?.episodes || [];

        const titleEl = document.querySelector(
            `${shelfSelector} .carousel__title`
        );
        if (titleEl) {
            titleEl.textContent = "Episodes";
        }

        if (!episodes.length) {
            appendEmptyMessage(shelfSelector, "No episodes available.");
            section.classList.remove("hidden");
            return;
        }

        const cards = episodes.map((episode) =>
            renderContentCard(episode, {
                clickable: true,
                viewState: "new"
            })
        );

        renderCards(`${shelfSelector} .carousel__track`, cards);
        section.classList.remove("hidden");
    } catch (err) {
        console.error("Error loading episodes:", err);
        appendEmptyMessage(
            shelfSelector,
            "Unable to load episodes at the moment."
        );
        section.classList.remove("hidden");
    }
}

/* ----------------------------------------------------------
   Helpers
---------------------------------------------------------- */
function hideSeasonsSection(root) {
    const section = root.querySelector("#seasons-section");
    if (section) section.classList.add("hidden");
}

function hideEpisodesSection(root) {
    const section = root.querySelector("#episodes-section");
    if (section) section.classList.add("hidden");
}

function appendEmptyMessage(selector, message) {
    const track = document.querySelector(`${selector} .carousel__track`);
    if (!track) return;

    const p = document.createElement("p");
    p.className = "carousel-empty";
    p.textContent = message;
    track.innerHTML = "";
    track.appendChild(p);
}

function renderCards(trackSelector, cards) {
    const track = document.querySelector(trackSelector);
    if (!track) return;

    track.innerHTML = "";
    const fragment = document.createDocumentFragment();
    cards.forEach((card) => fragment.appendChild(card));
    track.appendChild(fragment);
}

function capitalizeFirst(str) {
    if (!str || typeof str !== "string") return str;
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function setupLikeButton(likeBtn, content) {
    const profile = JSON.parse(localStorage.getItem("selectedProfile"));

    if (!profile) {
        likeBtn.disabled = true;
        likeBtn.title = "Please select a profile first.";
        return;
    }

    // Initial like state
    let liked = profile.likedContent?.includes(content.id) || false;

    renderLikeState();

    likeBtn.onclick = async () => {
        // Optimistic update
        liked = !liked;
        renderLikeState();

        try {
            await toggleLikeService(profile.profileId, content.id);

            // Update the local profile copy
            updateLocalProfileLikes(profile, content.id, liked);
        } catch (err) {
            console.error("Error toggling like:", err);

            // Revert UI
            liked = !liked;
            renderLikeState();
        }
    };

    function renderLikeState() {
        if (liked) {
            likeBtn.innerHTML = `<i class="bi bi-heart-fill"></i> Liked`;
            likeBtn.classList.add("btn--liked");
        } else {
            likeBtn.innerHTML = `<i class="bi bi-heart"></i> Like`;
            likeBtn.classList.remove("btn--liked");
        }
    }
}

function updateLocalProfileLikes(profile, contentId, liked) {
    let arr = profile.likedContent || [];

    if (liked && !arr.includes(contentId)) {
        arr.push(contentId);
    }

    if (!liked) {
        arr = arr.filter((id) => id !== contentId);
    }

    profile.likedContent = arr;
    localStorage.setItem("selectedProfile", JSON.stringify(profile));
}
