// Initialize charts when the document is ready
document.addEventListener('DOMContentLoaded', () => {
    initializeNationalChart();
});

// National Results Chart
function initializeNationalChart() {
    const ctx = document.getElementById('nationalChart').getContext('2d');
    const nationalChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Sarah Johnson', 'Michael Roberts', 'Emily Chen'],
            datasets: [{
                label: 'Votes (%)',
                data: [37.8, 35.2, 27.0],
                backgroundColor: [
                    '#0052cc',
                    '#dc3545',
                    '#ffc107'
                ],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    ticks: {
                        callback: function(value) {
                            return value + '%';
                        }
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });

    window.nationalChart = nationalChart;
}

// Update charts with new data
function updateCharts() {
    if (window.nationalChart) {
        window.nationalChart.data.datasets[0].data = window.nationalChart.data.datasets[0].data.map(value => {
            return Math.max(0, Math.min(100, value + (Math.random() - 0.5) * 0.5));
        });
        window.nationalChart.update();
    }
}