import { getFieldsForType, initGenreDropdown } from "./contentFields.js";
import { formContentToJSON } from "../../utils/formContentToJSON.js";
import { showSuccess, showError } from "../../utils/notifications.js";
import {
    createContentService,
    searchContentService,
    updateContentService
} from "../../services/contentService.js";

export const initAdminPage = async () => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (user && !user.isAdmin) {
        showError("Access denied: Admins only.");
        setTimeout(() => {
            window.location.hash = "#/profiles";
        }, 300);
        return;
    }

    const typeSelect = document.getElementById("type");
    const dynamicFields = document.getElementById("dynamic-fields");
    const form = document.getElementById("add-content-form");

    // --- Dynamic create form ---
    typeSelect.addEventListener("change", () => {
        const type = typeSelect.value;
        dynamicFields.innerHTML = getFieldsForType(type);
        initGenreDropdown();
    });

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const contentData = formContentToJSON(form);
        console.log("Final contentData before POST:", contentData);
        console.log("Is FormData?", contentData instanceof FormData);

        try {
            await createContentService(contentData);
            showSuccess("Content created successfully!");
            form.reset();
            dynamicFields.innerHTML = "";
        } catch (err) {
            console.error(err);
            showError("Failed to create content.");
        }
    });

    // --- Search + Edit section ---
    const searchInput = document.getElementById("searchTitle");
    const searchBtn = document.getElementById("searchBtn");
    const searchResults = document.getElementById("searchResults");
    const editFormContainer = document.getElementById("editFormContainer");

    searchBtn.addEventListener("click", async () => {
        const query = searchInput.value.trim();
        if (!query) {
            showError("Please enter a title to search.");
            return;
        }

        try {
            const results = await searchContentService(query);
            renderSearchResults(results);
        } catch (err) {
            console.error(err);
            showError("Failed to search content.");
        }
    });

    // --- Render results ---
    function renderSearchResults(results) {
        searchResults.innerHTML = "";
        editFormContainer.innerHTML = "";

        if (!results || results.length === 0) {
            searchResults.innerHTML = `<p>No content found.</p>`;
            return;
        }

        results.forEach((item) => {
            const card = document.createElement("div");
            card.classList.add("card", "card--outline");

            card.innerHTML = `
                <h3>${item.title}</h3>
                <p><strong>Type:</strong> ${item.type}</p>
                <p><strong>Year:</strong> ${item.releaseYear || "—"}</p>
                <button class="btn--subtle edit-btn" data-id="${
                    item._id
                }">Edit</button>
            `;
            searchResults.appendChild(card);
        });

        // Add listeners to Edit buttons
        document.querySelectorAll(".edit-btn").forEach((btn) => {
            btn.addEventListener("click", async (e) => {
                const id = e.target.dataset.id;
                const item = results.find((r) => r._id === id);
                openEditForm(item);
            });
        });
    }

    // --- Render Edit Form ---
    function openEditForm(item) {
        editFormContainer.innerHTML = `
            <div class="card admin-section">
                <h2>Edit: ${item.title}</h2>
                <form id="edit-content-form">
                    <div class="form-group">
                        <label for="editTitle">Title</label>
                        <input id="editTitle" name="title" type="text" value="${
                            item.title
                        }" required />
                    </div>

                    <div class="form-group">
                        <label for="editDescription">Description</label>
                        <textarea id="editDescription" name="description">${
                            item.description || ""
                        }</textarea>
                    </div>

                    <div class="form-group">
                        <label for="editGenres">Genres</label>
                        <input id="editGenres" name="genres" type="text" value="${(
                            item.genres || []
                        ).join(", ")}" />
                    </div>

                    <button type="submit" class="btn--cta">Save Changes</button>
                </form>
            </div>
        `;

        const editForm = document.getElementById("edit-content-form");
        editForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const updatedData = {
                title: document.getElementById("editTitle").value.trim(),
                description: document
                    .getElementById("editDescription")
                    .value.trim(),
                genres: document
                    .getElementById("editGenres")
                    .value.split(",")
                    .map((g) => g.trim())
            };

            try {
                await updateContentService(item._id, updatedData);
                showSuccess("Content updated successfully!");
                editFormContainer.innerHTML = "";
                searchBtn.click(); // Refresh results
            } catch (err) {
                console.error(err);
                showError("Failed to update content.");
            }
        });
    }
};
