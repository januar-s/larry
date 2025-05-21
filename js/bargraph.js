document.addEventListener("DOMContentLoaded", function () {
  const ctx = document.getElementById("bargraph").getContext("2d");

  fetch("php/unload_light_data.php")
    .then(response => response.json())
    .then(data => {
      const dates = Object.keys(data); // z.B. ["2025-05-14", "2025-05-15"]
      const withMovement = dates.map(date => data[date].with_movement);
      const withoutMovement = dates.map(date => data[date].without_movement);

      new Chart(ctx, {
        type: "bar",
        data: {
          labels: dates,
          datasets: [
            {
              label: "Licht > 15min an",
              data: withMovement,
              backgroundColor: "#FFFF99", // Gelb
              borderWidth: 1
            },
            {
              label: "Licht > 10min ohne Bewegung",
              data: withoutMovement,
              backgroundColor: "#FFCE79", // Orange 
              borderWidth: 1
            }
          ]
        },
        options: {
          indexAxis: "y", // horizontale Balken
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            x: {
              beginAtZero: true,
              title: {
                display: true,
                text: "Anzahl Ereignisse"
              }
            },
            y: {
              title: {
                display: true,
                text: "Datum"
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
    .catch(error => {
      console.error("Fehler beim Laden der Lichtdaten:", error);
    });
});
