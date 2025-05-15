let myChart;

document.addEventListener("DOMContentLoaded", function () {
  const ctx = document.getElementById("linegraph").getContext("2d");

  myChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: [],
      datasets: [{
        label: "Air Quality Ratio",
        data: [],
        backgroundColor: "rgba(164, 194, 223, 0.2)",
        borderColor: "rgba(164, 194, 223, 1)",
        borderWidth: 2,
        tension: 0.3,
        pointRadius: 3
      }]
    },
    options: {
      responsive: true,
      scales: {
        x: { title: { display: true, text: 'Zeit' } },
        y: { title: { display: true, text: 'Luftqualitätsverhältnis' }, beginAtZero: true }
      }
    }
  });

  // 👇 Define update function
  function updateData() {
    fetch("php/unload_gas.php")
      .then((response) => response.json())
      .then((data) => {
        // Update chart
        const entries = data.averages;
        myChart.data.labels = entries.map(e => e.time_block.slice(11, 16));
        myChart.data.datasets[0].data = entries.map(e => e.avg_ratio);
        myChart.update();

        // Update latest readings
        const latest = data.latest;
        if (latest) {
          const airQualityEl = document.getElementById("AirQualityText");
          airQualityEl.textContent = "Air Quality: " + latest.air_quality;
          document.getElementById("TemperatureText").textContent = "Temperature: " + latest.temperature + " °C";
          document.getElementById("HumidityText").textContent = "Humidity: " + latest.humidity + " %";
        }
      })
      .catch((error) => {
        console.error("Fehler beim Laden der Daten:", error);
      });
  }

  // 🔁 Initial call
  updateData();

  // 🔁 Call every 60 seconds (60000 ms)
  setInterval(updateData, 60000);
});
