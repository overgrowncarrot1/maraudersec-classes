document.addEventListener("DOMContentLoaded", function () {
    checkLogin();
    loadProgress();
});

const modules = ["nmap", "nse", "rustscan", "finding_users"]; // Define the order of modules

function toggleMenu(element) {
    let submenu = element.nextElementSibling;
    submenu.style.display = (submenu.style.display === "block") ? "none" : "block";
}

function loadModule(module) {
    fetch(`${module}.html`) // Load the corresponding module HTML
        .then(response => response.text())
        .then(data => {
            document.getElementById("module-content").innerHTML = data;
            saveProgress(module);
        })
        .catch(error => {
            console.error("Error loading module:", error);
            document.getElementById("module-content").innerHTML = `<p>Sorry, an error occurred while loading the module.</p>`;
        });
    localStorage.setItem("currentModule", module); // Save the current module
}

function prevModule() {
    let currentModule = localStorage.getItem("currentModule");
    let currentIndex = modules.indexOf(currentModule);
    
    if (currentIndex > 0) {
        let prevModule = modules[currentIndex - 1];
        loadModule(prevModule);
        localStorage.setItem("currentModule", prevModule); // Save the current module
    } else {
        alert("You are already at the first module!");
    }
}

function nextModule() {
    let currentModule = localStorage.getItem("currentModule");
    let currentIndex = modules.indexOf(currentModule);
    
    if (currentIndex < modules.length - 1) {
        let nextModule = modules[currentIndex + 1];
        loadModule(nextModule);
        localStorage.setItem("currentModule", nextModule); // Save the current module
    } else {
        alert("You have reached the last module!");
    }
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
        localStorage.setItem("currentModule", module); // Save the current module
    }
}

function loadProgress() {
    let username = localStorage.getItem("username");
    if (username) {
        let lastModule = localStorage.getItem(`progress-${username}`);
        if (lastModule) {
            loadModule(lastModule);
            localStorage.setItem("currentModule", lastModule); // Ensure currentModule is loaded
        }
    }
}
