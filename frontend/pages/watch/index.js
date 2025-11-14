import loadPage from "../../utils/loadPage.js";
import { initWatchPage } from "./watch.js";

const loadWatchPage = async () => {
    await loadPage("./pages/watch/watch.html", "./pages/watch/watch.css");

    await new Promise((r) => setTimeout(r, 0));

    initWatchPage();
};

export default loadWatchPage;
