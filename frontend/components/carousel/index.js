import loadComponent from "../../utils/loadComponent.js";
import { initCarousel } from "./carousel.js";

const loadCarousel = async (selector) => {
    if (!selector) {
        console.error("Carousel selector missing");
        return;
    }

    await loadComponent(
        selector,
        "./components/carousel/carousel.html",
        "./components/carousel/carousel.css"
    );

    const container = document.querySelector(selector);
    if (container) initCarousel(container);
};

export default loadCarousel;
