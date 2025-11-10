import { showError, showSuccess } from "../../utils/notifications.js";
import { editProfile, deleteProfile } from "../../services/profileService.js";
import { showSpinner, hideSpinner } from "../../utils/loading.js";

let selectedAvatar = null;

export const initEditProfilePage = async () => {
    showSpinner();
    try {
        const profileNameInput = document.getElementById("profileName");
        const currentProfileImg = document.getElementById(
            "current-profile-picture"
        );

        const profile = JSON.parse(localStorage.getItem("selectedProfile"));

        // await new Promise((resolve) => setTimeout(resolve, 250));

        console.log("Editing profile:", profile);

        // === Load current profile data ===
        profileNameInput.value = profile.profileName || "";
        currentProfileImg.src = profile.avatar || "assets/profile/avatar0.png";

        handleAvatarSelection();
        handleToggleAvatarList();
        handleEditProfile(profile.profileId);
        handleDeleteProfile(profile.profileId);
    } finally {
        hideSpinner();
    }
};
/* ---------------- Avatar selection ---------------- */
function handleAvatarSelection() {
    const avatars = document.querySelectorAll(".avatars-list img");

    avatars.forEach((img) => {
        img.addEventListener("click", () => {
            avatars.forEach((i) => i.classList.remove("selected"));
            img.classList.add("selected");
            selectedAvatar = img.getAttribute("src");
        });
    });
}

/* ---------------- Toggle avatar list visibility ---------------- */
function handleToggleAvatarList() {
    const avatarsListContainer = document.getElementById(
        "avatars-list-container"
    );
    const toggleAvatarsBtn = document.getElementById("toggle-avatars-btn");
    toggleAvatarsBtn.addEventListener("click", () => {
        avatarsListContainer.classList.toggle("hidden");
    });
}

/* ---------------- Save changes ---------------- */
function handleEditProfile(profileId) {
    const editProfileForm = document.getElementById("edit-profile-form");
    const profileNameInput = document.getElementById("profileName");
    const avatars = document.querySelectorAll(".avatars-list img");
    editProfileForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const updatedName = profileNameInput.value.trim();
        const updatedAvatar = selectedAvatar || currentProfileImg.src;

        if (!updatedName) {
            showError("Please enter a profile name.");
            return;
        }

        try {
            const data = await editProfile(
                profileId,
                updatedName,
                updatedAvatar
            );
            if (data.success) {
                showSuccess("Profile updated successfully!");

                // Update selectedProfile in localStorage
                localStorage.setItem(
                    "selectedProfile",
                    JSON.stringify(data.profile)
                );

                // Update user's profiles in localStorage
                const user = JSON.parse(localStorage.getItem("user"));
                const updatedProfiles = user.profiles.map((p) =>
                    p.profileId === data.profile.profileId ? data.profile : p
                );

                user.profiles = updatedProfiles;

                localStorage.setItem("user", JSON.stringify(user));

                // Redirect to profiles page
                window.location.hash = "#/profiles";
            }
        } catch (error) {
            const message = error.response?.data?.message || error.message;
            showError(`Update failed: ${message}`);
        }
    });
}

/* ---------------- Delete profile ---------------- */
function handleDeleteProfile(profileId) {
    const deleteBtn = document.getElementById("delete-profile-btn");

    const modal = document.getElementById("delete-modal");
    const cancelBtn = modal.querySelector(".modal-cancel-btn");
    const confirmBtn = modal.querySelector(".modal-confirm-btn");

    // Open modal
    deleteBtn.addEventListener("click", () => {
        modal.classList.add("show");
    });

    // Close modal on Cancel
    cancelBtn.addEventListener("click", () => {
        modal.classList.remove("show");
    });

    // Close on background click
    modal.addEventListener("click", (e) => {
        if (e.target === modal) modal.classList.remove("show");
    });

    confirmBtn.addEventListener("click", async () => {
        try {
            const data = await deleteProfile(profileId);
            if (data.success) {
                showSuccess("Profile deleted successfully!");

                localStorage.removeItem("selectedProfile");
                const user = JSON.parse(localStorage.getItem("user"));
                const updatedProfiles = user.profiles.filter(
                    (p) => p.profileId !== profileId
                );
                user.profiles = updatedProfiles;
                localStorage.setItem("user", JSON.stringify(user));

                window.location.hash = "#/profiles";
            }
        } catch (error) {
            const message = error.response?.data?.message || error.message;
            showError(`Profile deletion failed: ${message}`);
        }
    });
}
