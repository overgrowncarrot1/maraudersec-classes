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
    document.querySelectorAll(".powershell-terminal, .kali-terminal").forEach(terminal => {
        let copyButton = document.createElement("button");
        copyButton.innerText = "Copy";
        copyButton.classList.add("copy-code-btn");
        terminal.appendChild(copyButton);

        // Add click event listener for the copy button inside the terminal
        copyButton.addEventListener("click", function (event) {
            // Get the correct terminal by checking the button's closest terminal container
            let terminalParent = event.target.closest(".powershell-terminal, .kali-terminal");
            
            // Make sure we are inside a terminal
            if (!terminalParent) return;

            // Find the <pre> tag inside the terminal where the code is located
            let preTag = terminalParent.querySelector("pre");
            if (!preTag) return; // Ensure there's a <pre> block to copy from

            // Get the code text and trim unnecessary spaces
            let codeText = preTag.innerText.trim();

            // Use the Clipboard API to copy the text from the terminal
            navigator.clipboard.writeText(codeText).then(() => {
                copyButton.innerText = "Copied!";
                copyButton.classList.add("copied");

                // Reset the button text after 2 seconds
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
