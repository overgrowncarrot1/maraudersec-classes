document.addEventListener("DOMContentLoaded", function () {
    checkLogin();
});

function toggleMenu(element) {
    let submenu = element.nextElementSibling;
    submenu.style.display = (submenu.style.display === "block") ? "none" : "block";
}

function loadModule(module) {
    document.getElementById("module-content").innerHTML = `<h2>${module} Module</h2><p>Content for ${module} goes here.</p>`;
    saveProgress(module);
}

function prevModule() {
    alert("Previous module functionality coming soon!");
}

function nextModule() {
    alert("Next module functionality coming soon!");
}

function login() {
    let username = document.getElementById("username").value;
    if (username) {
        localStorage.setItem("username", username);
        document.getElementById("user-greeting").innerText = `Welcome, ${username}!`;
    }
}

function logout() {
    localStorage.removeItem("username");
    document.getElementById("user-greeting").innerText = "";
}

function checkLogin() {
    let username = localStorage.getItem("username");
    if (username) {
        document.getElementById("user-greeting").innerText = `Welcome, ${username}!`;
    }
}

function saveProgress(module) {
    let username = localStorage.getItem("username");
    if (username) {
        localStorage.setItem(`progress-${username}`, module);
    }
}

function loadProgress() {
    let username = localStorage.getItem("username");
    if (username) {
        let lastModule = localStorage.getItem(`progress-${username}`);
        if (lastModule) {
            loadModule(lastModule);
        }
    }
}
