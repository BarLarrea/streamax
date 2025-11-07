const componentCache = new Map();
const loadedCSS = new Set();

const loadComponent = async (selector, htmlPath, cssPath) => {
    try {
        if (!selector || !htmlPath) {
            throw new Error("Selector and HTML path are required");
        }

        const container = document.querySelector(selector);
        if (!container) {
            throw new Error(`Container not found for selector: ${selector}`);
        }

        let htmlContent;

        if (componentCache.has(htmlPath)) {
            htmlContent = componentCache.get(htmlPath);
        } else {
            htmlContent = await fetch(htmlPath).then((res) => res.text());
            componentCache.set(htmlPath, htmlContent);
        }

        container.innerHTML = htmlContent;

        if (cssPath && !loadedCSS.has(cssPath)) {
            const link = document.createElement("link");
            link.rel = "stylesheet";
            link.href = cssPath;
            document.head.appendChild(link);
            loadedCSS.add(cssPath);
        }

        // Ensure any dynamic content is rendered
        await new Promise((resolve) => requestAnimationFrame(resolve));
    } catch (err) {
        console.error(`Error loading component: ${htmlPath}`, err);
    }
};

export default loadComponent;
