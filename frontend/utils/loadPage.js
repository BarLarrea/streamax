const loadPage = async (htmlPath, cssPath) => {
    try {
        if (!htmlPath) {
            throw new Error("HTML path is required");
        }

        const html = await fetch(htmlPath).then((res) => res.text());
        const main = document.querySelector("#app-main");
        main.innerHTML = html;

        // Remove previously loaded page-specific CSS (if any)
        const oldPageCss = document.querySelector("link[data-page-style]");
        if (oldPageCss) oldPageCss.remove();

        if (cssPath) {
            const link = document.createElement("link");
            link.rel = "stylesheet";
            link.href = cssPath;
            link.dataset.pageStyle = "true"; // mark as page-specific
            document.head.appendChild(link);
        }

        console.log(`Loaded page: ${htmlPath}`);
    } catch (err) {
        console.error(`Error loading page ${htmlPath}`, err);
    }
};

export default loadPage;
