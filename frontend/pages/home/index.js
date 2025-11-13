import loadPage from "../../utils/loadPage.js";
import { initHomePage } from "./home.js";

const loadHomePage = async () => {
    await loadPage("./pages/home/home.html", "./pages/home/home.css");
    initHomePage();
};

export default loadHomePage;
