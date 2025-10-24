const loadComponent = async (selector, htmlPath, cssPath) => {
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
};

export default loadComponent;
