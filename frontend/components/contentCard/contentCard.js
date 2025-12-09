export function initContentCard(element, content, opts = {}) {
    if (!element || !content) return;

    const {
        _id,
        title,
        type,
        description = "",
        posterUrl = "assets/posters/defaultPoster.png",
        duration
    } = content;

    const {
        clickable = true,
        progressSeconds,
        durationSeconds = duration,
        showContinueButton = false,
        onContinue
    } = opts;

    // Fill in the card details
    element.querySelector(".poster").src = posterUrl;
    element.querySelector(".poster").alt = title;
    element.querySelector(".type-pill").textContent = type;
    element.querySelector(".title").textContent = title;
    element.querySelector(".name").textContent = title;
    element.querySelector(".type").textContent = type;
    element.querySelector(".desc").textContent =
        description || "No description available.";

    // Handle Continue button
    const continueBtn = element.querySelector(".continue-btn");
    if (showContinueButton) {
        continueBtn.classList.remove("hidden");
        continueBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            if (typeof onContinue === "function") onContinue(content);
        });
    }

    // Handle progress bar
    if (
        typeof progressSeconds === "number" &&
        typeof durationSeconds === "number" &&
        durationSeconds > 0
    ) {
        const progress = element.querySelector(".progress");
        const bar = element.querySelector(".bar");
        progress.classList.remove("hidden");
        const percent = Math.min(
            100,
            (progressSeconds / durationSeconds) * 100
        );
        bar.style.width = `${percent}%`;
    }

    // Handle click navigation
    if (clickable) {
        element.addEventListener("click", (e) => {
            const isContinue = e.target.closest(".continue-btn");
            if (isContinue) return;
            window.location.hash = `#/content/${_id}`;
        });
    }
}
