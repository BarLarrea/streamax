import loadePage from "../../utils/loadPage.js";

const loadCreateProfilePage = async () => {
    await loadePage(
        "./pages/createProfile/createProfile.html",
        "./pages/createProfile/createProfile.css"
    );
};

export default loadCreateProfilePage;
