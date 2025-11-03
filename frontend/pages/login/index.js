import loadPage from "../../utils/loadPage.js";

const loadLoginPage = async () => {
    await loadPage("./pages/login/login.html", "./styles/auth.css");
    await import("./login.js");
};

export default loadLoginPage;
