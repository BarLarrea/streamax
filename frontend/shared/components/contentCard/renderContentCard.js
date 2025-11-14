export function renderContentCard(content, opts = {}) {
    console.log("renderContentCard received:", content);

    const {
        id,
        title,
        type,
        description = "",
        posterUrl = "assets/posters/defaultPoster.png",
        rating = null,
        duration
    } = content;

    const {
        clickable = true,
        viewState = "new", // "new" | "in_progress" | "completed"
        progressSeconds = 0,
        durationSeconds = duration,
        onContinue
    } = opts;

    const card = document.createElement("article");
    card.className = "content-card";
    card.tabIndex = 0;

    // Determine button text based on viewState
    let buttonLabel = "Watch Now";
    if (viewState === "in_progress") buttonLabel = "Continue";
    else if (viewState === "completed") buttonLabel = "Watch Again";

    // Card HTML
    card.innerHTML = `
        <div class="thumb">
            <img class="poster" src="${posterUrl}" alt="${title}" loading="lazy" />
            <div class="overlay">
                <div class="meta">
                    <span class="type-pill">${type}</span>
                    <h3 class="title">${title}</h3>
                    <p class="desc">${
                        description || "No description available."
                    }</p>
                    ${rating ? `<p class="rating">IMDb ${rating}</p>` : ""}
                    <button class="card-btn continue-btn">${buttonLabel}</button>
                </div>
            </div>
        </div>
        <div class="info">
            <span class="type">${type}</span>
            <h4 class="name">${title}</h4>
        </div>
        <div class="progress hidden">
            <div class="bar"></div>
        </div>
    `;

    // Handle progress bar (only for in_progress)
    if (viewState === "in_progress" && durationSeconds > 0) {
        const percent = Math.min(
            100,
            (progressSeconds / durationSeconds) * 100
        );
        const progress = card.querySelector(".progress");
        const bar = card.querySelector(".bar");
        progress.classList.remove("hidden");
        bar.style.width = `${percent}%`;
    }

    // Handle click behavior
    if (clickable) {
        card.addEventListener("click", (e) => {
            const isButton = e.target.closest(".continue-btn");
            if (isButton) return;
            window.location.hash = `#/content/${id}`;
        });
    }

    // Handle button click
    const btn = card.querySelector(".continue-btn");
    btn.addEventListener("click", (e) => {
        e.stopPropagation();
        if (typeof onContinue === "function") onContinue(content);
    });

    return card;
}
