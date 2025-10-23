async function loadComponent(selector, htmlPath, cssPath) {
    try {
        if (!selector || !htmlPath || !cssPath) {
            throw new Error("Selector and HTML path and CSS path are required");
        }
        const html = await fetch(htmlPath).then((res) => res.text());
        document.querySelector(selector).innerHTML = html;

        if (cssPath) {
            const link = document.createElement("link");
            link.rel = "stylesheet";
            link.href = cssPath;
            document.head.appendChild(link);
        }
    } catch (err) {
        console.error(`Error loading component: ${htmlPath}`, err);
    }
}

async function loadPage(htmlPath, cssPath) {
    try {
        const html = await fetch(htmlPath).then((res) => res.text());
        const main = document.querySelector("#app-main");
        main.innerHTML = html;

        if (cssPath) {
            const link = document.createElement("link");
            link.rel = "stylesheet";
            link.href = cssPath;
            document.head.appendChild(link);
        }

        console.log(`Loaded page: ${htmlPath}`);
    } catch (err) {
        console.error(`Error loading page ${htmlPath}`, err);
    }
}

async function initApp() {
    await loadComponent(
        "#app-header",
        "shared/components/header/header.html",
        "shared/components/header/header.css"
    );
    await loadComponent(
        "#app-footer",
        "./shared/components/footer/footer.html",
        "./shared/components/footer/footer.css"
    );

    await loadPage("./pages/home/home.html", "./pages/home/home.css");
}

document.addEventListener("DOMContentLoaded", initApp);
