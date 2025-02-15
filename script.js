document.addEventListener("DOMContentLoaded", function () {
    checkLogin();
    loadProgress();
    addImageClickListener(); // Add the listener for image clicks
});

// Function to load modules into the main content area
function loadModule(module) {
    let moduleContent = document.getElementById("module-content");

    // Clear any previous content in the main content area (but not the sidebar)
    moduleContent.innerHTML = '';

    // Special case: Load install.html in full screen inside iframe
    if (module.trim() === "Downloading and Installing Server 2022") {
        moduleContent.innerHTML = `
            <iframe id="module-iframe" src="modules/install.html" style="border:none; width:100vw; height:100vh; position:fixed; top:0; left:0; z-index:1000;"></iframe>
        `;
        let iframe = document.getElementById("module-iframe");

        // Wait until the iframe is fully loaded, then apply the parent page's CSS
        iframe.onload = function() {
            let iframeDocument = iframe.contentWindow.document;

            // Create a new link element for the parent page's CSS
            let link = iframeDocument.createElement('link');
            link.rel = 'stylesheet';
            link.href = 'styles.css'; // Adjust the path if needed

            // Append the link element to the iframe's head
            iframeDocument.head.appendChild(link);
        };
        return;  // Return to prevent other modules from loading
    }

    // Default behavior for other modules
    moduleContent.innerHTML = `<p>Content for ${module} goes here.</p>`;
    saveProgress(module);
    updateNavigation();
}

// Event listener to handle image click for fullscreen
function addImageClickListener() {
    const images = document.querySelectorAll(".content img");
    images.forEach(image => {
        image.addEventListener("click", function() {
            openFullscreenImage(image.src);
        });
    });
}

// Function to open the clicked image in fullscreen mode
function openFullscreenImage(imageSrc) {
    // Create the fullscreen image container
    const fullscreenContainer = document.createElement("div");
    fullscreenContainer.classList.add("fullscreen-img");

    // Create the image element for fullscreen
    const fullscreenImage = document.createElement("img");
    fullscreenImage.src = imageSrc;

    // Add the image to the container
    fullscreenContainer.appendChild(fullscreenImage);

    // Append the container to the body
    document.body.appendChild(fullscreenContainer);

    // Add a click event to close the fullscreen image
    fullscreenContainer.addEventListener("click", function() {
        document.body.removeChild(fullscreenContainer);
    });
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
