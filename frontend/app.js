import loadHeader from "./shared/components/header/index.js";
import loadFooter from "./shared/components/footer/index.js";
import loadLoginPage from "./pages/login/index.js";
import loadRegisterPage from "./pages/register/index.js";
import loadProfilesPage from "./pages/profiles/index.js";
import loadCreateProfilePage from "./pages/createProfile/index.js";
import loadNotFoundPage from "./pages/notFound/index.js";
import loadEditUserPage from "./pages/editUser/index.js";
import loadEditProfilePage from "./pages/editProfile/index.js";

function getCurrentPage() {
    const hash = window.location.hash || "#/login";
    return hash.replace("#/", "");
}

const initApp = async () => {
    showGlobalSpinner();
    try {
        // === CLEANUP: remove previous layout ===
        const header = document.querySelector("#app-header");
        const footer = document.querySelector("#app-footer");
        const main = document.querySelector("#app-main");

        if (main) main.innerHTML = "";

        const currentPage = getCurrentPage();
        console.log("Current page:", currentPage);

        const noLayoutPages = ["login", "register"];

        if (!noLayoutPages.includes(currentPage)) {
            header.style.display = "block";
            footer.style.display = "block";
            await loadHeader(currentPage);
            await loadFooter();
        } else {
            header.style.display = "none";
            footer.style.display = "none";
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
            case "create-profile":
                await loadCreateProfilePage();
                break;
            case "edit-user":
                await loadEditUserPage();
                break;
            case "edit-profile":
                await loadEditProfilePage();
                break;
            // case "home":
            //     await loadHomePage();
            //     break;
            default:
                await loadNotFoundPage();
                break;
        }
    } finally {
        hideGlobalSpinner();
    }
};

// ===== GLOBAL SPINNER CONTROL =====
function showGlobalSpinner() {
    const loader = document.getElementById("global-loader");
    if (loader) loader.style.display = "flex";
}

function hideGlobalSpinner() {
    const loader = document.getElementById("global-loader");
    if (loader) loader.style.display = "none";
}

// prevent multiple simultaneous navigations
let isNavigating = false;

window.addEventListener("hashchange", async () => {
    if (isNavigating) return;
    isNavigating = true;
    await initApp();
    isNavigating = false;
});

document.addEventListener("DOMContentLoaded", initApp);
