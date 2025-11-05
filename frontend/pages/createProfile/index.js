import loadePage from "../../utils/loadPage.js";
import createProfile from "./createProfile.js";

const loadCreateProfilePage = async () => {
    await loadePage(
        "./pages/createProfile/createProfile.html",
        "./pages/createProfile/createProfile.css"
    );

    createProfile();
};

export default loadCreateProfilePage;
