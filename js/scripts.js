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
            verticalLine.style.display = isOpen ? "none" : "block";
        });
    });

    Notification.requestPermission();

    let lastNotificationTime = parseInt(localStorage.getItem("lastNotificationTime")) || 0;
    let lastTodayNoMovement = parseInt(localStorage.getItem("lastTodayNoMovement")) || 0;
    let lastLightNotification = parseInt(localStorage.getItem("lastLightNotification")) || 0;
    let lastLightNotificationSentAt = parseInt(localStorage.getItem("lastLightNotificationSentAt")) || 0;

    const cooldownDuration = 15 * 60 * 1000; // 15 Minuten

    function checkAirQuality() {
        fetch("php/unload_gas.php")
            .then(response => response.json())
            .then(data => {
                const latest = data.latest;
                if (!latest) return;

                const { air_quality, temperature, humidity, ratio } = latest;

                document.getElementById("AirQualityText").textContent = `AirQuality: ${air_quality}`;
                document.getElementById("TemperatureText").textContent = `Temperature: ${temperature}°C`;
                document.getElementById("HumidityText").textContent = `Humidity: ${humidity}%`;

                const now = Date.now();
                if (ratio > 1.5 && now - lastNotificationTime > cooldownDuration) {
                    if (Notification.permission === "granted") {
                        new Notification("Larry kriegt keine Luft!", {
                            body: "Bitte lüften!",
                            icon: "icon.png"
                        });
                        lastNotificationTime = now;
                        localStorage.setItem("lastNotificationTime", lastNotificationTime);
                    }
                }
            })
            .catch(error => console.error("Fehler beim Abrufen der Luftdaten:", error));
    }

function checkTodayLightWithoutMovement() {
  fetch("php/unload_light.php")
    .then((response) => response.json())
    .then((data) => {
      const today = new Date().toISOString().split('T')[0];
      const summary = data.summary;
      const recent = data.recent;

      if (!summary[today]) return;

      const currentCount = summary[today].without_movement || 0;
      const now = Date.now();
      const cooldownPassed = now - lastLightNotification > cooldownDuration;

      // --- Load counters ---
      const storedSuccesses = JSON.parse(localStorage.getItem("larrySuccesses") || "{}");
      const storedNotifs = JSON.parse(localStorage.getItem("larryNotifications") || "{}");

      // Initialize today’s counters if not present
      if (!storedSuccesses[today]) storedSuccesses[today] = 0;
      if (!storedNotifs[today]) storedNotifs[today] = 0;

      // --- Send notification if needed ---
      if (currentCount > lastTodayNoMovement && cooldownPassed) {
        if (Notification.permission === "granted") {
          new Notification("Larry ist traurig :(", {
            body: "Das Licht im deinem Raum ist an und Larry ist alleine.",
            icon: "icon.png"
          });

          lastLightNotification = now;
          localStorage.setItem("lastLightNotification", lastLightNotification);

          // Count notification
          storedNotifs[today]++;
          localStorage.setItem("larryNotifications", JSON.stringify(storedNotifs));
        }
      }

      // --- Detect light off within 3 minutes after notification ---
      const notificationTime = parseInt(localStorage.getItem("lastLightNotification")) || 0;
      const lightOffDetected = recent.some((entry, index) => {
        const entryTime = new Date(entry.timestamp).getTime();
        const lightWasOn = index > 0 && recent[index - 1].light >= 2200;
        const lightNowOff = entry.light < 2200;
        const within3Minutes = entryTime - notificationTime > 0 && entryTime - notificationTime <= 3 * 60 * 1000;
        return lightWasOn && lightNowOff && within3Minutes;
      });

      if (lightOffDetected) {
        storedSuccesses[today]++;
        localStorage.setItem("larrySuccesses", JSON.stringify(storedSuccesses));
        new Notification("Danke fürs Ausschalten!", { 
            body: "Larry freut sich :)", 
            icon: "icon.png" 
        });
        console.log("✅ Larry-Erfolg! Heute:", storedSuccesses[today]);
      }

      // --- Persist updated daily no-movement count ---
      lastTodayNoMovement = currentCount;
      localStorage.setItem("lastTodayNoMovement", lastTodayNoMovement);
    })
    .catch((error) => {
      console.error("Fehler beim Abrufen der Lichtdaten:", error);
    });
}



    // Check alle 60 Sekunden
    checkAirQuality();
    checkTodayLightWithoutMovement();
    setInterval(() => {
        checkAirQuality();
        checkTodayLightWithoutMovement();
    }, 60000);
});
