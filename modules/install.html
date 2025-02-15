document.addEventListener("DOMContentLoaded", function () {
    checkLogin();
    loadProgress();
});

// Function to load modules into the main content area
function loadModule(module) {
    let moduleContent = document.getElementById("module-content");

    // Clear any previous content in the main content area (but not the sidebar)
    moduleContent.innerHTML = '';

    // Special case: Load install.html in full screen inside iframe
    if (module === "Install Server 2022") {
        moduleContent.innerHTML = `
            <iframe src="install.html" style="border:none; width:100vw; height:100vh; position:fixed; top:0; left:0;"></iframe>
        `;
        return;
    }

    // Default behavior for other modules
    moduleContent.innerHTML = `<p>Content for ${module} goes here.</p>`;
    saveProgress(module);
    updateNavigation();
}

// Toggle the dropdown menu visibility when clicking on parent modules
function toggleMenu(element) {
    let submenu = element.nextElementSibling;
    submenu.classList.toggle("active");
}

// Toggle the sidebar visibility when clicking the hamburger menu
function toggleSidebar() {
    let sidebar = document.querySelector(".sidebar");
    sidebar.classList.toggle("active");
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
        let progress = JSON.parse(localStorage.getItem("progress")) || {};
        progress[username] = progress[username] || {};
        progress[username][module] = "completed";
        localStorage.setItem("progress", JSON.stringify(progress));
    }
}

function loadProgress() {
    let username = localStorage.getItem("username");
    if (username) {
        let progress = JSON.parse(localStorage.getItem("progress")) || {};
        let userProgress = progress[username] || {};
        for (let module in userProgress) {
            if (userProgress[module] === "completed") {
                addCheckmark(module);
            }
        }
    }
}

function getCurrentModule() {
    let moduleTitle = document.querySelector("#module-content h2");
    return moduleTitle ? moduleTitle.textContent.replace(" Module", "") : null;
}

function getPreviousModule(currentModule) {
    // Implement logic to get the previous module
}

function getNextModule(currentModule) {
    // Implement logic to get the next module
}
