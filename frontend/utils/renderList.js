export const renderList = (container, dataArray, createItemFunc) => {
    if (!container) {
        console.error("renderList: container element not found.");
        return;
    }

    container.innerHTML = "";

    dataArray.forEach((item) => {
        const element = createItemFunc(item);
        if (element) container.appendChild(element);
    });
};
