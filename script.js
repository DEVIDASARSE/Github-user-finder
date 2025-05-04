const searchBtn = document.querySelector(".search");
const usernameinp = document.querySelector(".usernameinp");
const card = document.querySelector(".card");
const errorBox = document.querySelector(".error");

// Fetch user profile
async function getProfileData(username) {
  const res = await fetch(`https://api.github.com/users/${username}`);
  if (!res.ok) throw new Error("User not found");
  return await res.json();
}

// Fetch recent repositories
async function getRepos(username) {
  const res = await fetch(`https://api.github.com/users/${username}/repos?sort=updated`);
  if (!res.ok) throw new Error("Repos could not be fetched");
  return await res.json();
}

// Render user profile card
function decorateProfileData(details, repos) {
  const topRepos = repos.slice(0, 5).map(repo => `
      <a href="${repo.html_url}" target="_blank" class="block px-4 py-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition">
        <p class="font-semibold text-white">${repo.name}</p>
        <p class="text-sm text-gray-400">${repo.description || "No description"}</p>
      </a>
  `).join("");

  const html = `
    <img src="${details.avatar_url}" alt="User Avatar"
      class="w-28 h-28 rounded-full border-4 border-blue-500 object-cover shadow-lg" />

    <div class="flex-1 space-y-3">
      <h2 class="text-2xl font-bold">${details.name || "No Name"}</h2>
      <p class="text-gray-400 text-sm">@${details.login}</p>
      <p class="text-sm text-gray-300">${details.bio || "No bio available"}</p>

      <div class="flex flex-wrap gap-4 mt-3 text-sm text-gray-300">
        <div><span class="font-semibold text-white">Repos:</span> ${details.public_repos}</div>
        <div><span class="font-semibold text-white">Followers:</span> ${details.followers}</div>
        <div><span class="font-semibold text-white">Following:</span> ${details.following}</div>
        <div><span class="font-semibold text-white">Location:</span> ${details.location || "N/A"}</div>
        <div><span class="font-semibold text-white">Company:</span> ${details.company || "N/A"}</div>
      </div>

      ${details.blog ? `<div><span class="font-semibold text-white">Blog:</span> <a href="${details.blog}" target="_blank" class="text-blue-400 hover:underline">${details.blog}</a></div>` : ''}

      <div class="mt-6">
        <h3 class="text-lg font-semibold mb-2 text-white">Top Repositories</h3>
        <div class="space-y-2">${topRepos}</div>
      </div>
    </div>
  `;

  card.innerHTML = html;
}

// Main search click handler
searchBtn.addEventListener("click", async () => {
  const username = usernameinp.value.trim();
  errorBox.textContent = "";
  card.innerHTML = "";

  if (username === "") {
    errorBox.textContent = "Please enter a username.";
    return;
  }

  // Show loader while fetching
  card.innerHTML = `<p class="text-gray-400 animate-pulse">Loading profile...</p>`;

  try {
    const userData = await getProfileData(username);
    const repos = await getRepos(username);
    decorateProfileData(userData, repos);
  } catch (err) {
    card.innerHTML = "";
    errorBox.textContent = err.message;
  }
});

// Allow Enter key to trigger search
usernameinp.addEventListener("keyup", (e) => {
  if (e.key === "Enter") {
    searchBtn.click(); // Trigger the click event of the search button
  }
});
