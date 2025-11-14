import { searchContentService } from "../../services/contentService.js";
import loadCarousel from "../../shared/components/carousel/index.js";
import { renderContentCard } from "../../shared/components/contentCard/renderContentCard.js";
import { showSpinner, hideSpinner } from "../../utils/loading.js";

let debounceTimer = null;

export function initSearchPage() {
    const input = document.getElementById("searchInput");
    const container = document.getElementById("results-container");

    if (!input || !container) {
        console.error("Search elements missing");
        return;
    }

    input.addEventListener("input", () => {
        const query = input.value.trim();
        clearTimeout(debounceTimer);

        if (!query) {
            container.innerHTML = "";
            return;
        }

        debounceTimer = setTimeout(() => {
            performSearch(query, container);
        }, 300);
    });
}

async function performSearch(query, container) {
    try {
        showSpinner();

        const res = await searchContentService(query);
        const grouped = groupByType(res.contents || []);

        await renderGroupedResults(grouped, container);
    } catch (err) {
        console.error("Search failed:", err);
    } finally {
        hideSpinner();
    }
}

function groupByType(contents) {
    const groups = {
        movie: [],
        series: [],
        collection: [],
        season: [],
        episode: []
    };

    contents.forEach((c) => {
        if (groups[c.type]) groups[c.type].push(c);
    });

    return groups;
}

async function renderGroupedResults(groups, container) {
    container.innerHTML = "";

    const shelves = [];
    const loadPromises = [];

    // 1) create all shelves and load carousels in parallel
    for (const [type, list] of Object.entries(groups)) {
        if (!list.length) continue;

        const title = getTitleForType(type);
        const id = `search-${type}`;

        // create wrapper
        const wrapper = document.createElement("div");
        wrapper.className = "shelf";
        wrapper.id = id;

        wrapper.innerHTML = `
            <h2 class="carousel__title">${title}</h2>
            <div class="carousel__track-wrapper">
                <div class="carousel__track"></div>
            </div>
        `;

        container.appendChild(wrapper);

        // store references
        shelves.push({ id, list });

        // fire loadCarousel but DO NOT await yet
        loadPromises.push(loadCarousel(`#${id}`));
    }

    // 2) wait for ALL carousels to load
    await Promise.all(loadPromises);

    // 3) now inject cards after templates loaded
    for (const shelf of shelves) {
        const track = document.querySelector(`#${shelf.id} .carousel__track`);
        if (!track) continue;

        const cards = shelf.list.map((c) =>
            renderContentCard(c, { clickable: true })
        );

        track.innerHTML = "";
        const frag = document.createDocumentFragment();
        cards.forEach((card) => frag.appendChild(card));
        track.appendChild(frag);
    }

    // 4) fallback
    if (!shelves.length) {
        container.innerHTML = `
            <div class="no-results">
                <i class="bi bi-search"></i>
                <p>No matching results found</p>
            </div>
        `;
    }
}

function getTitleForType(type) {
    switch (type) {
        case "movie":
            return "Movies";
        case "series":
            return "Series";
        case "collection":
            return "Collections";
        case "season":
            return "Seasons";
        case "episode":
            return "Episodes";
        default:
            return "Other";
    }
}
