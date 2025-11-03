export const createProfileCard = (profile, onClick) => {
    const card = document.createElement("div");
    card.classList.add("profile-card");
    card.dataset.id = profile.id;

    card.innerHTML = `
    <img src="${profile.avatar}" alt="${profile.name}'s avatar" class="profile-avatar" />
    <p class="profile-name">${profile.name}</p>
    `;

    // define inner click event when profile card is clicked
    if (onClick && typeof onClick === "function") {
        card.addEventListener("click", () => onClick(profile));
    }
};
