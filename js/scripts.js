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

    Notification.requestPermission();

    // --- Load persisted state from localStorage ---
let lastNotificationTime = parseInt(localStorage.getItem("lastNotificationTime")) || 0;
let lastTodayNoMovement = parseInt(localStorage.getItem("lastTodayNoMovement")) || 0;
let lastLightNotification = parseInt(localStorage.getItem("lastLightNotification")) || 0;

const cooldownDuration = 15 * 60 * 1000; // 15 minutes

function checkAirQuality() {
  fetch("php/unload_gas.php")
    .then((response) => response.json())
    .then((data) => {
      const latest = data.latest;
      if (!latest) return;

      const { air_quality, temperature, humidity, ratio } = latest;

      document.getElementById("AirQualityText").textContent = `AirQuality: ${air_quality}`;
      document.getElementById("TemperatureText").textContent = `Temperature: ${temperature}°C`;
      document.getElementById("HumidityText").textContent = `Humidity: ${humidity}%`;

      const now = Date.now();
      if (ratio > 1.5 && now - lastNotificationTime > cooldownDuration) {
        if (Notification.permission === "granted") {
          new Notification("Warnung: Luftqualität", {
            body: "Der aktuelle Luftqualitätswert ist hoch.",
            icon: "icon.png"
          });
          lastNotificationTime = now;
          localStorage.setItem("lastNotificationTime", lastNotificationTime);
        }
      }
    })
    .catch((error) => console.error("Fehler beim Abrufen der Luftdaten:", error));
}

function checkTodayLightWithoutMovement() {
  fetch("php/unload_light.php")
    .then((response) => response.json())
    .then((data) => {
      const today = new Date().toISOString().split('T')[0];
      if (!data[today]) return;

      const currentCount = data[today].without_movement || 0;
      const now = Date.now();
      const cooldownPassed = now - lastLightNotification > cooldownDuration;

      if (currentCount > lastTodayNoMovement && cooldownPassed) {
        if (Notification.permission === "granted") {
          new Notification("Lichtüberwachung", {
            body: "Heute wurde eine neue Phase ohne Bewegung erkannt.",
            icon: "icon.png"
          });
          lastLightNotification = now;
          localStorage.setItem("lastLightNotification", lastLightNotification);
        }
      }

      lastTodayNoMovement = currentCount;
      localStorage.setItem("lastTodayNoMovement", lastTodayNoMovement);
    })
    .catch((error) => {
      console.error("Fehler beim Abrufen der Lichtdaten:", error);
    });
}

})