const profilesSection = document.querySelector(".profiles");
const profilesList = document.querySelector("#profiles-list");
const profileKicker = document.querySelector(".profiles-kicker");
const toggleEditBtn = document.getElementById("toggle-edit-mode");

const user = JSON.parse(localStorage.getItem("user"));
const userName = user?.userName || "User";

const profilesData = user
    ? user.profiles.map((p) => ({
          id: p._id,
          name: p.profileName,
          avatar: p.avatar || "assets/profiles/avatar0.png"
      }))
    : [];

// ===== GREETING =====
const greet = document.querySelector("#user-greeting");
if (greet) greet.textContent = `Hello, ${userName}!`;

// ===== EMPTY STATE =====
if (profilesData.length === 0 && profileKicker) {
    profileKicker.textContent =
        "No profiles yet - Create your first one to get started!";
}

// ===== CREATE PROFILE CARD =====
const createProfileCard = (profile) => {
    const card = document.createElement("div");
    card.classList.add("profile-card");
    card.dataset.id = profile.id;

    card.innerHTML = `
        <img src="${profile.avatar}" alt="${profile.name}'s avatar" class="profile-avatar" />
        <p class="profile-name">${profile.name}</p>
        <button class="edit-profile-btn" title="Edit Profile">
            <i class="bi bi-pencil"></i>
        </button>
    `;

    // navigate to profile
    card.addEventListener("click", (e) => {
        if (e.target.closest(".edit-profile-btn")) return; // skip edit click
        localStorage.setItem("profileId", profile.id);
        window.location.hash = "#/home";
    });

    // edit profile click
    const editBtn = card.querySelector(".edit-profile-btn");
    editBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        localStorage.setItem("profileId", profile.id);
        window.location.hash = "#/edit-profile";
    });

    return card;
};

// ===== CREATE "ADD PROFILE" CARD =====
const createAddProfileCard = () => {
    const card = document.createElement("div");
    card.classList.add("profile-card", "add-profile");
    card.innerHTML = `
        <div class="add-icon">+</div>
        <p class="profile-name">Add Profile</p>
    `;
    card.addEventListener("click", () => {
        window.location.hash = "#/create-profile";
    });
    return card;
};

// ===== RENDER PROFILES =====
const renderProfiles = () => {
    profilesList.innerHTML = "";

    profilesData.forEach((profile) => {
        profilesList.appendChild(createProfileCard(profile));
    });

    if (profilesData.length < 5) {
        profilesList.appendChild(createAddProfileCard());
    }
};

// ===== TOGGLE EDIT MODE =====
if (toggleEditBtn && profilesSection) {
    toggleEditBtn.addEventListener("click", () => {
        const editing = profilesSection.classList.toggle("editing");
        toggleEditBtn.textContent = editing ? "Done" : "Edit Profiles";
    });
}

// ===== INITIAL RENDER =====
renderProfiles();
