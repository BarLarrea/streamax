const loadPage = async (htmlPath, cssPath) => {
    try {
        if (!htmlPath) {
            throw new Error("HTML path is required");
        }

        const html = await fetch(htmlPath).then((res) => res.text());
        const main = document.querySelector("#app-main");
        main.innerHTML = html;

        await new Promise((resolve) => requestAnimationFrame(resolve));

        const oldPageCss = document.querySelector("link[data-page-style]");
        if (oldPageCss) oldPageCss.remove();

        if (cssPath) {
            await new Promise((resolve, reject) => {
                const link = document.createElement("link");
                link.rel = "stylesheet";
                link.href = cssPath;
                link.dataset.pageStyle = "true";
                link.onload = () => resolve();
                link.onerror = (err) =>
                    reject(new Error(`Failed to load CSS: ${cssPath}`, err));
                document.head.appendChild(link);
            });
        }

        console.log(` Loaded page: ${htmlPath}`);
        return true;
    } catch (err) {
        console.error(`Error loading page ${htmlPath}`, err);
        return false;
    }
};

export default loadPage;
