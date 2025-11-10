import loadPage from "../../utils/loadPage.js";
import { initEditProfilePage } from "./editProfile.js";

const loadEditProfilePage = async () => {
    await loadPage(
        "./pages/editProfile/editProfile.html",
        "./pages/editProfile/editProfile.css"
    );

    initEditProfilePage();
};

export default loadEditProfilePage;
