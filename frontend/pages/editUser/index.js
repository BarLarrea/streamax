import loadPage from "../../utils/loadPage.js";

const loadEditUserPage = async () => {
    await loadPage(
        "./pages/editUser/editUser.html",
        "./pages/editUser/editUser.css"
    );
    const module = await import("./editUser.js");
    await module.initEditUserPage();
};

export default loadEditUserPage;
