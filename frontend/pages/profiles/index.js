import loadPage from "../../utils/loadPage.js";

const loadProfilesPage = async () => {
    await loadPage(
        "./pages/profiles/profiles.html",
        "./pages/profiles/profiles.css"
    );
    await import("./profiles.js");
};

export default loadProfilesPage;
