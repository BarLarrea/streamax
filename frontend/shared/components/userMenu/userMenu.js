import { logoutUser } from "../../../services/authService.js";
import { showSuccess, showError } from "../../../utils/notifications.js";

export const initUserMenu = () => {
    const avatar = document.getElementById("user-avatar");
    const dropdown = document.getElementById("user-dropdown");
    const logoutBtn = document.getElementById("logout-btn");
    const adminDashboardLink = document.querySelector(".admin-dashboard-ref");

    if (avatar && dropdown) {
        const toggleDropdown = (e) => {
            e.stopPropagation();
            dropdown.classList.toggle("show");
        };

        const closeDropdown = (e) => {
            if (!dropdown.contains(e.target) && !avatar.contains(e.target)) {
                dropdown.classList.remove("show");
            }
        };

        avatar.addEventListener("click", toggleDropdown);
        document.addEventListener("click", closeDropdown, { once: true });
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

    const user = JSON.parse(localStorage.getItem("user"));
    if (adminDashboardLink) {
        adminDashboardLink.style.display =
            user && user.isAdmin ? "block" : "none";
    }
};
