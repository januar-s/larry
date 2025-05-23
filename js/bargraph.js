document.addEventListener("DOMContentLoaded", function () {
  const ctx = document.getElementById("bargraph").getContext("2d");

  fetch("php/unload_light.php")
    .then((response) => response.json())
    .then((data) => {
      const summary = data.summary;

      const dayNames = ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"];
      const weekdayMap = {
        "Mo": 0, "Di": 0, "Mi": 0, "Do": 0, "Fr": 0, "Sa": 0, "So": 0
      };
      const withoutMovementMap = { ...weekdayMap };

      for (const date in summary) {
        const weekday = dayNames[new Date(date).getDay()];
        weekdayMap[weekday] += summary[date].with_movement;
        withoutMovementMap[weekday] += summary[date].without_movement;
      }

      const weekOrder = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"];
      const withMovement = weekOrder.map(day => weekdayMap[day]);
      const withoutMovement = weekOrder.map(day => withoutMovementMap[day]);

      new Chart(ctx, {
        type: "bar",
        data: {
          labels: weekOrder,
          datasets: [
            {
              label: "Licht an",
              data: withMovement,
              backgroundColor: "#FFCE79",
              borderWidth: 1
            },
            {
              label: "Licht an ohne Bewegung",
              data: withoutMovement,
              backgroundColor: "#FFFF99",
              borderWidth: 1
            }
          ]
        },
        options: {
          indexAxis: "x", // Horizontal bars
          responsive: true,
          maintainAspectRatio: false,
      
          // 👇 THIS is the scales section
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: "Anzahl Ereignisse"
              },
              ticks: {
                stepSize: 1,
                callback: function(value) {
                  return Number.isInteger(value) ? value : null;
                }
              }
            },
            x: {
              title: {
                display: true,
                text: "Wochentag"
              }
            }
          },
      
          plugins: {
            legend: {
              position: "bottom"
            }
          }
        }
      });
    })
    .catch((error) => {
      console.error("Fehler beim Laden der Lichtdaten:", error);
    });
});
