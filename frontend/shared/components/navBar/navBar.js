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

    // initial activation
    updateActiveNavLink();

    // activation on route change
    window.addEventListener("hashchange", updateActiveNavLink);
};

function updateActiveNavLink() {
    const current = window.location.hash.replace("#/", "") || "home";

    document.querySelectorAll(".nav a").forEach((link) => {
        const href = link.getAttribute("href").replace("#/", "");

        if (href === current) {
            link.classList.add("active");
        } else {
            link.classList.remove("active");
        }
    });
}
