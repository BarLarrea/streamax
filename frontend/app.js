import loadHeader from "./shared/components/header/index.js";
import loadFooter from "./shared/components/footer/index.js";
import loadLoginPage from "./pages/login/index.js";
import loadRegisterPage from "./pages/register/index.js";
import loadProfilesPage from "./pages/profiles/index.js";

function getCurrentPage() {
    const hash = window.location.hash || "#/login";
    return hash.replace("#/", "");
}

const initApp = async () => {
    const currentPage = getCurrentPage();
    console.log("Current page:", currentPage);

    const noLayoutPages = ["login", "register"];

    if (!noLayoutPages.includes(currentPage)) {
        await loadHeader();
        await loadFooter();
    }

    switch (currentPage) {
        case "login":
            await loadLoginPage();
            break;
        case "register":
            await loadRegisterPage();
            break;
        case "profiles":
            await loadProfilesPage();
            break;
        case "home":
            await loadHomePage();
            break;
        default:
            console.warn(`No handler for page: ${currentPage}`);
            break;
    }
};

document.addEventListener("DOMContentLoaded", initApp);
window.addEventListener("hashchange", initApp);
