import { validatePassword } from "../../utils/authInputValidation.js";
import { loginUser } from "../../services/authService.js";
import { showSuccess, showError } from "../../utils/notifications.js";

export const initLoginPage = () => {
    const logInPage = document.querySelector("#app-main");

    const handleSubmit = async (e) => {
        e.preventDefault();
        const userName = logInPage.querySelector("#userName").value.trim();
        const password = logInPage.querySelector("#password").value.trim();

        if (!userName || !password) {
            alert("Please fill in all fields");
            return;
        }

        if (!validatePassword(password)) {
            alert(
                "Password must be at least 8 characters long and include a number and a special character"
            );
            return;
        }

        try {
            const data = await loginUser(userName, password);

            localStorage.setItem("accessToken", data.accessToken);
            localStorage.setItem("user", JSON.stringify(data.user));

            const savedUser = localStorage.getItem("user");
            if (savedUser) {
                showSuccess("Login success!");
                console.log("Login success:", data.user);
                window.location.hash = "#/profiles";
            } else {
                console.warn("User not yet saved, retrying...");
                setTimeout(() => (window.location.hash = "#/profiles"), 100);
            }
        } catch (error) {
            const message = error.response?.data?.message || error.message;

            console.error("Login failed:", error.message);

            showError(`Login failed: ${message}`);
        }
    };

    logInPage
        .querySelector("#login-form")
        .addEventListener("submit", handleSubmit);
};
