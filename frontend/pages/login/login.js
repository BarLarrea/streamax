import { validatePassword } from "../../utils/authInputValidation.js";
import { loginUser } from "../../services/authService.js";
import { showSuccess, showError } from "../../utils/notifications.js";

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
        // Continue the login process only if axios call is successful (stsatus !== 2xx will throw an error)

        localStorage.setItem("accessToken", data.accessToken);
        localStorage.setItem("user", JSON.stringify(data.user));

        console.log("Login successful:", data.user);
        showSuccess("Login successful!");

        window.location.hash = "#/home";
    } catch (error) {
        const message = error.response?.data?.message || error.message;

        console.error("Login failed:", error.message);

        showError(`Login failed: ${message}`);
    }
};

logInPage.querySelector("#login-form").addEventListener("submit", handleSubmit);
