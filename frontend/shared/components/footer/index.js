import loadComponent from "../../../utils/loadComponent.js";

const loadFooter = async () => {
    await loadComponent(
        "#app-footer",
        "./shared/components/footer/footer.html",
        "./shared/components/footer/footer.css"
    );
};

export default loadFooter;
