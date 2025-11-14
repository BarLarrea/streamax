import loadPage from "../../utils/loadPage.js";
import { initEditUserPage } from "./editUser.js";

const loadEditUserPage = async () => {
    await loadPage(
        "./pages/editUser/editUser.html",
        "./pages/editUser/editUser.css"
    );
    initEditUserPage();
};

export default loadEditUserPage;
