// ===== DATA PROJECT =====
const projects = [
  {
    title: "Aplikasi Manajemen Sanggar",
    description: "Aplikasi Android untuk mengelola data sanggar seni tradisional.",
    tech: ["PHP", "Android Studio", "SQLite"],
    link: "#"
  },
  {
    title: "Website Portofolio",
    description: "Website portofolio pribadi dengan beberapa halaman.",
    tech: ["HTML", "CSS", "JavaScript"],
    link: "#"
  }
];

// ===== MENAMPILKAN PROJECT =====
function renderProjects() {
  const container = document.getElementById("project-list");

  // Kalau elemen ini tidak ada (bukan halaman project), berhenti
  if (!container) return;

  projects.forEach(function (item) {
    const card = document.createElement("div");
    card.className = "card";

    // Ubah array tech menjadi tag-tag HTML
    const techTags = item.tech
      .map(function (t) { return `<span class="tag">${t}</span>`; })
      .join("");

    card.innerHTML = `
      <h3>${item.title}</h3>
      <p>${item.description}</p>
      <div class="skills">${techTags}</div>
      <a href="${item.link}" class="btn">Lihat Detail</a>
    `;

    container.appendChild(card);
  });
}

// ===== DATA LEARNING =====
const learnings = [
  { topic: "HTML & CSS", progress: 80, status: "Hampir selesai" },
  { topic: "JavaScript", progress: 50, status: "Sedang dipelajari" },
  { topic: "Kotlin (Android)", progress: 65, status: "Sedang dipelajari" },
  { topic: "Basis Data", progress: 40, status: "Sedang dipelajari" }
];

// ===== MENAMPILKAN LEARNING =====
function renderLearning() {
  const container = document.getElementById("learning-list");
  if (!container) return;

  learnings.forEach(function (item) {
    const box = document.createElement("div");
    box.className = "learning-item";

    box.innerHTML = `
      <div class="learning-head">
        <h3>${item.topic}</h3>
        <span>${item.progress}%</span>
      </div>
      <div class="progress">
        <div class="progress-bar" style="width: ${item.progress}%"></div>
      </div>
      <small>${item.status}</small>
    `;

    container.appendChild(box);
  });
}

// ===== LOGIN =====
// Data akun contoh (hanya untuk latihan)
const akun = { username: "admin", password: "12345" };

function setupLogin() {
  const form = document.getElementById("login-form");
  if (!form) return;

  form.addEventListener("submit", function (e) {
    e.preventDefault(); // cegah halaman reload

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value;
    const message = document.getElementById("login-message");

    if (username === akun.username && password === akun.password) {
      localStorage.setItem("loggedInUser", username);
      window.location.href = "index.html";
    } else {
      message.textContent = "Username atau password salah!";
    }
  });
}

// ===== NAVBAR: LOGIN / LOGOUT =====
function updateNavbar() {
  const loginLink = document.getElementById("login-link");
  if (!loginLink) return;

  const user = localStorage.getItem("loggedInUser");

  if (user) {
    loginLink.textContent = "Logout (" + user + ")";
    loginLink.href = "#";
    loginLink.addEventListener("click", function (e) {
      e.preventDefault();
      localStorage.removeItem("loggedInUser");
      window.location.href = "login.html";
    });
  }
}

// ===== MENU HAMBURGER =====
function setupMenu() {
  const toggle = document.getElementById("menu-toggle");
  const menu = document.getElementById("menu");
  if (!toggle || !menu) return;

  toggle.addEventListener("click", function () {
    menu.classList.toggle("open");
  });
}
renderProjects();
renderLearning();
setupLogin();
updateNavbar();
setupMenu();