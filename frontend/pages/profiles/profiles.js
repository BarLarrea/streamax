const profilesPage = document.querySelector("#app-main");
const profilesList = document.querySelector("#profiles-list");
const profileKicker = document.querySelector(".profiles-kicker");

const user = JSON.parse(localStorage.getItem("user"));
const userName = user?.userName || "User";
const isAdmin = user?.isAdmin || false;

const profilesData = user
    ? user.profiles.map((p) => ({
          id: p._id,
          name: p.profileName,
          avatar: p.avatar || "assets/profiles/avatar0.png"
      }))
    : [];

const greet = document.querySelector("#user-greeting");
if (greet) greet.textContent = `Hello, ${userName}!`;

if (profilesData.length === 0) {
    profileKicker.textContent =
        "No profiles yet - Create your first one to get started!";
}

const createProfileCard = (profile) => {
    const card = document.createElement("div");
    card.classList.add("profile-card");
    card.dataset.id = profile.id;

    card.innerHTML = `
    <img src="${profile.avatar}" alt="${profile.name}'s avatar" class="profile-avatar" />
    <p class="profile-name">${profile.name}</p>
  `;

    // define inner click event when profile card is clicked
    card.addEventListener("click", () => {
        localStorage.setItem("profileId", profile.id);
        window.location.hash = "#/home";
    });

    return card;
};

const createAddProfileCard = () => {
    const card = document.createElement("div");
    card.classList.add("profile-card", "add-profile");

    card.innerHTML = `
    <div class="add-icon">+</div>
    <p class="profile-name">Add Profile</p>
  `;

    // define inner click event when add profile card is clicked
    card.addEventListener("click", () => {
        window.location.hash = "#/create-profile";
    });

    return card;
};

const renderProfiles = () => {
    profilesList.innerHTML = "";

    profilesData.forEach((profile) => {
        profilesList.appendChild(createProfileCard(profile));
    });

    if (profilesData.length < 5) {
        profilesList.appendChild(createAddProfileCard());
    }
};

renderProfiles();
