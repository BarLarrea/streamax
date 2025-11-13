import { getFieldsForType, initGenreDropdown } from "./contentFields.js";
import { formContentToJSON } from "../../utils/formContentToJSON.js";
import { showSuccess, showError } from "../../utils/notifications.js";
import { showSpinner, hideSpinner } from "../../utils/loading.js";

import {
    createContentService,
    importExternalMetadataService,
    searchContentService,
    getContentByIdService,
    updateContentService,
    deleteContentService
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
                const type = typeSelect.value;
                const res = await importExternalMetadataService(title, type);
                const data = res.metadata;

                // Update title if OMDb returned a more complete one
                if (data.title && data.title.trim() && data.title !== title) {
                    titleInput.value = data.title;
                }

                if (data.duration) {
                    data.duration = parseInt(data.duration) * 60 || null;
                }

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

                // fill actors
                if (Array.isArray(data.actors) && data.actors.length > 0) {
                    const actorsInput = document.querySelector(
                        'input[name="actors"]'
                    );
                    if (actorsInput) actorsInput.value = data.actors.join(", ");
                }

                // fill directors (support string or array)
                if (Array.isArray(data.director)) {
                    const directorsInput = document.querySelector(
                        'input[name="directors"]'
                    );
                    if (directorsInput)
                        directorsInput.value = data.director.join(", ");
                } else if (
                    typeof data.director === "string" &&
                    data.director.trim()
                ) {
                    const directorsInput = document.querySelector(
                        'input[name="directors"]'
                    );
                    if (directorsInput)
                        directorsInput.value = data.director
                            .split(",")
                            .map((d) => d.trim())
                            .join(", ");
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

    // === SEARCH EXISTING CONTENT ===
    const searchInput = document.getElementById("searchTitle");
    const searchBtn = document.getElementById("searchBtn");
    const searchResults = document.getElementById("searchResults");
    const contentDetailsContainer = document.getElementById(
        "contentDetailsContainer"
    );

    searchBtn.addEventListener("click", async () => {
        const query = searchInput.value.trim();
        if (!query) {
            showError("Please enter a title to search.");
            return;
        }

        try {
            showSpinner();
            const res = await searchContentService(query);

            if (!res.contents || res.contents.length === 0) {
                searchResults.innerHTML = `<p>No content found.</p>`;
                contentDetailsContainer.classList.add("hidden");
                return;
            }

            renderSearchResults(res.contents);
        } catch (error) {
            console.error("Search failed:", error);

            const serverMessage =
                error.response?.data?.message ||
                error.message ||
                "Failed to search content.";

            showError(serverMessage);
        } finally {
            hideSpinner();
        }
    });

    // RENDER RESULTS
    function renderSearchResults(contents) {
        searchResults.innerHTML = "";

        // === Render all content cards ===
        contents.forEach((item) => {
            const card = document.createElement("div");
            card.classList.add("card", "card--outline");
            card.innerHTML = `
                <div class="card-content">
                    <div class="card-text">
                        <h3>${item.title}</h3>
                        <p><strong>Type:</strong> ${item.type}</p>
                        <p><strong>Year:</strong> ${item.releaseYear || "—"}</p>
                        <button class="btn--subtle edit-btn" data-id="${
                            item.id
                        }">Edit</button>
                    </div>
                    ${
                        item.posterUrl
                            ? `<div class="card-thumb">
                                    <img src="${item.posterUrl}" alt="${item.title} poster" />
                               </div>`
                            : ""
                    }
                </div>
            `;
            searchResults.appendChild(card);
        });

        // === "Close Results" button ===
        const closeBtn = document.createElement("button");
        closeBtn.textContent = "✕ Close";
        closeBtn.className = "btn--subtle btn--small close-results-btn";
        closeBtn.addEventListener("click", () => {
            searchResults.innerHTML = "";
            contentDetailsContainer.classList.add("hidden");
            searchInput.value = ""; // clear search bar
        });
        searchResults.appendChild(closeBtn);

        // === Attach listeners to Edit buttons ===
        document.querySelectorAll(".edit-btn").forEach((btn) =>
            btn.addEventListener("click", async (e) => {
                e.stopPropagation();
                const id = e.currentTarget.dataset.id;
                await openEditForm(id);
            })
        );
    }

    // EDIT FORM (use getContentById API)
    async function openEditForm(id) {
        try {
            showSpinner();

            const res = await getContentByIdService(id);
            const content = res.content;

            contentDetailsContainer.innerHTML = `
            <h3>Edit: ${content.title}</h3>
            <form id="edit-content-form">
                <input type="hidden" name="type" value="${content.type}" />
                ${getFieldsForType(content.type)}
                <div class="form-actions">
                    <button type="submit" class="btn--cta">Save Changes</button>
                    <button type="button" id="cancelEditBtn" class="btn--subtle">Cancel</button>
                    <button type="button" id="deleteContentBtn" class="btn--danger">Delete</button>
                </div>
            </form>
        `;

            contentDetailsContainer.classList.remove("hidden");
            initGenreDropdown();

            Object.entries(content).forEach(([key, value]) => {
                const input = contentDetailsContainer.querySelector(
                    `[name="${key}"]`
                );
                if (!input) return;

                // handle array fields like actors, directors, genres, language
                if (Array.isArray(value)) {
                    input.value = value.join(", ");
                } else if (typeof value === "object" && value !== null) {
                    return;
                } else {
                    input.value = value ?? "";
                }
            });

            if (Array.isArray(content.genres) && content.genres.length > 0) {
                const hiddenInput = document.getElementById("genres-hidden");
                const selectedBox = document.getElementById("selected-genres");
                selectedBox.innerHTML = "";
                content.genres.forEach((g) => {
                    const tag = document.createElement("div");
                    tag.className = "tag";
                    tag.innerHTML = `${g} <span>×</span>`;
                    selectedBox.appendChild(tag);
                });
                hiddenInput.value = JSON.stringify(content.genres);
            }

            const editForm = document.getElementById("edit-content-form");
            const deleteBtn = document.getElementById("deleteContentBtn");
            const cancelBtn = document.getElementById("cancelEditBtn");

            if (editForm) {
                editForm.addEventListener("submit", (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleSaveEdit(e, id);
                });
            }

            if (deleteBtn) {
                deleteBtn.addEventListener("click", (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleDeleteContent(id);
                });
            }

            if (cancelBtn) {
                cancelBtn.addEventListener("click", (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    contentDetailsContainer.classList.add("hidden");
                });
            }
        } catch (error) {
            console.error("Failed to load content for editing:", error);
            showError("Failed to load content.");
        } finally {
            hideSpinner();
        }
    }

    // DELETE CONTENT
    async function handleDeleteContent(id) {
        const confirmDelete = confirm(
            "Are you sure you want to delete this content?"
        );
        if (!confirmDelete) return;

        try {
            showSpinner();
            await deleteContentService(id);

            showSuccess("Content deleted successfully!");

            contentDetailsContainer.classList.add("hidden");

            // Remove the deleted content's card from the search results
            const cardToRemove = document
                .querySelector(`.edit-btn[data-id="${id}"]`)
                ?.closest(".card");

            if (cardToRemove) cardToRemove.remove();

            // Clear search input field
            const searchInput = document.getElementById("searchTitle");
            if (searchInput) searchInput.value = "";

            // Clear search results container
            searchResults.innerHTML = "";
        } catch (error) {
            console.error("Delete failed:", error);

            const serverMessage =
                error.response?.data?.message ||
                error.message ||
                "Failed to delete content.";

            showError(serverMessage);
        } finally {
            hideSpinner();
        }
    }

    // === UPDATE (EDIT) EXISTING CONTENT ===
    async function handleSaveEdit(e, id) {
        e.preventDefault();
        e.stopPropagation();

        try {
            showSpinner();

            // Convert form data to object
            const form = e.target;
            const updatedData = formContentToJSON(form);

            // Ensure type is always included
            const typeInput = form.querySelector('input[name="type"]');
            if (typeInput && typeInput.value) {
                updatedData.type = typeInput.value;
            }

            // Remove empty fields to avoid overwriting existing data
            Object.keys(updatedData).forEach((key) => {
                const val = updatedData[key];
                if (
                    val === "" ||
                    val === null ||
                    (Array.isArray(val) && val.length === 0)
                ) {
                    delete updatedData[key];
                }
            });

            // Convert comma-separated string fields into arrays
            ["actors", "directors", "genres", "language"].forEach((field) => {
                if (
                    updatedData[field] &&
                    typeof updatedData[field] === "string"
                ) {
                    updatedData[field] = updatedData[field]
                        .split(",")
                        .map((s) => s.trim())
                        .filter(Boolean);
                }
            });

            console.log("Updating content:", id, updatedData);

            // Send update request to server
            const res = await updateContentService(id, updatedData);

            // Feedback and refresh
            showSuccess(res.message || "Content updated successfully!");
            document.getElementById("searchBtn").click();
            contentDetailsContainer.classList.add("hidden");
        } catch (error) {
            console.error("Update failed:", error);

            const serverMessage =
                error.response?.data?.message ||
                error.message ||
                "Failed to update content.";

            showError(serverMessage);
        } finally {
            hideSpinner();
        }
    }
};
