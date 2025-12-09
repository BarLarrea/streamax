import loadComponent from "../../utils/loadComponent.js";
import { initProfileMenu } from "./profileMenu.js";

const loadProfileMenu = async () => {
    await loadComponent(
        ".header-right",
        "./components/profileMenu/profileMenu.html",
        "./components/profileMenu/profileMenu.css"
    );

    initProfileMenu();
};

export default loadProfileMenu;
