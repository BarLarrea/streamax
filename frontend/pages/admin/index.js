import loadPage from "../../utils/loadPage.js";
import { initAdminPage } from "./admin.js";

const loadAdminPage = async () => {
    await loadPage("./pages/admin/admin.html", "./pages/admin/admin.css");
    console.log("✅ Admin page loaded, now initializing logic...");

    initAdminPage();
};

export default loadAdminPage;
