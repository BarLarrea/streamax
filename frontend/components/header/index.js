import loadComponent from "../../utils/loadComponent.js";

const loadHeader = async (currentPage) => {
    await loadComponent(
        "#app-header",
        "./components/header/header.html",
        "./components/header/header.css"
    );

    const module = await import("./header.js");
    module.initAppHeader(currentPage);
};

export default loadHeader;
