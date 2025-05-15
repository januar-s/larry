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

  // Fetch new data and update chart
  fetch("php/unload_gas.php")
    .then((response) => response.json())
    .then((data) => {
      const entries = data.averages;
      myChart.data.labels = entries.map(e => e.time_block.slice(11, 16));
      myChart.data.datasets[0].data = entries.map(e => e.avg_ratio);
      myChart.update();
    });
});