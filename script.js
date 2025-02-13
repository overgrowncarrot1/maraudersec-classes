document.addEventListener("DOMContentLoaded", function () {
    checkLogin();
});

function toggleMenu(element) {
    let submenu = element.nextElementSibling;
    submenu.style.display = (submenu.style.display === "block") ? "none" : "block";
}

function loadModule(module) {
    fetch(`${module}.html`) // Load the corresponding module HTML
        .then(response => response.text())
        .then(data => {
            // Insert HTML content into the #module-content div
            document.getElementById("module-content").innerHTML = data;

            // Trigger syntax highlighting for the code block
            Prism.highlightAll(); // This applies syntax highlighting to all code blocks

            saveProgress(module);
        })
        .catch(error => {
            console.error("Error loading module:", error);
            document.getElementById("module-content").innerHTML = `<p>Sorry, an error occurred while loading the module.</p>`;
        });
}

function prevModule() {
    alert("Previous module functionality coming soon!");
}

function nextModule() {
    alert("Next module functionality coming soon!");
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
