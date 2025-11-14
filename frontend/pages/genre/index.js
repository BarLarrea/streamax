import loadPage from "../../utils/loadPage.js";
import { initGenrePage } from "./genre.js";

const loadGenrePage = async () => {
    await loadPage("./pages/genre/genre.html", "./pages/genre/genre.css");
    initGenrePage();
};

export default loadGenrePage;
