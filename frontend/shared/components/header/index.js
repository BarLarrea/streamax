import loadComponent from "../../../utils/loadComponent.js";

const loadHeader = async () => {
    await loadComponent(
        "#app-header",
        "./shared/components/header/header.html",
        "./shared/components/header/header.css"
    );

    await import("./header.js");
};

export default loadHeader;
