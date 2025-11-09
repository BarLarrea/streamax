import loadPage from "../../utils/loadPage.js";

const loadProfilesPage = async () => {
    await loadPage(
        "./pages/profiles/profiles.html",
        "./pages/profiles/profiles.css"
    );
    const module = await import("./profiles.js");
    await module.initProfilesPage();
};

export default loadProfilesPage;
