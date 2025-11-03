import loadPage from "../../utils/loadPage.js";

const loadRegisterPage = async () => {
    await loadPage("./pages/register/register.html", "./styles/auth.css");
    await import("./register.js");
};

export default loadRegisterPage;
