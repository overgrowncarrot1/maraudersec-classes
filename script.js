// Function to toggle parent module visibility (i.e., showing child modules)
function toggleMenu(element) {
    element.parentElement.classList.toggle("active");
}

// Function to toggle child module visibility (i.e., showing submodules like Linux and PowerShell)
function toggleSubMenu(element) {
    element.parentElement.classList.toggle("active");
}

// Function to load module content (Placeholder)
function loadModule(moduleName) {
    document.getElementById("module-content").innerHTML = `<h2>Loading ${moduleName}...</h2>`;
}

// Function to mark modules as completed
function completeModule() {
    // Mark the active module as completed by adding the 'completed' class
    let activeModule = document.querySelector(".submenu .child-module-title.active");
    if (activeModule) {
        activeModule.classList.add("completed");
    }

    // Check if all child modules in a parent are completed
    document.querySelectorAll(".module-list .dropdown").forEach(parentModule => {
        let allCompleted = Array.from(parentModule.querySelectorAll(".child-module-title"))
            .every(module => module.classList.contains("completed"));

        // If all child modules are completed, mark the parent as completed
        if (allCompleted) {
            parentModule.querySelector(".module-title").classList.add("completed");
        }
    }
}

// Function to handle the login process
function login() {
    let username = document.getElementById("username").value;
    if (username) {
        localStorage.setItem("username", username);
        document.getElementById("user-greeting").innerText = `Welcome, ${username}!`;
    }
}

// Function to handle logout
function logout() {
    localStorage.removeItem("username");
    document.getElementById("user-greeting").innerText = "";
}

// Function to check if a user is logged in and greet them
function checkLogin() {
    let username = localStorage.getItem("username");
    if (username) {
        document.getElementById("user-greeting").innerText = `Welcome, ${username}!`;
    }
}

// Function to save module progress
function saveProgress(module) {
    let username = localStorage.getItem("username");
    if (username) {
        localStorage.setItem(`progress-${username}`, module);
    }
}

// Function to load module progress
function loadProgress() {
    let username = localStorage.getItem("username");
    if (username) {
        let lastModule = localStorage.getItem(`progress-${username}`);
        if (lastModule) {
            loadModule(lastModule);
        }
    }
}

// Function to update the navigation buttons based on current module state
function updateNavigation() {
    let currentModule = getCurrentModule();
    let prevBtn = document.getElementById("prev-btn");
    let nextBtn = document.getElementById("next-btn");

    prevBtn.disabled = !getPreviousModule(currentModule);
    nextBtn.disabled = !getNextModule(currentModule);
}

// Helper functions to manage module state (previous/next)
function getCurrentModule() {
    return document.querySelector("#module-content h2") ? document.querySelector("#module-content h2").textContent.split(" ")[0] : "";
}

function getPreviousModule(currentModule) {
    let modules = ["nmap", "nse", "rustscan", "finding_users"];
    let index = modules.indexOf(currentModule);
    return index > 0 ? modules[index - 1] : null;
}

function getNextModule(currentModule) {
    let modules = ["nmap", "nse", "rustscan", "finding_users"];
    let index = modules.indexOf(currentModule);
    return index < modules.length - 1 ? modules[index + 1] : null;
}
