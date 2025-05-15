document.addEventListener("DOMContentLoaded", () => {
    const dropdowns = [
        { buttonId: "luftplus", contentId: "luftdropdown" },
        { buttonId: "lichtplus", contentId: "lichtdropdown" }
    ];

    dropdowns.forEach(({ buttonId, contentId }) => {
        const button = document.getElementById(buttonId);
        const dropdown = document.getElementById(contentId);
        const verticalLine = button.querySelector(".vertical");

        button.addEventListener("click", () => {
            const isOpen = dropdown.classList.toggle("show");
            button.classList.toggle("rotated", isOpen);
            verticalLine.style.display = isOpen ? "none" : "block"; // hide vertical to show minus
        });
    });
});
