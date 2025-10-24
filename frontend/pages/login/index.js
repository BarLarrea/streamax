import loadPage from "../../utils/loadPage.js";

const loadLoginPage = async () => {
    await loadPage("./pages/login/login.html", "./shared/styles/auth.css");
    await import("./login.js");
};

export default loadLoginPage;
