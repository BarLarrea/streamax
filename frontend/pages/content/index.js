import loadPage from "../../utils/loadPage.js";
import { initContentPage } from "./content.js";

const loadContentPage = async () => {
    await loadPage(
        "./pages/content/content.html",
        "./pages/content/content.css"
    );
    initContentPage();
};

export default loadContentPage;
