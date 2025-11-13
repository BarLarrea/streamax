import loadComponent from "../../../utils/loadComponent.js";
import { initContentCard } from "./contentCard.js";

const loadContentCard = async (selector, content, opts = {}) => {
    if (!selector) {
        console.error("No selector provided to loadContentCard");
        return;
    }

    await loadComponent(
        selector,
        "./shared/components/contentCard/contentCard.html",
        "./shared/components/contentCard/contentCard.css"
    );

    // Initialize card logic
    const container = document.querySelector(selector);
    const element = container?.querySelector(".content-card");

    element
        ? initContentCard(element, content, opts)
        : console.error("content-card element not found in container");
};

export default loadContentCard;
