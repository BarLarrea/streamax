import loadPage from "../../utils/loadPage.js";
import { initLoginPage } from "./login.js";

const loadLoginPage = async () => {
    await loadPage("./pages/login/login.html", "./styles/auth.css");
    initLoginPage();
};

export default loadLoginPage;
