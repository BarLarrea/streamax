import loadComponent from "../../utils/loadComponent.js";

const loadUserMenu = async () => {
    await loadComponent(
        ".header-right",
        "./components/userMenu/userMenu.html",
        "./components/userMenu/userMenu.css"
    );

    const module = await import("./userMenu.js");
    module.initUserMenu();
};

export default loadUserMenu;
