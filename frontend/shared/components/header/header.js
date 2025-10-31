export const initHeaderMenu = () => {
    const menuToggle = document.querySelector(".menu-toggle");
    const nav = document.querySelector(".nav");

    if (!menuToggle || !nav) return;

    menuToggle.addEventListener("click", () => {
        nav.classList.toggle("open");

        menuToggle.classList.toggle("active");
        if (menuToggle.classList.contains("active")) {
            menuToggle.innerHTML = "&#10005;";
        } else {
            menuToggle.innerHTML = "&#9776;";
        }
    });

    nav.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => {
            nav.classList.remove("open");
            menuToggle.classList.remove("active");
            menuToggle.innerHTML = "&#9776;";
        });
    });
};

initHeaderMenu();
