import loadComponent from "../../utils/loadComponent.js";

const loadNavBar = async () => {
    await loadComponent(
        ".header-slot",
        "./components/navBar/navBar.html",
        "./components/navBar/navBar.css"
    );

    const module = await import("./navBar.js");
    module.initNavBar();
};

export default loadNavBar;
