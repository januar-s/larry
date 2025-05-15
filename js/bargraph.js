document.addEventListener("DOMContentLoaded", function () {
  const ctx = document.getElementById("bargraph").getContext("2d");

  const days = ["mo", "di", "mi", "do", "fr", "sa", "so"];
  const lightOn = [4, 3, 2, 5, 3, 1, 0]; // Anzahl wie oft Licht >15min an war
  const lightNoMotion = [2, 1, 1, 3, 1, 0, 0]; // Anzahl wie oft Licht >10min ohne Bewegung

  new Chart(ctx, {
    type: "bar",
    data: {
      labels: days,
      datasets: [
        {
          label: "Licht > 15min an",
          data: lightOn,
          backgroundColor: "#FFCE79",
          borderWidth: 1,
        },
        {
          label: "Licht >10min ohne Bewegung",
          data: lightNoMotion,
          backgroundColor: "#FFFF99",
          borderWidth: 1,
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
});
