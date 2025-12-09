import { logoutUser } from "../../services/authService.js";
import { showSuccess, showError } from "../../utils/notifications.js";

export const initProfileMenu = () => {
    const avatar = document.getElementById("profile-avatar");
    const dropdown = document.getElementById("profile-dropdown");
    const logoutBtn = document.getElementById("logout-btn");
    const manageProfilesBtn = document.getElementById("manage-profiles-btn");
    const switchList = document.getElementById("profile-switch-list");

    if (!avatar || !dropdown) return;

    // ===== Load user + profiles from storage =====
    let profiles = [];
    let activeProfileId = localStorage.getItem("profileId") || null;

    try {
        const user = JSON.parse(localStorage.getItem("user"));
        if (user && Array.isArray(user.profiles)) {
            profiles = user.profiles;
        }
    } catch (err) {
        console.warn("Failed to parse user from localStorage", err);
    }

    // If no active profile, fallback to first profile (if exists)
    if (!activeProfileId && profiles.length > 0) {
        activeProfileId = String(profiles[0].profileId);
        localStorage.setItem("profileId", activeProfileId);
    }

    // ===== Set avatar image according to active profile =====
    const activeProfile =
        profiles.find((p) => String(p.profileId) === String(activeProfileId)) ||
        profiles[0];

    if (activeProfile?.avatar) {
        avatar.src = activeProfile.avatar;
    }

    // ===== Build "Switch Profile" list =====
    if (switchList) {
        switchList.innerHTML = "";

        profiles.forEach((p) => {
            const isActive = String(p.profileId) === String(activeProfileId);

            const item = document.createElement("div");
            item.className = "profile-switch-item";
            item.dataset.profileId = p.profileId;

            item.innerHTML = `
                <img src="${p.avatar}" alt="${
                p.profileName
            }" class="switch-avatar" />
                <span class="switch-name">${p.profileName}</span>
                ${
                    isActive
                        ? '<span class="active-indicator">Current</span>'
                        : ""
                }
            `;

            item.addEventListener("click", (e) => {
                e.stopPropagation();

                // Update active profile in localStorage
                localStorage.setItem("profileId", p.profileId);
                localStorage.setItem("selectedProfile", JSON.stringify(p));

                // Update avatar in header
                avatar.src = p.avatar;

                // Navigate to home
                window.location.hash = "#/home";

                // Close dropdown
                dropdown.classList.remove("show");
            });

            switchList.appendChild(item);
        });

        // Add "Add Profile" item only if profiles.length < 5
        if (profiles.length < 5) {
            const addItem = document.createElement("div");
            addItem.className = "profile-switch-item add";
            addItem.innerHTML = `
                <span class="switch-name">+ Add Profile</span>
            `;

            addItem.addEventListener("click", (e) => {
                e.stopPropagation();
                dropdown.classList.remove("show");
                window.location.hash = "#/create-profile";
            });

            switchList.appendChild(addItem);
        }
    }

    // ===== Toggle dropdown (open/close) =====
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

    // ===== Manage Profiles button =====
    if (manageProfilesBtn) {
        manageProfilesBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            dropdown.classList.remove("show");
            window.location.hash = "#/profiles";
        });
    }

    // ===== Logout button =====
    if (logoutBtn) {
        logoutBtn.addEventListener("click", async (e) => {
            e.stopPropagation();
            try {
                await logoutUser();

                // If you want, you can be more selective here
                localStorage.clear();

                showSuccess("Logged out successfully.");
                window.location.hash = "#/login";
            } catch (error) {
                console.error("Logout failed:", error);
                showError("Logout failed. Please try again.");
            } finally {
                dropdown.classList.remove("show");
            }
        });
    }
};
