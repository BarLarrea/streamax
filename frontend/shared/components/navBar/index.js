import loadComponent from "../../../utils/loadComponent.js";

const loadNavBar = async () => {
    await loadComponent(
        ".header-slot",
        "./shared/components/navBar/navBar.html",
        "./shared/components/navBar/navBar.css"
    );

    const module = await import("./navBar.js");
    module.initNavBar();
};

export default loadNavBar;
