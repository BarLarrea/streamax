import loadComponent from "../../utils/loadComponent.js";

const loadUserAccountBar = async (user) => {
    await loadComponent(
        ".header-slot",
        "./components/userAccountBar/userAccountBar.html",
        "./components/userAccountBar/userAccountBar.css"
    );

    const module = await import("./userAccountBar.js");
    module.userAccountBar(user);
};

export default loadUserAccountBar;
