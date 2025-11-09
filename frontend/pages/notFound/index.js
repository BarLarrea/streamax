import loadPage from "../../utils/loadPage.js";

const loadNotFoundPage = async () => {
    await loadPage(
        "./pages/notFound/notFound.html",
        "./pages/notFound/notFound.css"
    );
};

export default loadNotFoundPage;
