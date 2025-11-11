import loadPage from "../../utils/loadPage.js";
import createProfile from "./createProfile.js";

const loadCreateProfilePage = async () => {
    await loadPage(
        "./pages/createProfile/createProfile.html",
        "./pages/createProfile/createProfile.css"
    );

    createProfile();
};

export default loadCreateProfilePage;
