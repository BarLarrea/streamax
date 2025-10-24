import loadHeader from "./shared/components/header/index.js";
import loadFooter from "./shared/components/footer/index.js";
import loadPage from "./utils/loadPage.js";

const initApp = async () => {
    await loadHeader();
    await loadFooter();

    await loadPage("./pages/home/home.html", "./pages/home/home.css");
};

document.addEventListener("DOMContentLoaded", initApp);
