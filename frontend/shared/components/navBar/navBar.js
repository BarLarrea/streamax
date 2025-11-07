export const initNavBar = () => {
    const menuToggle = document.querySelector(".menu-toggle");
    const nav = document.querySelector(".nav");

    if (!menuToggle || !nav) return;

    // toggle for mobile
    menuToggle.addEventListener("click", () => {
        nav.classList.toggle("open");
    });

    // close menu on link click
    nav.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => {
            nav.classList.remove("open");
        });
    });

    // close nav when clicking outside
    document.addEventListener("click", (e) => {
        const isClickInsideNav = nav.contains(e.target);
        const isClickOnToggle = menuToggle.contains(e.target);
        if (!isClickInsideNav && !isClickOnToggle) {
            nav.classList.remove("open");
        }
    });
};
