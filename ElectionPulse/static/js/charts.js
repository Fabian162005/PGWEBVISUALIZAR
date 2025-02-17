// Initialize charts when the document is ready
document.addEventListener('DOMContentLoaded', () => {
    initializeNationalChart();
    initializeTimelineChart();
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

// Timeline Chart
function initializeTimelineChart() {
    const ctx = document.getElementById('timelineChart').getContext('2d');
    const timelineChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['6:00 AM', '8:00 AM', '10:00 AM', '12:00 PM', '2:00 PM', '4:00 PM', 'Current'],
            datasets: [
                {
                    label: 'Sarah Johnson',
                    data: [32, 34, 35, 36, 37, 37.5, 37.8],
                    borderColor: '#0052cc',
                    tension: 0.4,
                    fill: false
                },
                {
                    label: 'Michael Roberts',
                    data: [30, 31, 32, 33, 34, 34.8, 35.2],
                    borderColor: '#dc3545',
                    tension: 0.4,
                    fill: false
                },
                {
                    label: 'Emily Chen',
                    data: [25, 25.5, 26, 26.2, 26.5, 26.8, 27],
                    borderColor: '#ffc107',
                    tension: 0.4,
                    fill: false
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 50,
                    ticks: {
                        callback: function(value) {
                            return value + '%';
                        }
                    }
                }
            },
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });

    window.timelineChart = timelineChart;
}

// Update charts with new data
function updateCharts() {
    // Update national chart with slight variations
    if (window.nationalChart) {
        window.nationalChart.data.datasets[0].data = window.nationalChart.data.datasets[0].data.map(value => {
            return Math.max(0, Math.min(100, value + (Math.random() - 0.5) * 0.5));
        });
        window.nationalChart.update();
    }

    // Add new data point to timeline
    if (window.timelineChart) {
        const lastValues = window.timelineChart.data.datasets.map(dataset => {
            return dataset.data[dataset.data.length - 1];
        });

        const newValues = lastValues.map(value => {
            return Math.max(0, Math.min(100, value + (Math.random() - 0.5) * 0.3));
        });

        const currentTime = new Date().toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });

        window.timelineChart.data.labels.push(currentTime);
        window.timelineChart.data.datasets.forEach((dataset, index) => {
            dataset.data.push(newValues[index]);
        });

        // Remove oldest data point if we have more than 8 points
        if (window.timelineChart.data.labels.length > 8) {
            window.timelineChart.data.labels.shift();
            window.timelineChart.data.datasets.forEach(dataset => {
                dataset.data.shift();
            });
        }

        window.timelineChart.update();
    }
}
