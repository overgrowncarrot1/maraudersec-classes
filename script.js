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

function prevModule() {
    let currentModule = getCurrentModule();
    let previousModule = getPreviousModule(currentModule);
    if (previousModule) {
        loadModule(previousModule);
    } else {
        alert("No previous module available.");
    }
}

function nextModule() {
    let currentModule = getCurrentModule();
    let nextModule = getNextModule(currentModule);
    if (nextModule) {
        loadModule(nextModule);
    } else {
        alert("No next module available.");
    }
}

function completeModule() {
    let moduleTitle = document.querySelector("#module-content h2").textContent;
    if (moduleTitle) {
        alert(`Module ${moduleTitle} marked as complete.`);
        addCheckmark(moduleTitle);

        // Check if all submodules are completed for the parent module
        if (allSubmodulesCompleted(moduleTitle)) {
            addCheckmark(getParentModule(moduleTitle));
        }
    }
}

function addCheckmark(module) {
    const moduleList = document.querySelectorAll(".module-list .module-title");
    moduleList.forEach(item => {
        if (item.textContent === module) {
            let checkmark = document.createElement("span");
            checkmark.innerHTML = " &#x2714;"; // Unicode checkmark
            item.appendChild(checkmark);
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
    let prevBtn = document.getElementById("prev-btn");
    let nextBtn = document.getElementById("next-btn");

    prevBtn.disabled = !getPreviousModule(currentModule);
    nextBtn.disabled = !getNextModule(currentModule);
}
