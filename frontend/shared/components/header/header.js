import { logoutUser } from "../../../services/authService.js";
import { showSuccess, showError } from "../../../utils/notifications.js";
import loadUserAccountBar from "../userAccountBar/index.js";

export const initHeaderMenu = async (currentPage) => {
    const menuToggle = document.querySelector(".menu-toggle");
    const nav = document.querySelector(".nav");

    if (!menuToggle || !nav) return;

    const nonNavBarPages = ["createProfile"];

    if (nonNavBarPages.includes(currentPage)) {
        nav.classList.add("hidden");
        menuToggle.classList.add("hidden");
    } else {
        nav.classList.remove("hidden");
        menuToggle.classList.remove("hidden");
    }

    if (currentPage === "profiles") {
        const user = JSON.parse(localStorage.getItem("user")) || {};
        console.log("User data for account bar:", user);

        await loadUserAccountBar(user);
    }

    menuToggle.addEventListener("click", () => {
        nav.classList.toggle("open");
    });

    nav.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => {
            nav.classList.remove("open");
        });
    });

    // Close nav when clicking outside
    document.addEventListener("click", (e) => {
        const isClickInsideNav = nav.contains(e.target);
        const isClickOnToggle = menuToggle.contains(e.target);
        if (!isClickInsideNav && !isClickOnToggle) {
            nav.classList.remove("open");
        }
    });

    // Handle user dropdown menu
    const avatar = document.getElementById("user-avatar");
    const dropdown = document.getElementById("user-dropdown");
    const logoutBtn = document.getElementById("logout-btn");

    if (avatar && dropdown) {
        avatar.addEventListener("click", (e) => {
            e.stopPropagation(); // prevent closing immediately
            dropdown.classList.toggle("show");
        });

        // close dropdown if clicking outside
        document.addEventListener("click", (e) => {
            if (!dropdown.contains(e.target) && !avatar.contains(e.target)) {
                dropdown.classList.remove("show");
            }
        });
    }

    if (logoutBtn) {
        logoutBtn.addEventListener("click", async () => {
            try {
                await logoutUser();
                localStorage.clear();
                showSuccess("Logged out successfully.");
                window.location.hash = "#/login";
            } catch (error) {
                console.error("Logout failed:", error);
                showError("Logout failed. Please try again.");
            }
        });
    }
};
