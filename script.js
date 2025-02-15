document.addEventListener("DOMContentLoaded", function () {
    loadProgress();
    addImageClickListener(); // Add the listener for image clicks
    updateNavigation();
});

// Function to load modules into the main content area
function loadModule(module) {
    let moduleContent = document.getElementById("module-content");

    // Clear any previous content in the main content area (but not the sidebar)
    moduleContent.innerHTML = '';

    // Special case: Fullscreen iframe for "Downloading and Installing Server 2022"
    if (module.trim() === "Downloading and Installing Server 2022") {
        moduleContent.innerHTML = `
           <iframe id="module-iframe" src="modules/install.html" style="border:none; width:100vw; height:100vh; position:fixed; top:0; left:0; z-index:1000;"></iframe>
       `;
        let iframe = document.getElementById("module-iframe");
        iframe.onload = function () {
            let iframeDocument = iframe.contentWindow.document;
            let link = iframeDocument.createElement('link');
            link.rel = 'stylesheet';
            link.href = 'styles.css'; // Ensure the correct path
            iframeDocument.head.appendChild(link);
        };
        return; // Stop further execution
    }

    // Special case: Fullscreen iframe for "Building Domain Controller"
    if (module.trim() === "Building Domain Controller") {
        moduleContent.innerHTML = `
           <iframe id="module-iframe" src="modules/buildingDC.html" style="border:none; width:100vw; height:100vh; position:fixed; top:0; left:0; z-index:1000;"></iframe>
       `;
        let iframe = document.getElementById("module-iframe");
        iframe.onload = function () {
            let iframeDocument = iframe.contentWindow.document;
            let link = iframeDocument.createElement('link');
            link.rel = 'stylesheet';
            link.href = 'styles.css'; // Ensure the correct path
            iframeDocument.head.appendChild(link);
        };
        return; // Stop further execution
    }

    // Default behavior for other modules
    moduleContent.innerHTML = `<p>Content for ${module} goes here.</p>`;
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
    // Prevent sidebar from being hidden unless explicitly toggled
    sidebar.classList.toggle("hide");  // Only toggle if this is intentional
}

// Function to go to the next child module
function goToNextModule() {
    let currentModule = getCurrentModule();
    let nextModule = getNextModule(currentModule);
    if (nextModule) {
        loadModule(nextModule);
    }
}

// Updates navigation buttons
function updateNavigation() {
    let currentModule = getCurrentModule();
    let prevBtn = document.getElementById("prev-btn");
    let nextBtn = document.getElementById("next-btn");

    prevBtn.disabled = !getPreviousModule(currentModule);
    nextBtn.disabled = !getNextModule(currentModule);
}

// Function to get the next module (based on the child module structure)
function getNextModule(currentModule) {
    // Define your module structure here for the next module
    const modules = {
        "Kerberos": ["AsRepRoasting", "Kerberaosting", "UnconstrainedDelegation", "ConstrainedDelegation", "RescourceBasedConstrainedDelegation", "AlternateServices", "Relay", "SilverTicket", "GoldenTicket", "Passtheticket"],
        "DACL Attacks": ["Force Change Password", "Write SPN Targeted Kerberoasting", "Add Members", "Read LAPS Password", "Read GMSA Password", "Generic All", "Add Key Credential Link", "Write SPN", "Logon Scripts"]
    };

    let nextModule = null;
    for (let module in modules) {
        let index = modules[module].indexOf(currentModule);
        if (index !== -1 && index + 1 < modules[module].length) {
            nextModule = modules[module][index + 1];
            break;
        }
    }
    return nextModule;
}

// Function to get the previous module (based on the child module structure)
function getPreviousModule(currentModule) {
    // Define your module structure here for the previous module
    const modules = {
        "Kerberos": ["AsRepRoasting", "Kerberaosting", "UnconstrainedDelegation", "ConstrainedDelegation", "RescourceBasedConstrainedDelegation", "AlternateServices", "Relay", "SilverTicket", "GoldenTicket", "Passtheticket"],
        "DACL Attacks": ["Force Change Password", "Write SPN Targeted Kerberoasting", "Add Members", "Read LAPS Password", "Read GMSA Password", "Generic All", "Add Key Credential Link", "Write SPN", "Logon Scripts"]
    };

    let prevModule = null;
    for (let module in modules) {
        let index = modules[module].indexOf(currentModule);
        if (index > 0) {
            prevModule = modules[module][index - 1];
            break;
        }
    }
    return prevModule;
}

// Remove progress saving and login features since login is no longer needed
// Function to handle module completion check
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

// Function to get the parent module of a submodule
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

document.addEventListener("DOMContentLoaded", function () {
    addCopyButtons(); // Add copy buttons to terminal windows
});

function addCopyButtons() {
    document.querySelectorAll(".powershell-terminal, .kali-terminal").forEach(terminal => {
        let copyButton = document.createElement("button");
        copyButton.innerText = "Copy";
        copyButton.classList.add("copy-code-btn");
        terminal.appendChild(copyButton);

        copyButton.addEventListener("click", function () {
            let codeText = terminal.querySelector("pre").innerText;
            navigator.clipboard.writeText(codeText).then(() => {
                copyButton.innerText = "Copied!";
                setTimeout(() => {
                    copyButton.innerText = "Copy";
                }, 2000);
            }).catch(err => {
                console.error("Failed to copy text: ", err);
            });
        });
    });
}
