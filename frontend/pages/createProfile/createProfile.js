import { showError, showSuccess } from "../../utils/notifications.js";
import { createProfileService } from "../../services/profileService.js";

const createProfile = async () => {
    const avatars = document.querySelectorAll(".avatars-list img");
    let selectedAvatar = null;

    avatars.forEach((img) => {
        img.addEventListener("click", () => {
            avatars.forEach((i) => i.classList.remove("selected"));
            img.classList.add("selected");
            selectedAvatar = img.getAttribute("src"); // save image path
        });
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        const profileName = document.getElementById("profileName").value.trim();

        if (!profileName) {
            alert("Please enter a profile name.");
            return;
        }

        if (!selectedAvatar) {
            alert("Please select an avatar.");
            return;
        }

        try {
            const res = await createProfileService(profileName, selectedAvatar);

            const profile = res.data?.profile || {
                "problem with response data": "no profile data"
            };

            const user = localStorage.getItem("user");
            if (!user) {
                throw new Error("User not logged in");
            }

            const userData = JSON.parse(user);
            userData.profiles.push(profile);
            localStorage.setItem("user", JSON.stringify(userData));

            showSuccess("Profile created successfully!");
            window.location.hash = "#/profiles";
        } catch (error) {
            console.error("Error creating profile:", error);
            showError(
                error.response?.data?.message ||
                    "An error occurred while creating the profile."
            );
        }
    };

    document
        .querySelector(".submit-button")
        .addEventListener("click", handleSubmit);
};

export default createProfile;
