import loadComponent from "../../../utils/loadComponent.js";
import { initProfileMenu } from "./profileMenu.js";

const loadProfileMenu = async () => {
    await loadComponent(
        ".header-right",
        "./shared/components/profileMenu/profileMenu.html",
        "./shared/components/profileMenu/profileMenu.css"
    );

    initProfileMenu();
};

export default loadProfileMenu;
