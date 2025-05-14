(async function () {
  // Example dummy data (can be removed if not needed)
  const data = [
    { year: 2010, count: 10 },
    { year: 2011, count: 20 },
    { year: 2012, count: 15 },
    { year: 2013, count: 25 },
    { year: 2014, count: 22 },
    { year: 2015, count: 30 },
    { year: 2016, count: 28 },
  ];

  new Chart(document.getElementById('linegraph'), {
    type: 'line',
    data: {
      labels: data.map((row) => row.year),
      datasets: [
        {
          label: 'Aktuelle Luftqualität',
          data: data.map((row) => row.count),
        },
      ],
    },
  });
})();

document.addEventListener("DOMContentLoaded", function () {
  fetch("php/unload_gas.php")
    .then((response) => response.json())
    .then((data) => {
      console.log("Sensor-Average-Daten (Halbstundenblöcke):", data.averages);
    })
    .catch((error) => {
      console.error("Fehler beim Laden der Daten:", error);
    });
});
