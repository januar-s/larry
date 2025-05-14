import Chart from 'chart.js/auto'

(async function() {
  const data = [
    { timestamp: '2025-05-14 14:00', ratio: 0.75 },
    { timestamp: '2025-05-14 14:15', ratio: 0.9 },
    { timestamp: '2025-05-14 14:30', ratio: 0.65 },
    { timestamp: '2025-05-14 14:45', ratio: 0.8 },
    { timestamp: '2025-05-14 15:00', ratio: 1.5 },
    { timestamp: '2025-05-14 15:15', ratio: 1.2 },
    { timestamp: '2025-05-14 15:30', ratio: 1.3 },
  ];

  new Chart(
    document.getElementById('acquisitions'),
    {
      type: 'line',
      data: {
        labels: data.map(row => row.timestamp),
        datasets: [
          {
            label: 'Acquisitions by timestamp',
            data: data.map(row => row.ratio)
          }
        ]
      }
    }
  );
})();