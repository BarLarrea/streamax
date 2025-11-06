import loadComponent from "../../../utils/loadComponent.js";

const loadHeader = async (currentPage) => {
    await loadComponent(
        "#app-header",
        "./shared/components/header/header.html",
        "./shared/components/header/header.css"
    );

    const module = await import("./header.js");
    module.initHeaderMenu(currentPage);
};

export default loadHeader;
