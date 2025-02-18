// Mock data for regional results
const regions = [
    { name: 'Northeast', votes: 2345678, leading: 'Sarah Johnson', margin: '3.2%', reporting: '82%' },
    { name: 'Midwest', votes: 1987654, leading: 'Michael Roberts', margin: '5.1%', reporting: '78%' },
    { name: 'South', votes: 3456789, leading: 'Michael Roberts', margin: '2.8%', reporting: '85%' },
    { name: 'West', votes: 2123456, leading: 'Emily Chen', margin: '4.3%', reporting: '71%' }
];

// Update total votes counter with animation
function updateTotalVotes() {
    const totalVotesElement = document.getElementById('totalVotes');
    let currentVotes = 0;
    const targetVotes = 9913577;
    const duration = 2000; // 2 seconds
    const steps = 60;
    const increment = targetVotes / steps;

    const interval = setInterval(() => {
        currentVotes += increment;
        if (currentVotes >= targetVotes) {
            currentVotes = targetVotes;
            clearInterval(interval);
        }
        totalVotesElement.textContent = Math.floor(currentVotes).toLocaleString();
    }, duration / steps);
}

// Populate regional results table
function populateRegionalTable() {
    const tableBody = document.getElementById('regionalResults');
    regions.forEach(region => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${region.name}</td>
            <td>${region.votes.toLocaleString()}</td>
            <td>${region.leading}</td>
            <td>${region.margin}</td>
            <td>
                <div class="progress" style="height: 20px;">
                    <div class="progress-bar" role="progressbar" 
                         style="width: ${region.reporting};" 
                         aria-valuenow="${parseInt(region.reporting)}" 
                         aria-valuemin="0" 
                         aria-valuemax="100">
                        ${region.reporting}
                    </div>
                </div>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// Simulate live updates
function simulateLiveUpdates() {
    setInterval(() => {
        // Update random candidate percentages
        document.querySelectorAll('.vote-percentage h3').forEach(el => {
            const currentValue = parseFloat(el.textContent);
            const change = (Math.random() - 0.5) * 0.2;
            const newValue = Math.max(0, Math.min(100, currentValue + change));
            el.textContent = newValue.toFixed(1) + '%';

            // Update progress bar
            const progressBar = el.nextElementSibling.querySelector('.progress-bar');
            progressBar.style.width = newValue + '%';
        });

        // Update charts
        updateCharts();
    }, 5000);
}

// Handle voting functionality
document.addEventListener('DOMContentLoaded', () => {
    // Initialize existing functionality
    updateTotalVotes();
    populateRegionalTable();
    simulateLiveUpdates();

    // Add search functionality
    const searchForm = document.getElementById('searchForm');
    searchForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const region = document.getElementById('searchRegion').value;
        const province = document.getElementById('searchProvince').value;
        const district = document.getElementById('searchDistrict').value;

        try {
            const response = await fetch(`/search?region=${region}&province=${province}&district=${district}`);
            const data = await response.json();
            
            const resultsDiv = document.getElementById('searchResults');
            resultsDiv.innerHTML = `
                <h5>Results:</h5>
                <ul class="list-group">
                    ${Object.entries(data).map(([candidate, votes]) => `
                        <li class="list-group-item d-flex justify-content-between align-items-center">
                            ${candidate}
                            <span class="badge bg-primary rounded-pill">${votes} votes</span>
                        </li>
                    `).join('')}
                </ul>
            `;
        } catch (error) {
            console.error('Error fetching search results:', error);
        }
    });

    // Add voting functionality
    const voteForm = document.getElementById('voteForm');
    const voteMessage = document.getElementById('voteMessage');
    const votingSection = document.getElementById('votingSection');

    voteForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = new FormData(voteForm);
        const selectedCandidate = formData.get('candidate');

        if (!selectedCandidate) {
            showVoteMessage('Please select a candidate', 'error');
            return;
        }

        try {
            const response = await fetch('/vote', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ candidate: selectedCandidate }),
            });

            const data = await response.json();

            if (response.ok) {
                showVoteMessage('Thank you for voting! Your vote for ' + selectedCandidate + ' has been recorded.', 'success');
                votingSection.classList.add('voted');
                voteForm.reset();

                // Disable all inputs and the submit button
                voteForm.querySelectorAll('input, button').forEach(element => {
                    element.disabled = true;
                });

                // Add message indicating vote was cast
                const votedMessage = document.createElement('div');
                votedMessage.className = 'alert alert-info mt-3';
                votedMessage.textContent = 'You have already cast your vote. Thank you for participating!';
                voteForm.appendChild(votedMessage);

                // Update the charts with new data
                updateChartsAfterVote(selectedCandidate);
            } else {
                if (response.status === 403) {
                    showVoteMessage('You have already voted. Only one vote per person is allowed.', 'error');
                    votingSection.classList.add('voted');
                    voteForm.querySelectorAll('input, button').forEach(element => {
                        element.disabled = true;
                    });
                } else {
                    showVoteMessage(data.error || 'Error submitting vote. Please try again.', 'error');
                }
            }
        } catch (error) {
            showVoteMessage('Error submitting vote. Please try again.', 'error');
        }
    });
});

function showVoteMessage(message, type) {
    const voteMessage = document.getElementById('voteMessage');
    voteMessage.textContent = message;
    voteMessage.className = type;
    voteMessage.style.display = 'block';

    setTimeout(() => {
        voteMessage.style.display = 'none';
    }, 5000);
}

function updateChartsAfterVote(candidate) {
    // Update national chart
    if (window.nationalChart) {
        const data = window.nationalChart.data.datasets[0].data;
        const labels = window.nationalChart.data.labels;
        const index = labels.indexOf(candidate);
        if (index !== -1) {
            data[index] += 0.1;
            window.nationalChart.update();
        }
    }

    // Update total votes
    const totalVotesElement = document.getElementById('totalVotes');
    const currentVotes = parseInt(totalVotesElement.textContent.replace(/,/g, ''));
    totalVotesElement.textContent = (currentVotes + 1).toLocaleString();
}

// Initialize the dashboard