import { getFieldsForType, initGenreDropdown } from "./contentFields.js";
import { formContentToJSON } from "../../utils/formContentToJSON.js";
import { showSuccess, showError } from "../../utils/notifications.js";
import { showSpinner, hideSpinner } from "../../utils/loading.js";
import {
    createContentService,
    importExternalMetadataService
} from "../../services/contentService.js";

export const initAdminPage = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && !user.isAdmin) {
        showError("Access denied: Admins only.");
        setTimeout(() => (window.location.hash = "#/profiles"), 300);
        return;
    }

    const typeSelect = document.getElementById("type");
    const dynamicFields = document.getElementById("dynamic-fields");
    const form = document.getElementById("add-content-form");
    const metadataContainer = document.getElementById("metadata-btn-container");

    // === TYPE SELECTION ===
    typeSelect.addEventListener("change", () => {
        const type = typeSelect.value;

        // reset area
        dynamicFields.innerHTML = "";
        metadataContainer.classList.add("hidden");

        if (!type) return;

        // load fields
        dynamicFields.innerHTML = getFieldsForType(type);
        initGenreDropdown();

        // show metadata fetcher only for movie/series
        if (type === "movie" || type === "series") {
            metadataContainer.classList.remove("hidden");
        }
    });

    // === FETCH METADATA ===
    document
        .getElementById("fetchMetadataBtn")
        ?.addEventListener("click", async () => {
            const titleInput = document.querySelector('input[name="title"]');
            const title = titleInput?.value.trim();
            if (!title) {
                showError("Please enter a title first.");
                return;
            }

            try {
                showSpinner();
                const res = await importExternalMetadataService(title);
                const data = res.metadata;

                // fill values if exist
                const map = {
                    description: data.description,
                    releaseYear: data.releaseYear,
                    duration: data.duration,
                    posterUrl: data.posterUrl
                };

                Object.entries(map).forEach(([id, val]) => {
                    const el = document.querySelector(`[name="${id}"]`);
                    if (el && val && !el.value) el.value = val;
                });

                // fill genres
                if (Array.isArray(data.genres) && data.genres.length > 0) {
                    const hiddenInput =
                        document.getElementById("genres-hidden");
                    const selectedBox =
                        document.getElementById("selected-genres");
                    selectedBox.innerHTML = "";
                    data.genres.forEach((g) => {
                        const tag = document.createElement("div");
                        tag.className = "tag";
                        tag.innerHTML = `${g} <span>×</span>`;
                        selectedBox.appendChild(tag);
                    });
                    hiddenInput.value = JSON.stringify(data.genres);
                }

                // fill actors and directors
                if (Array.isArray(data.actors) && data.actors.length > 0) {
                    const actorsInput = document.querySelector(
                        'input[name="actors"]'
                    );
                    if (actorsInput) actorsInput.value = data.actors.join(", ");
                }
                if (Array.isArray(data.director) && data.director.length > 0) {
                    const directorsInput = document.querySelector(
                        'input[name="directors"]'
                    );
                    if (directorsInput)
                        directorsInput.value = data.director.join(", ");
                }

                // fill rating
                if (data.rating) {
                    const ratingInput = document.querySelector(
                        'input[name="rating"]'
                    );
                    if (ratingInput) ratingInput.value = data.rating;
                }

                // fill language
                if (Array.isArray(data.language) && data.language.length > 0) {
                    const langInput = document.querySelector(
                        'input[name="language"]'
                    );
                    if (langInput) langInput.value = data.language.join(", ");
                }

                showSuccess(`Metadata loaded for "${data.title}"`);
            } catch (error) {
                console.error("Failed to fetch metadata:", error);
                showError("Failed to fetch metadata. Please try again.");
            } finally {
                hideSpinner();
            }
        });

    // === CREATE CONTENT ===
    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        try {
            showSpinner();
            const contentData = formContentToJSON(form);
            console.log("Final contentData before POST:", contentData);

            await createContentService(contentData);
            showSuccess("Content created successfully!");
            form.reset();
            dynamicFields.innerHTML = "";
            metadataContainer.classList.add("hidden");
        } catch (err) {
            console.error(err);
            showError("Failed to create content.");
        } finally {
            hideSpinner();
        }
    });
};
