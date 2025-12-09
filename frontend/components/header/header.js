import loadNavBar from "../navBar/index.js";
import loadUserMenu from "../userMenu/index.js";
import loadProfileMenu from "../profileMenu/index.js";

export const initAppHeader = async (currentPage) => {
    const userLevelPages = [
        "profiles",
        "create-profile",
        "edit-user",
        "edit-profile",
        "admin-page"
    ]; // Use user menu without nav bar

    if (userLevelPages.includes(currentPage)) {
        loadUserMenu();
    } else {
        loadProfileMenu();
        loadNavBar();
    }
};
