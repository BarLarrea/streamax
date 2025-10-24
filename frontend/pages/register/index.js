import loadPage from "../../utils/loadPage.js";

const loadRegisterPage = async () => {
    await loadPage(
        "./pages/register/register.html",
        "./shared/styles/auth.css"
    );
};

export default loadRegisterPage;
