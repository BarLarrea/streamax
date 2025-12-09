import loadComponent from "../../utils/loadComponent.js";

const loadFooter = async () => {
    await loadComponent(
        "#app-footer",
        "./components/footer/footer.html",
        "./components/footer/footer.css"
    );
};

export default loadFooter;
