import loadPage from "../../utils/loadPage.js";
import { initStatsPage } from "./stats.js";

const loadStatsPage = async () => {
    await loadPage("./pages/stats/stats.html", "./pages/stats/stats.css");

    initStatsPage();
};

export default loadStatsPage;
