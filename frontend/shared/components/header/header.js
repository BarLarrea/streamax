import loadNavBar from "../navBar/index.js";
import loadUserAccountBar from "../userAccountBar/index.js";
import { logoutUser } from "../../../services/authService.js";
import { showSuccess, showError } from "../../../utils/notifications.js";

export const initHeaderMenu = async (currentPage) => {
    const nonNavPages = ["profiles", "create-profile"];

    if (!nonNavPages.includes(currentPage)) {
        await loadNavBar();
    }

    const avatar = document.getElementById("user-avatar");
    const dropdown = document.getElementById("user-dropdown");
    const logoutBtn = document.getElementById("logout-btn");

    if (avatar && dropdown) {
        avatar.addEventListener("click", (e) => {
            e.stopPropagation();
            dropdown.classList.toggle("show");
        });

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
