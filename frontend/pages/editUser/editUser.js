export const initEditUserPage = async () => {
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
};
