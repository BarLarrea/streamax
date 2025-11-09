import { showError } from "../../utils/notifications.js";

// ====== MAIN INITIALIZATION ======
export async function initProfilesPage() {
    try {
        const user = getUserFromStorage();
        const profiles = formatProfiles(user.profiles);

        setupGreeting(user.userName);
        renderProfiles(profiles);
        setupEditToggle();
        setupProfileClickHandler(profiles);
    } catch (error) {
        console.error("Error initializing profiles page:", error);
    }
}

// ====== HELPERS ======
function getUserFromStorage() {
    const data = JSON.parse(localStorage.getItem("user"));
    if (!data) {
        showError("Please log in to access profiles.");
        window.location.hash = "#/login";
        throw new Error("No user data found");
    }
    return data;
}

function formatProfiles(profiles = []) {
    return profiles.map((p) => ({
        id: p._id,
        name: p.profileName,
        avatar: p.avatar || "assets/profiles/avatar0.png"
    }));
}

function setupGreeting(name) {
    const greet = document.querySelector("#user-greeting");
    if (greet) greet.textContent = `Hello, ${name}!`;
}

function createProfileCard(profile) {
    const card = document.createElement("div");
    card.className = "profile-card";
    card.dataset.id = profile.id;
    card.innerHTML = `
        <img src="${profile.avatar}" alt="${profile.name}'s avatar" class="profile-avatar" />
        <p class="profile-name">${profile.name}</p>
        <button class="edit-profile-btn" title="Edit Profile">
            <i class="bi bi-pencil"></i>
        </button>
    `;
    return card;
}

function createAddProfileCard() {
    const card = document.createElement("div");
    card.className = "profile-card add-profile";
    card.innerHTML = `
        <div class="add-icon">+</div>
        <p class="profile-name">Add Profile</p>
    `;
    return card;
}

function renderProfiles(profiles) {
    const list = document.querySelector("#profiles-list");
    const kicker = document.querySelector(".profiles-kicker");

    list.innerHTML = "";
    if (!profiles.length) {
        kicker.textContent =
            "No profiles yet - Create your first one to get started!";
    }

    const fragment = document.createDocumentFragment();
    profiles.forEach((p) => fragment.appendChild(createProfileCard(p)));
    if (profiles.length < 5) fragment.appendChild(createAddProfileCard());
    list.appendChild(fragment);
}

function setupProfileClickHandler(profiles) {
    const list = document.querySelector("#profiles-list");
    list.addEventListener("click", (e) => {
        const card = e.target.closest(".profile-card");
        if (!card) return;

        const id = card.dataset.id;

        if (card.classList.contains("add-profile")) {
            window.location.hash = "#/create-profile";
        } else if (e.target.closest(".edit-profile-btn")) {
            localStorage.setItem("profileId", id);
            window.location.hash = "#/edit-profile";
        } else {
            localStorage.setItem("profileId", id);
            window.location.hash = "#/home";
        }
    });
}

function setupEditToggle() {
    const toggleBtn = document.getElementById("toggle-edit-mode");
    const section = document.querySelector(".profiles");

    if (!toggleBtn || !section) return;
    toggleBtn.addEventListener("click", () => {
        const editing = section.classList.toggle("editing");
        toggleBtn.textContent = editing ? "Done" : "Edit Profiles";
    });
}
