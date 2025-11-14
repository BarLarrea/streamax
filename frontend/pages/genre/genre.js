import { renderContentCard } from "../../shared/components/contentCard/renderContentCard.js";
import { getContentsByGenreService } from "../../services/contentService.js";

let currentPage = 1;
let isLoading = false;
let hasMore = true;
let currentGenre = null;

// Filters
let currentSort = "createdAt-desc";
let currentWatchedFilter = "all";

export async function initGenrePage() {
    const root = document.querySelector(".genre-page");
    if (!root) return;

    const hash = window.location.hash;
    const parts = hash.split("/");
    currentGenre = parts[2]?.toLowerCase();

    const titleEl = document.getElementById("genre-title");
    const listEl = document.getElementById("genre-content-list");

    // Set up genre dropdown (always visible)
    setupGenreDropdown(currentGenre);

    // ===== CASE 1: No genre chosen yet (from NavBar) =====
    if (!currentGenre) {
        titleEl.textContent = "Choose a Genre";

        // clear content area
        listEl.innerHTML = "";
        hasMore = false; // stop scrolling load

        return;
    }

    // ===== CASE 2: Genre specified (from Home or dropdown) =====
    titleEl.textContent =
        currentGenre.charAt(0).toUpperCase() + currentGenre.slice(1);

    // Reset pagination
    currentPage = 1;
    hasMore = true;
    listEl.innerHTML = "";

    await loadMoreContents();

    setupFilters();
    setupInfiniteScroll();
}

/* ------------------------------------------------------------------
   GENRE DROPDOWN
------------------------------------------------------------------ */
function setupGenreDropdown(selectedGenre) {
    const select = document.getElementById("genre-select");

    const GENRES = [
        "Action",
        "Adventure",
        "Comedy",
        "Drama",
        "Fantasy",
        "Horror",
        "Romance",
        "Thriller",
        "Documentary",
        "Animation",
        "Crime",
        "Family"
    ];

    let html = "";

    if (!selectedGenre) {
        html += `<option value="" selected>Select Genre...</option>`;
    }

    html += GENRES.map((g) => {
        const value = g.toLowerCase();
        const isSelected = selectedGenre === value ? "selected" : "";
        return `<option value="${value}" ${isSelected}>${g}</option>`;
    }).join("");

    select.innerHTML = html;

    select.onchange = () => {
        const newGenre = select.value;
        if (newGenre) {
            window.location.hash = `#/genre/${newGenre}`;
        }
    };
}

/* ------------------------------------------------------------------
   Load next page
------------------------------------------------------------------ */
async function loadMoreContents() {
    if (!hasMore || isLoading) return;

    isLoading = true;
    showLoading(true);

    try {
        const [sortBy, sortOrder] = currentSort.split("-");

        const watched =
            currentWatchedFilter === "all"
                ? undefined
                : currentWatchedFilter === "watched"
                ? "true"
                : "false";

        const response = await getContentsByGenreService(
            currentGenre,
            currentPage,
            20,
            sortBy,
            sortOrder,
            watched
        );

        const listEl = document.getElementById("genre-content-list");

        response.contents.forEach((item) => {
            const card = renderContentCard(item, {
                clickable: true,
                viewState: "new"
            });
            listEl.appendChild(card);
        });

        currentPage++;

        if (currentPage > response.totalPages) hasMore = false;
    } catch (err) {
        console.error("Genre load error:", err);
        hasMore = false;
    } finally {
        isLoading = false;
        showLoading(false);
    }
}

/* ------------------------------------------------------------------
   Filters (sort + watched)
------------------------------------------------------------------ */
function setupFilters() {
    const sortSelect = document.getElementById("sort-select");
    const watchedSelect = document.getElementById("watched-select");

    sortSelect.onchange = () => {
        currentSort = sortSelect.value;
        resetListAndReload();
    };

    watchedSelect.onchange = () => {
        currentWatchedFilter = watchedSelect.value;
        resetListAndReload();
    };
}

function resetListAndReload() {
    const listEl = document.getElementById("genre-content-list");
    listEl.innerHTML = "";

    currentPage = 1;
    hasMore = true;

    loadMoreContents();
}

/* ------------------------------------------------------------------
   Infinite scroll
------------------------------------------------------------------ */
function setupInfiniteScroll() {
    window.onscroll = async () => {
        const scrolledToBottom =
            window.innerHeight + window.scrollY >=
            document.body.offsetHeight - 300;

        if (scrolledToBottom) {
            await loadMoreContents();
        }
    };
}

function showLoading(state) {
    const el = document.getElementById("genre-loading");
    if (state) el.classList.remove("hidden");
    else el.classList.add("hidden");
}
