import { showError, showSuccess } from "../../utils/notifications.js";
import {
    editUser,
    changeUserPassword,
    deleteUserAccount
} from "../../services/userService.js";

const editForm = document.getElementById("edit-user-form");
const editUserName = document.querySelector("#userName");
const editUserEmail = document.querySelector("#email");

export const initEditUserPage = async () => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
        showError("User not found in session. Please log in again.");
        window.location.href = "#/login";
    }

    editUserName.value = user.userName.trim();
    editUserEmail.value = user.email.trim();

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

    handleeditUserDetails();

    handlechangeUserPassword();

    handleDeleteUserAccount();
};

async function handleeditUserDetails() {
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
}

async function handlechangeUserPassword() {
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
}

async function handleDeleteUserAccount() {
    const deleteBtn = document.getElementById("delete-account-btn");
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

    // Confirm delete
    confirmBtn.addEventListener("click", async () => {
        try {
            modal.classList.remove("show");
            const data = await deleteUserAccount();
            if (data.success) {
                localStorage.clear();
                showSuccess("Account deleted, we hope to see you again!");
                window.location.href = "#/login";
            }
        } catch (error) {
            const message = error.response?.data?.message || error.message;
            showError(`Account deletion failed: ${message}`);
        }
    });
}
