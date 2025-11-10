import loadNavBar from "../navBar/index.js";
import loadUserMenu from "../userMenu/index.js";

export const initAppHeader = async (currentPage) => {
    const nonNavPages = [
        "profiles",
        "create-profile",
        "edit-user",
        "edit-profile"
    ];
    const userMenuPages = [
        "profiles",
        "create-profile",
        "edit-user",
        "notFound",
        "edit-profile"
    ]; // mabe will add more pages later

    if (!nonNavPages.includes(currentPage)) {
        await loadNavBar();
    }

    if (userMenuPages.includes(currentPage)) {
        await loadUserMenu();
    }
};
