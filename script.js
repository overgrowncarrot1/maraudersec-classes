document.addEventListener("DOMContentLoaded", function () {
    checkLogin();
    loadProgress();
});

// Toggle the dropdown menu visibility when clicking on parent modules
function toggleMenu(element) {
    let submenu = element.nextElementSibling;
    submenu.classList.toggle("active");
}

// Load specific module content based on user click
function loadModule(module) {
    let moduleContent = document.getElementById("module-content");
    let moduleTitle = document.createElement("h2");
    moduleTitle.textContent = `${module} Module`;
    moduleContent.innerHTML = "";
    moduleContent.appendChild(moduleTitle);
    moduleContent.innerHTML += `<p>Content for ${module} goes here.</p>`;
    saveProgress(module);
    updateNavigation();
}

// Mark module as completed and strike through module title
function completeModule() {
    let moduleTitle = document.querySelector("#module-content h2");
    if (moduleTitle) {
        alert(`Module ${moduleTitle.textContent} marked as complete.`);
        addCheckmark(moduleTitle.textContent);

        // Check if all submodules are completed for the parent module
        if (allSubmodulesCompleted(moduleTitle.textContent)) {
            addCheckmark(getParentModule(moduleTitle.textContent));
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
            item.classList.add("completed");
        }
    });
}

function allSubmodulesCompleted(module) {
    const submodules = {
        "Kerberos": ["AsRepRoasting", "Kerberaosting", "UnconstrainedDelegation", "ConstrainedDelegation", "RescourceBasedConstrainedDelegation", "AlternateServices", "Relay", "SilverTicket", "GoldenTicket", "Passtheticket"],
        "DACL Attacks": ["Force Change Password", "Write SPN Targeted Kerberoasting", "Add Members", "Read LAPS Password", "Read GMSA Password", "Generic All", "Add Key Credential Link", "Write SPN", "Logon Scripts"]
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
        "AsRepRoasting": "Kerberos",
        "Kerberaosting": "Kerberos",
        "UnconstrainedDelegation": "Kerberos",
        "ConstrainedDelegation": "Kerberos",
        "RescourceBasedConstrainedDelegation": "Kerberos",
        "AlternateServices": "Kerberos",
        "Relay": "Kerberos",
        "SilverTicket": "Kerberos",
        "GoldenTicket": "Kerberos",
        "Passtheticket": "Kerberos",
        "Force Change Password": "DACL Attacks",
        "Write SPN Targeted Kerberoasting": "DACL Attacks",
        "Add Members": "DACL Attacks",
        "Read LAPS Password": "DACL Attacks",
        "Read GMSA Password": "DACL Attacks",
        "Generic All": "DACL Attacks",
        "Add Key Credential Link": "DACL Attacks",
        "Write SPN": "DACL Attacks",
        "Logon Scripts": "DACL Attacks"
    };
    return submodules[submodule];
}

function updateNavigation() {
    let currentModule = getCurrentModule();
    let prevBtn = document.getElementById("prev-btn");
    let nextBtn = document.getElementById("next-btn");

    prevBtn.disabled = !getPreviousModule(currentModule);
    nextBtn.disabled = !getNextModule(currentModule);
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
        let completedModules = JSON.parse(localStorage.getItem("completedModules")) || {};
        completedModules[username] = completedModules[username] || [];
        completedModules[username].push(module);
        localStorage.setItem("completedModules", JSON.stringify(completedModules));
    }
}

function loadProgress() {
    let username = localStorage.getItem("username");
    if (username) {
        let completedModules = JSON.parse(localStorage.getItem("completedModules")) || {};
        let modules = completedModules[username] || [];
        modules.forEach(module => {
            addCheckmark(module);
        });
    }
}
