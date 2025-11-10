import { showError, showSuccess } from "../../utils/notifications.js";
import { editUser, changeUserPassword } from "../../services/userService.js";

export const initEditUserPage = async () => {
    const editForm = document.getElementById("edit-user-form");
    const editUserName = document.querySelector("#userName");
    const editUserEmail = document.querySelector("#email");

    console.log({ editUserEmail });

    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
        showError("User not found in session. Please log in again.");
        window.location.href = "#/login";
    }

    editUserName.value = user.userName.trim();
    editUserEmail.value = user.email.trim();

    editForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const updateduserName = editUserName.value;
        const updatedemail = editUserEmail.value;

        try {
            const data = await editUser(updateduserName, updatedemail);
            if (data.success) {
                showSuccess("User updated successfully!");
            }

            localStorage.setItem("user", JSON.stringify(data.user));
        } catch (error) {
            const message = error.response?.data?.message || error.message;
            showError(`Update failed: ${message}`);
        }
    });

    document.querySelectorAll(".toggle-password").forEach((btn) => {
        btn.addEventListener("click", () => {
            const input = btn.previousElementSibling;
            const isHidden = input.type === "password";
            input.type = isHidden ? "text" : "password";

            btn.classList.toggle("active", isHidden);

            const icon = btn.querySelector("i");
            icon.classList.toggle("bi-eye", !isHidden);
            icon.classList.toggle("bi-eye-slash", isHidden);
        });
    });

    const editPasswordForm = document.getElementById("change-password-form");

    editPasswordForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const currentPasswordInput = document.getElementById("currentPassword");
        const newPasswordInput = document.getElementById("newPassword");

        try {
            const data = await changeUserPassword(
                currentPasswordInput.value,
                newPasswordInput.value
            );

            console.log({ data });

            if (data.success) {
                showSuccess("Password changed successfully!");
                localStorage.setItem("passwordChanged", "true");
            }

            currentPasswordInput.value = "";
            newPasswordInput.value = "";
        } catch (error) {
            const message = error.response?.data?.message || error.message;
            showError(`Password change failed: ${message}`);
        }
    });
};
