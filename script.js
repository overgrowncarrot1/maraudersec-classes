document.addEventListener("DOMContentLoaded", function () {
    checkLogin();
    loadProgress();
});

function toggleMenu(element) {
    let submenu = element.nextElementSibling;
    submenu.style.display = (submenu.style.display === "block") ? "none" : "block";
}

function loadModule(module) {
    document.getElementById("module-content").innerHTML = `<h2>${module} Module</h2><p>Content for ${module} goes here.</p>`;
    saveProgress(module);
    updateNavigation();
}

function completeModule() {
    let moduleTitle = document.querySelector("#module-content h2").textContent;
    if (moduleTitle) {
        alert(`Module ${moduleTitle} marked as complete.`);
        addStrikethrough(moduleTitle);

        // Check if all submodules are completed for the parent module
        if (allSubmodulesCompleted(moduleTitle)) {
            addStrikethrough(getParentModule(moduleTitle));
        }
    }
}

function addStrikethrough(module) {
    const moduleList = document.querySelectorAll(".module-list .module-title");
    moduleList.forEach(item => {
        if (item.textContent === module) {
            item.style.textDecoration = "line-through";
            item.style.color = "red"; // Red color for the strikethrough
        }
    });
}

function allSubmodulesCompleted(module) {
    const submodules = {
        "Enumeration": ["nmap", "nse", "rustscan", "finding_users"]
    };

    if (submodules[module]) {
        let completed = submodules[module].every(submodule => {
            return document.querySelector(`.module-title:contains('${submodule}') span`);
        });
        return completed;
    }
    return false;
}

function getParentModule(submodule) {
    const submodules = {
        "nmap": "Enumeration",
        "nse": "Enumeration",
        "rustscan": "Enumeration",
        "finding_users": "Enumeration"
    };
    return submodules[submodule];
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

function updateNavigation() {
    let currentModule = getCurrentModule();
}

function getCurrentModule() {
    return document.querySelector("#module-content h2") ? document.querySelector("#module-content h2").textContent.split(" ")[0] : "";
}
