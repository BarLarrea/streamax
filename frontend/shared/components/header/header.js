import loadNavBar from "../navBar/index.js";
import loadUserMenu from "../userMenu/index.js";

export const initAppHeader = async (currentPage) => {
    const nonNavPages = ["profiles", "create-profile"];
    const userMenuPages = ["profiles", "create-profile"]; // mabe will add more pages later

    if (!nonNavPages.includes(currentPage)) {
        await loadNavBar();
    }

    if (userMenuPages.includes(currentPage)) {
        await loadUserMenu();
    }
};
