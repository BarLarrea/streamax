export function initCarousel(rootElement) {
    if (!rootElement) return;

    const track = rootElement.querySelector(".carousel__track");
    const leftBtn = rootElement.querySelector(".carousel__arrow.left");
    const rightBtn = rootElement.querySelector(".carousel__arrow.right");

    if (!track) return;

    leftBtn?.addEventListener("click", () => {
        track.parentElement.scrollBy({ left: -400, behavior: "smooth" });
    });
    rightBtn?.addEventListener("click", () => {
        track.parentElement.scrollBy({ left: 400, behavior: "smooth" });
    });
}
