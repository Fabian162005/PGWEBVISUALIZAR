// Mock candidates data
const candidates = [
    { id: 1, name: "María González", party: "Partido Progresista" },
    { id: 2, name: "Carlos Rodríguez", party: "Partido Democrático" },
    { id: 3, name: "Ana Martínez", party: "Partido Renovación" }
];

// Mock poll results
let pollResults = {
    1: 34,
    2: 38,
    3: 28
};

// Initialize polls functionality
function initializePolls() {
    setupVotingForm();
    createPollsChart();
}

// Setup voting form
function setupVotingForm() {
    const container = document.getElementById('candidates-container');
    
    candidates.forEach(candidate => {
        const div = document.createElement('div');
        div.className = 'form-check';
        div.innerHTML = `
            <input class="form-check-input" type="radio" name="candidate" 
                   id="candidate${candidate.id}" value="${candidate.id}">
            <label class="form-check-label" for="candidate${candidate.id}">
                <strong>${candidate.name}</strong>
                <br>
                <small class="text-muted">${candidate.party}</small>
            </label>
        `;
        container.appendChild(div);
    });

    // Add form submission handler
    document.getElementById('voting-form').addEventListener('submit', handleVote);
}

// Handle vote submission
function handleVote(e) {
    e.preventDefault();
    
    const selectedCandidate = document.querySelector('input[name="candidate"]:checked');
    
    if (!selectedCandidate) {
        alert('Por favor selecciona un candidato');
        return;
    }

    const candidateId = parseInt(selectedCandidate.value);
    
    // Simulate vote registration
    pollResults[candidateId] += 1;
    
    // Update chart
    updatePollResults();
    
    // Show success message
    const btn = e.target.querySelector('button');
    const originalText = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-check"></i> ¡Voto registrado!';
    btn.disabled = true;
    
    setTimeout(() => {
        btn.innerHTML = originalText;
        btn.disabled = false;
        selectedCandidate.checked = false;
    }, 2000);
}

// Chart instance
let pollsChart;

// Create polls chart
function createPollsChart() {
    const ctx = document.getElementById('pollsChart').getContext('2d');
    
    pollsChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: candidates.map(c => c.name),
            datasets: [{
                label: 'Votos (%)',
                data: candidates.map(c => pollResults[c.id]),
                backgroundColor: [
                    'rgba(255, 99, 132, 0.5)',
                    'rgba(54, 162, 235, 0.5)',
                    'rgba(75, 192, 192, 0.5)'
                ],
                borderColor: [
                    'rgb(255, 99, 132)',
                    'rgb(54, 162, 235)',
                    'rgb(75, 192, 192)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100
                }
            },
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });
}

// Update poll results
function updatePollResults() {
    // Update chart data
    pollsChart.data.datasets[0].data = candidates.map(c => pollResults[c.id]);
    pollsChart.update();
}
