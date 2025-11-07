export function userAccountBar(user) {
    const userName = document.querySelector(".user-name");
    const userEmail = document.querySelector(".user-email");

    userName ? (userName.textContent = user.userName) : "Guest User";
    userEmail ? (userEmail.textContent = user.email) : "Missing Email";
}
