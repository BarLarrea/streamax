import loadCarousel from "../../shared/components/carousel/index.js";
import { renderContentCard } from "../../shared/components/contentCard/renderContentCard.js";
import { showSpinner, hideSpinner } from "../../utils/loading.js";

import { getProfileWithContentService } from "../../services/profileService.js";
import {
    getWatchingNowService,
    getPopularContentsService
} from "../../services/watchHistoryService.js";
import {
    getContentsByGenresService,
    getAllContentsPagedService
} from "../../services/contentService.js";

/* =======================================================================
   Initialize Home Page
======================================================================= */
export async function initHomePage() {
    const root = document.getElementById("home-root");
    if (!root) return;

    root.innerHTML = "";
    const profileId = localStorage.getItem("profileId");

    if (!profileId) {
        showNotice(root, "Please select a profile to continue.");
        window.location.hash = "#/profiles";
        return;
    }

    await loadContinueWatchingShelf(root, profileId);
    await loadRecommendedShelf(root, profileId);
    await loadPopularShelf(root);
    await loadGenreShelves(root);
}

/* =======================================================================
   Shelf 1: Continue Watching (uses backend isCompleted flag)
======================================================================= */
async function loadContinueWatchingShelf(root, profileId) {
    const shelfSelector = "#shelf-continue";
    await appendShelf(root, shelfSelector, "Continue Watching");

    try {
        showSpinner();
        const response = await getWatchingNowService(profileId);
        const records = Array.isArray(response?.data) ? response.data : [];

        if (!records.length) {
            appendEmptyMessage(
                shelfSelector,
                "No items to continue. Start watching something!"
            );
            return;
        }

        const cards = records
            .filter((r) => r?.contentId)
            .map((r) => {
                const content = r.contentId; // already populated
                const duration = r.durationAtWatch || content.duration || 0;
                const progress = Math.max(0, r.progress ?? 0);

                // use backend flag
                const viewState = r.isCompleted ? "completed" : "in_progress";

                return renderContentCard(content, {
                    viewState,
                    progressSeconds: progress,
                    durationSeconds: duration,
                    onContinue: (c) => {
                        window.location.hash = `#/content/${c._id}`;
                    }
                });
            });

        renderCards(`${shelfSelector} .carousel__track`, cards);
    } catch (err) {
        console.error("Error fetching watching now:", err);
        appendEmptyMessage(
            shelfSelector,
            "Unable to load your recent progress."
        );
    } finally {
        hideSpinner();
    }
}

/* =======================================================================
   Shelf 2: Recommended For You (Optimized with populated profile)
======================================================================= */
async function loadRecommendedShelf(root, profileId) {
    const shelfSelector = "#shelf-recommended";
    await appendShelf(root, shelfSelector, "Recommended for You");

    try {
        showSpinner();
        // Fetch populated profile (includes likedContent + lastWatched.contentId)
        const { profile } = await getProfileWithContentService(profileId);

        const liked = Array.isArray(profile.likedContent)
            ? profile.likedContent
            : [];
        const lastWatched = Array.isArray(profile.lastWatched)
            ? profile.lastWatched.map((r) => r.contentId).filter(Boolean)
            : [];

        const allSource = [...liked, ...lastWatched];
        if (!allSource.length) {
            appendEmptyMessage(
                shelfSelector,
                "No personalized recommendations yet."
            );
            return;
        }

        // Extract genres from liked and last watched contents
        const genreSet = new Set();
        allSource.forEach((c) =>
            (c.genres || []).forEach((g) => genreSet.add(g))
        );

        // Get similar contents by genre
        const genres = Array.from(genreSet);
        const res = await getContentsByGenresService(genres, 1, 30);
        let recs = res.contents || [];

        // Exclude already seen/liked
        const excludeIds = new Set(allSource.map((c) => String(c._id)));
        recs = recs.filter((c) => !excludeIds.has(String(c._id)));

        if (!recs.length) {
            appendEmptyMessage(
                shelfSelector,
                "No new recommendations yet. Watch or like more content!"
            );
            return;
        }

        const cards = recs.map((c) =>
            renderContentCard(c, { viewState: "new", clickable: true })
        );
        renderCards(`${shelfSelector} .carousel__track`, cards);
    } catch (err) {
        console.error("Error loading recommendations:", err);
        appendEmptyMessage(
            shelfSelector,
            "Unable to load personalized recommendations."
        );
    } finally {
        hideSpinner();
    }
}

/* =======================================================================
   Shelf 3: Popular Now
======================================================================= */
async function loadPopularShelf(root) {
    const shelfSelector = "#shelf-popular";
    await appendShelf(root, shelfSelector, "Popular Now");

    try {
        showSpinner();
        const popularContents = await getPopularContentsService();
        if (!Array.isArray(popularContents) || !popularContents.length) {
            appendEmptyMessage(shelfSelector, "No popular content available.");
            return;
        }

        const cards = popularContents
            .slice(0, 20)
            .map((c) =>
                renderContentCard(c, { viewState: "new", clickable: true })
            );

        renderCards(`${shelfSelector} .carousel__track`, cards);
    } catch (err) {
        console.error("Error loading popular contents:", err);
        appendEmptyMessage(
            shelfSelector,
            "Unable to load popular content at the moment."
        );
    } finally {
        hideSpinner();
    }
}

/* =======================================================================
   Shelf 4: Recently Added by Genre (resilient to empty genres)
======================================================================= */
async function loadGenreShelves(root) {
    const genres = [
        "Action",
        "Adventure",
        "Comedy",
        "Drama",
        "Fantasy",
        "Horror",
        "Romance",
        "Sci-Fi",
        "Thriller",
        "Documentary",
        "Animation",
        "Crime",
        "Family"
    ];

    for (const genre of genres) {
        const shelfSelector = `#shelf-${genre.toLowerCase()}`;
        await appendShelf(
            root,
            shelfSelector,
            `Recently Added in ${capitalize(genre)}`
        );

        try {
            showSpinner();
            const res = await getAllContentsPagedService(1, 10, {
                genres: genre,
                sortBy: "createdAt"
            });

            const list = res.contents || [];

            if (!list.length) {
                appendEmptyMessage(shelfSelector, "No recent content found.");
                continue;
            }

            const cards = list.map((c) =>
                renderContentCard(c, { viewState: "new", clickable: true })
            );
            renderCards(`${shelfSelector} .carousel__track`, cards);
        } catch (err) {
            // Handle "no content found" (404) gracefully
            if (err.response?.status === 404) {
                appendEmptyMessage(shelfSelector, "No recent content found.");
                continue;
            }

            // Real error (server/network)
            console.error(`Error loading genre "${genre}":`, err);
            appendEmptyMessage(shelfSelector, "Unable to load this genre.");
        } finally {
            hideSpinner();
        }
    }
}

/* =======================================================================
   Helpers
======================================================================= */
async function appendShelf(root, selector, title) {
    const section = document.createElement("div");
    section.id = selector.replace("#", "");
    section.className = "shelf";
    root.appendChild(section);

    await loadCarousel(selector);
    const shelf = document.querySelector(selector);
    if (shelf) {
        const titleEl = shelf.querySelector(".carousel__title");
        if (titleEl) {
            titleEl.textContent = title;

            // ===== CLICK TO NAVIGATE TO GENRE PAGE =====
            const match = title.match(/in (.+)$/i);
            if (match) {
                const genre = match[1].trim().toLowerCase();
                titleEl.style.cursor = "pointer";
                titleEl.addEventListener("click", () => {
                    window.location.hash = `#/genre/${genre}`;
                });
            }
        }
    }
}

function appendEmptyMessage(selector, message) {
    const track = document.querySelector(`${selector} .carousel__track`);
    const p = document.createElement("p");
    p.className = "carousel-empty";
    p.textContent = message;
    track.appendChild(p);
}

function showNotice(root, text) {
    const div = document.createElement("div");
    div.className = "notice";
    div.textContent = text;
    root.appendChild(div);
}

function capitalize(s) {
    return s ? s.charAt(0).toUpperCase() + s.slice(1) : s;
}

function renderCards(trackSelector, cards) {
    const track = document.querySelector(trackSelector);
    if (!track) return;

    track.innerHTML = "";
    const fragment = document.createDocumentFragment();

    cards.forEach((card) => fragment.appendChild(card));
    track.appendChild(fragment);
}
