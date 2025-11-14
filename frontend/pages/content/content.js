// File: frontend/pages/content/content.js
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

export async function initContentPage() {
    const root = document.querySelector(".content-page");
    if (!root) return;

    const hash = window.location.hash || "";
    const parts = hash.split("/");
    const contentId = parts[2];

    if (!contentId) {
        root.innerHTML = `
            <div class="no-results">
                <p>Content ID is missing.</p>
            </div>
        `;
        return;
    }

    showSpinner();

    try {
        const response = await getContentByIdService(contentId);
        const content = response?.content || response?.data?.content;

        if (!content) {
            root.innerHTML = `
                <div class="no-results">
                    <p>Content not found.</p>
                </div>
            `;
            return;
        }

        renderHero(root, content);

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
        root.innerHTML = `
            <div class="no-results">
                <p>Failed to load content details.</p>
            </div>
        `;
    } finally {
        hideSpinner();
    }
}

/* ----------------------------------------------------------
   HERO RENDERING
---------------------------------------------------------- */
function renderHero(root, content) {
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
    const typePillEl = root.querySelector("#content-type-pill");
    const seriesBadgeEl = root.querySelector("#content-series-badge");
    const titleEl = root.querySelector("#content-title");
    const descEl = root.querySelector("#content-description");

    const releaseEl = root.querySelector("#meta-releaseYear");
    const durationEl = root.querySelector("#meta-duration");
    const ratingEl = root.querySelector("#meta-rating");

    const genresEl = root.querySelector("#meta-genres");
    const actorsEl = root.querySelector("#meta-actors");
    const directorsEl = root.querySelector("#meta-directors");
    const languagesEl = root.querySelector("#meta-languages");

    const playBtn = root.querySelector("#play-btn");
    const likeBtn = root.querySelector("#like-btn");

    if (posterEl) {
        posterEl.src = posterUrl || "assets/posters/defaultPoster.png";
        posterEl.alt = title || "Content poster";
    }

    if (typePillEl) {
        typePillEl.textContent = type || "";
    }

    if (seriesBadgeEl) {
        if (seriesId && typeof seriesId === "object" && seriesId.title) {
            let label = seriesId.title;
            if (seasonNumber) label += ` • Season ${seasonNumber}`;
            if (episodeNumber) label += ` • Episode ${episodeNumber}`;
            seriesBadgeEl.textContent = label;
            seriesBadgeEl.classList.remove("hidden");
        } else {
            seriesBadgeEl.classList.add("hidden");
        }
    }

    if (titleEl) {
        titleEl.textContent = title || "Untitled";
    }

    if (descEl) {
        descEl.textContent =
            description && description.trim().length > 0
                ? description
                : "No description available.";
    }

    if (releaseEl) {
        if (releaseYear) {
            releaseEl.textContent = String(releaseYear);
            releaseEl.style.display = "inline-flex";
        } else {
            releaseEl.style.display = "none";
        }
    }

    if (durationEl) {
        const minutes = duration ? Math.round(duration / 60) : null;
        if (minutes && minutes > 0) {
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

    if (genresEl) {
        genresEl.textContent =
            genres && genres.length
                ? genres.map((g) => capitalizeFirst(g)).join(", ")
                : "—";
    }

    if (actorsEl) {
        actorsEl.textContent =
            actors && actors.length ? actors.join(", ") : "—";
    }

    if (directorsEl) {
        directorsEl.textContent =
            directors && directors.length ? directors.join(", ") : "—";
    }

    if (languagesEl) {
        languagesEl.textContent =
            language && language.length ? language.join(", ") : "—";
    }

    if (playBtn) {
        playBtn.onclick = () => {
            console.log("Play clicked for content:", id, "type:", type);
            // TODO: connect to player route or watch-history when ready
        };
    }

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
    const profileId = localStorage.getItem("profileId");
    if (!profileId) {
        likeBtn.disabled = true;
        likeBtn.title = "Please select a profile first.";
        return;
    }

    // Initial state: for now we assume "not liked" by default.
    // Later we can enhance this to reflect real state from backend.
    let liked = false;

    renderLikeState();

    likeBtn.onclick = async () => {
        // Optimistic UI update
        liked = !liked;
        renderLikeState();

        try {
            await toggleLikeService(profileId, content.id);
        } catch (err) {
            console.error("Error toggling like:", err);

            // Revert UI on failure
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
