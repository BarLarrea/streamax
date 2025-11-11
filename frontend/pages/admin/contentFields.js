export function initGenreDropdown() {
    const dropdown = document.getElementById("genres-dropdown");
    if (!dropdown) return;

    const optionsBox = document.getElementById("genres-options");
    const selectedBox = document.getElementById("selected-genres");
    const hiddenInput = document.getElementById("genres-hidden");

    dropdown.addEventListener("click", () => {
        optionsBox.classList.toggle("hidden");
    });

    optionsBox.querySelectorAll(".option").forEach((option) => {
        option.addEventListener("click", (e) => {
            e.stopPropagation();
            const value = option.dataset.value;

            // avoid duplicates
            const current = hiddenInput.value.split(",").filter(Boolean);
            if (!current.includes(value)) {
                const tag = document.createElement("div");
                tag.className = "tag";
                tag.innerHTML = `${value} <span>×</span>`;
                tag.querySelector("span").addEventListener("click", () => {
                    tag.remove();
                    updateHidden();
                });
                selectedBox.appendChild(tag);
                updateHidden();
            }
        });
    });

    function updateHidden() {
        const selected = Array.from(selectedBox.querySelectorAll(".tag")).map(
            (t) => t.textContent.replace("×", "").trim()
        );
        hiddenInput.value = JSON.stringify(selected);
    }

    document.addEventListener("click", (e) => {
        if (!dropdown.contains(e.target)) {
            optionsBox.classList.add("hidden");
        }
    });
}

//======================================================//

export function getFieldsForType(type) {
    const genres = [
        "Action",
        "Adventure",
        "Comedy",
        "Drama",
        "Fantasy",
        "Horror",
        "Mystery",
        "Romance",
        "Documentary",
        "Animation",
        "Crime",
        "Family"
    ];

    const genresDropdown = `
        <div class="form-group">
            <label>Genres</label>
            <div class="custom-dropdown" id="genres-dropdown">
                <div class="selected-genres" id="selected-genres"></div>
                <div class="dropdown-arrow">▼</div>
                <div class="options hidden" id="genres-options">
                    ${genres
                        .map(
                            (g) =>
                                `<div class="option" data-value="${g}">${g}</div>`
                        )
                        .join("")}
                </div>
            </div>
            <input type="hidden" name="genres" id="genres-hidden" required />
            <small>Select at least one genre</small>
        </div>
    `;

    switch (type) {
        // ===== MOVIE =====
        case "movie":
            return `
                <div class="form-group">
                    <label>Title</label>
                    <input name="title" type="text" placeholder="Enter the movie title" required />
                </div>

                <div class="form-group">
                    <label>Description</label>
                    <textarea name="description" required></textarea>
                </div>

                ${genresDropdown}

                <div class="form-group">
                    <label>Duration (seconds)</label>
                    <input name="duration" type="number" min="1" placeholder="e.g. 5400 for 1.5h" required />
                </div>

                <div class="form-group">
                    <label>Video URL</label>
                    <input name="videoUrl" type="text" placeholder="https://..." required />
                </div>

                <div class="form-group">
                    <label>Poster URL</label>
                    <input name="posterUrl" type="text" placeholder="https://..." />
                </div>

                <div class="form-group">
                    <label>Trailer URL</label>
                    <input name="trailerUrl" type="text" placeholder="optional" />
                </div>

                <div class="form-group">
                    <label>Release Year</label>
                    <input name="releaseYear" type="number" min="1900" max="${new Date().getFullYear()}" required />
                </div>
            `;

        // ===== SERIES =====
        case "series":
            return `
                <div class="form-group">
                    <label>Title</label>
                    <input name="title" type="text" placeholder="Enter the series title" required />
                </div>

                <div class="form-group">
                    <label>Description</label>
                    <textarea name="description" required></textarea>
                </div>

                ${genresDropdown}

                <div class="form-group">
                    <label>Release Year</label>
                    <input name="releaseYear" type="number" min="1900" max="${new Date().getFullYear()}" required />
                </div>

                <div class="form-group">
                    <label>Poster URL</label>
                    <input name="posterUrl" type="text" placeholder="https://..." />
                </div>

                <div class="form-group">
                    <label>Trailer URL</label>
                    <input name="trailerUrl" type="text" placeholder="optional" />
                </div>
            `;

        // ===== SEASON =====
        case "season":
            return `
                <div class="form-group">
                    <label>Title</label>
                    <input name="title" type="text" placeholder="Enter the season title" required />
                </div>

                <div class="form-group">
                    <label>Series ID</label>
                    <input name="seriesId" type="text" placeholder="Parent series _id" required />
                </div>

                <div class="form-group">
                    <label>Season Number</label>
                    <input name="seasonNumber" type="number" min="1" max="100" required />
                </div>

                <div class="form-group">
                    <label>Release Year</label>
                    <input name="releaseYear" type="number" min="1900" max="${new Date().getFullYear()}" required />
                </div>

                <div class="form-group">
                    <label>Trailer URL</label>
                    <input name="trailerUrl" type="text" placeholder="optional" />
                </div>
            `;

        // ===== EPISODE =====
        case "episode":
            return `
                <div class="form-group">
                    <label>Title</label>
                    <input name="title" type="text" placeholder="Enter the episode title" required />
                </div>

                <div class="form-group">
                    <label>Series ID</label>
                    <input name="seriesId" type="text" placeholder="Parent series _id" required />
                </div>

                <div class="form-group">
                    <label>Season ID</label>
                    <input name="seasonId" type="text" placeholder="Parent season _id" required />
                </div>

                <div class="form-group">
                    <label>Episode Number</label>
                    <input name="episodeNumber" type="number" min="1" max="200" required />
                </div>

                <div class="form-group">
                    <label>Duration (seconds)</label>
                    <input name="duration" type="number" min="1" placeholder="e.g. 1800 for 30 min" required />
                </div>

                <div class="form-group">
                    <label>Video URL</label>
                    <input name="videoUrl" type="text" placeholder="https://..." required />
                </div>

                <div class="form-group">
                    <label>Description</label>
                    <textarea name="description"></textarea>
                </div>

                <div class="form-group">
                    <label>Poster URL</label>
                    <input name="posterUrl" type="text" placeholder="https://..." />
                </div>
            `;

        // ===== COLLECTION =====
        case "collection":
            return `
                <div class="form-group">
                    <label>Collection Title</label>
                    <input name="title" type="text" placeholder="Enter the collection title" required />
                </div>
            `;

        default:
            return "";
    }
}
