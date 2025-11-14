import loadPage from "../../utils/loadPage.js";
import { initSearchPage } from "./search.js";

const loadSearchPage = async () => {
    await loadPage("./pages/search/search.html", "./pages/search/search.css");

    initSearchPage();
};

export default loadSearchPage;
