import loadCarousel from "../../shared/components/carousel/index.js";
import { renderContentCard } from "../../shared/components/contentCard/renderContentCard.js";

import { getProfileByIdService } from "../../services/profileService.js";
import {
    getWatchingNowService,
    getPopularContentsService
} from "../../services/watchHistoryService.js";
import {
    getContentByIdService,
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
   Shelf 1: Continue Watching
======================================================================= */
async function loadContinueWatchingShelf(root, profileId) {
    const shelfSelector = "#shelf-continue";
    await appendShelf(root, shelfSelector, "Continue Watching");

    try {
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
            .filter((x) => x?.contentId)
            .map((r) => {
                const progress = Math.max(
                    0,
                    Math.floor((r.progress ?? 0) / 10) * 10
                );
                const duration =
                    r.durationAtWatch || r.contentId?.duration || 0;
                const safeProgress = Math.min(progress, duration);

                // finished? "completed" : "in_progress"
                const viewState =
                    duration - safeProgress <= 120
                        ? "completed"
                        : "in_progress";

                return renderContentCard(r.contentId, {
                    viewState,
                    progressSeconds: safeProgress,
                    durationSeconds: duration,
                    onContinue: (c) =>
                        (window.location.hash = `#/content/${c._id}`)
                });
            });

        renderCards(`${shelfSelector} .carousel__track`, cards);
    } catch (err) {
        console.error("Error fetching watching now:", err);
        appendEmptyMessage(
            shelfSelector,
            "Unable to load your recent progress."
        );
    }
}

/* =======================================================================
   Shelf 2: Recommended For You
======================================================================= */
async function loadRecommendedShelf(root, profileId) {
    const shelfSelector = "#shelf-recommended";
    await appendShelf(root, shelfSelector, "Recommended for You");

    try {
        const profile = await getProfileByIdService(profileId);
        const likedIds = Array.isArray(profile.likedContent)
            ? profile.likedContent.map(String)
            : [];
        const lastWatchedIds = Array.isArray(profile.lastWatched)
            ? profile.lastWatched.map((r) => String(r.contentId))
            : [];
        const sourceIds = Array.from(
            new Set([...likedIds, ...lastWatchedIds])
        ).slice(0, 20);

        const seedContents = await Promise.all(
            sourceIds.map(getContentByIdService).map((p) => p.catch(() => null))
        );

        const genres = Array.from(
            new Set(seedContents.filter(Boolean).flatMap((c) => c.genres || []))
        );

        let recs = [];
        if (genres.length > 0) {
            recs = await getContentsByGenresService(genres, 1, 20);
            const exclude = new Set(sourceIds);
            recs = recs.filter((c) => !exclude.has(String(c._id)));
        }

        if (!recs.length) {
            appendEmptyMessage(
                shelfSelector,
                "No personalized recommendations yet."
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
    }
}

/* =======================================================================
   Shelf 3: Popular Now
======================================================================= */
async function loadPopularShelf(root) {
    const shelfSelector = "#shelf-popular";
    await appendShelf(root, shelfSelector, "Popular Now");

    try {
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
    }
}

/* =======================================================================
   Shelf 4: New by Genre
======================================================================= */
async function loadGenreShelves(root) {
    try {
        const res = await getAllContentsPagedService(1, 60);
        const list = res.contents || [];

        const genreMap = new Map();
        list.forEach((c) => {
            (c.genres || []).forEach((g) => {
                const key = String(g).toLowerCase();
                if (!genreMap.has(key)) genreMap.set(key, []);
                genreMap.get(key).push(c);
            });
        });

        if (!genreMap.size) {
            const shelfSelector = "#shelf-new";
            await appendShelf(root, shelfSelector, "New by Genre");
            appendEmptyMessage(shelfSelector, "No genres found.");
            return;
        }

        for (const [genre, arr] of genreMap.entries()) {
            arr.sort((a, b) => (b.releaseYear || 0) - (a.releaseYear || 0));
            const top = arr.slice(0, 10);

            const shelfSelector = `#shelf-${genre}`;
            await appendShelf(
                root,
                shelfSelector,
                `New in ${capitalize(genre)}`
            );

            const cards = top.map((c) =>
                renderContentCard(c, { viewState: "new", clickable: true })
            );

            renderCards(`${shelfSelector} .carousel__track`, cards);
        }
    } catch (err) {
        console.error("Error loading new-by-genre shelves:", err);
        const shelfSelector = "#shelf-new";
        await appendShelf(root, shelfSelector, "New by Genre");
        appendEmptyMessage(shelfSelector, "Unable to load genre shelves.");
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
        if (titleEl) titleEl.textContent = title;
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
