document.addEventListener("DOMContentLoaded", () => {
    const dropdowns = [
        { buttonId: "luftplus", contentId: "luftdropdown" },
        { buttonId: "lichtplus", contentId: "lichtdropdown" }
    ];

    dropdowns.forEach(({ buttonId, contentId }) => {
        const button = document.getElementById(buttonId);
        const dropdown = document.getElementById(contentId);

        button.addEventListener("click", () => {
            dropdown.classList.toggle("show");

            // Swap icon
            const isOpen = dropdown.classList.contains("show");
            button.classList.toggle("rotated", isOpen);
            button.src = isOpen ? "icons/minus.svg" : "icons/plus.svg";
            button.alt = isOpen ? "minus" : "plus";
        });
    });
});
