import {
    validateEmail,
    validatePassword
} from "../../utils/authInputValidation.js";
import { registerUser } from "../../services/authService.js";
import { showSuccess, showError } from "../../utils/notifications.js";

const adminToggle = document.querySelector("#register-as-admin");
const adminCodeGroup = document.querySelector("#admin-code-group");

const handleAdminToggle = () => {
    if (adminToggle.checked) {
        adminCodeGroup.style.display = "block";
    } else {
        adminCodeGroup.style.display = "none";
        adminCodeGroup.querySelector("input").value = "";
    }
};

adminToggle.addEventListener("change", handleAdminToggle);

const registerPage = document.querySelector("#app-main");

const handleSubmit = async (e) => {
    e.preventDefault();

    const userName = registerPage.querySelector("#userName").value.trim();
    const email = registerPage.querySelector("#email").value.trim();
    const password = registerPage.querySelector("#password").value.trim();
    const adminCode = adminToggle.checked
        ? registerPage.querySelector("#admin-code").value.trim()
        : null;

    if (!validateEmail(email)) {
        alert("Please enter a valid email address");
        return;
    }

    if (!validatePassword(password)) {
        alert(
            "Password must be at least: 8 characters, one uppercase letter, one lowercase letter, one number, and one special character"
        );
        return;
    }

    try {
        const response = await registerUser(
            userName,
            email,
            password,
            adminCode
        );

        showSuccess("Registration successful! You can now log in.");
        window.location.hash = "#/login";
    } catch (error) {
        const message = error.response?.data?.message || error.message;

        console.error("Registration failed:", message);

        showError(`Registration failed: ${message}`);
    }
};

registerPage
    .querySelector("#register-form")
    .addEventListener("submit", handleSubmit);
