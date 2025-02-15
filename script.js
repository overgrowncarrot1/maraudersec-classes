document.addEventListener("DOMContentLoaded", function () {
    addImageClickListener(); // Add the listener for image clicks
});

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
