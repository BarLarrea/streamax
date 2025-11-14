import { logoutUser } from "../../../services/authService.js";
import { showSuccess, showError } from "../../../utils/notifications.js";

export const initProfileMenu = () => {
    const avatar = document.getElementById("profile-avatar");
    const dropdown = document.getElementById("profile-dropdown");
    const logoutBtn = document.getElementById("logout-btn");

    // === Set profile image  ===
    try {
        const storedAvatar = localStorage.getItem("profileAvatar");
        if (storedAvatar && avatar) {
            avatar.src = storedAvatar;
        }
    } catch (err) {
        console.warn("No profileAvatar found in localStorage.");
    }

    // === Toggle dropdown ===
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
        document.addEventListener("click", closeDropdown);
    }

    // === Handle logout ===
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
