document.addEventListener("DOMContentLoaded", function () {
    addImageClickListener(); // Add the listener for image clicks
    addCopyButtons(); // Add copy buttons to terminal windows
});

// Function to load modules into the main content area
function loadModule(module) {
    let moduleContent = document.getElementById("module-content");

    // Clear previous content
    moduleContent.innerHTML = '';

    // List of modules that need fullscreen iframes
    const fullscreenModules = {
        "Downloading and Installing Server 2022": "modules/install.html",
        "Building Domain Controller": "modules/buildingDC.html",
        "Not so secure": "modules/secure.html",
        "Using Windows": "modules/findingusers.html",
        "Using Linux": "modules/findinguserslinux.html"
        "AsRepRoasting": "modules/asrep.html"
    };

    // If the selected module is in the fullscreen list, load it inside the content area
    if (fullscreenModules[module]) {
        loadIframeModule(fullscreenModules[module]);
        return;
    }

    // Default behavior for other modules
    moduleContent.innerHTML = `<p>Content for ${module} goes here.</p>`;
}

// Function to load a module in iframe mode inside content area
function loadIframeModule(src) {
    let moduleContent = document.getElementById("module-content");
    moduleContent.innerHTML = `
        <iframe id="module-iframe" src="${src}" style="border:none; width:calc(100% - 250px); height:80vh; margin-top:20px; float:left;"></iframe>
    `;

    let iframe = document.getElementById("module-iframe");
    iframe.onload = function () {
        let iframeDocument = iframe.contentWindow.document;
        let link = iframeDocument.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'styles.css'; // Ensure the correct path
        iframeDocument.head.appendChild(link);
    };
}

// Event listener to handle image clicks for fullscreen
function addImageClickListener() {
    document.querySelectorAll(".content img").forEach(image => {
        image.addEventListener("click", function() {
            openFullscreenImage(image.src);
        });
    });
}

// Function to open the clicked image in fullscreen mode
function openFullscreenImage(imageSrc) {
    const fullscreenContainer = document.createElement("div");
    fullscreenContainer.classList.add("fullscreen-img");

    const fullscreenImage = document.createElement("img");
    fullscreenImage.src = imageSrc;

    fullscreenContainer.appendChild(fullscreenImage);
    document.body.appendChild(fullscreenContainer);

    fullscreenContainer.addEventListener("click", function() {
        document.body.removeChild(fullscreenContainer);
    });
}

// Function to toggle dropdown menus
function toggleMenu(element) {
    let submenu = element.nextElementSibling;
    submenu.classList.toggle("active");
}

// Function to add copy buttons to code terminals
function addCopyButtons() {
    // Listen for click events on terminal containers
    document.querySelectorAll(".kali-terminal").forEach(terminal => {
        // Create the copy button if it doesn't exist
        let copyButton = terminal.querySelector(".copy-btn");

        // If the button doesn't exist, create and append it
        if (!copyButton) {
            copyButton = document.createElement("button");
            copyButton.classList.add("copy-btn");
            copyButton.innerText = "Copy";
            terminal.appendChild(copyButton);
        }

        // Add click event listener for copy functionality
        copyButton.addEventListener("click", function (event) {
            let terminalParent = event.target.closest(".kali-terminal"); // Get the terminal container
            let preTag = terminalParent.querySelector("pre"); // Find the <pre> tag inside this terminal

            if (!preTag) return; // Ensure there's a <pre> block
            let codeText = preTag.innerText.trim(); // Trim unnecessary spaces

            // Check if codeText is empty
            if (!codeText) {
                alert("No code to copy!");
                return;
            }

            navigator.clipboard.writeText(codeText).then(() => {
                copyButton.innerText = "Copied!";
                copyButton.classList.add("copied");
                setTimeout(() => {
                    copyButton.innerText = "Copy";
                    copyButton.classList.remove("copied");
                }, 2000);
            }).catch(err => {
                console.error("Failed to copy text: ", err);
            });
        });
    });
}
