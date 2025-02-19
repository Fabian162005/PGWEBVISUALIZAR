// Mock data for regional results
const regions = [
    { name: 'Northeast', votes: 2345678, leading: 'Sarah Johnson', margin: '3.2%', reporting: '82%' },
    { name: 'Midwest', votes: 1987654, leading: 'Michael Roberts', margin: '5.1%', reporting: '78%' },
    { name: 'South', votes: 3456789, leading: 'Michael Roberts', margin: '2.8%', reporting: '85%' },
    { name: 'West', votes: 2123456, leading: 'Emily Chen', margin: '4.3%', reporting: '71%' }
];

// Mock data for locations and candidates
const locations = {
    'Piura': {
        districts: {
            'Piura': ['Zona 1', 'Zona 2', 'Zona 3'],
            'Castilla': ['Zona 1', 'Zona 2'],
            'Catacaos': ['Zona 1', 'Zona 2', 'Zona 3']
        }
    },
    'Ayabaca': {
        districts: {
            'Ayabaca': ['Zona 1', 'Zona 2'],
            'Lagunas': ['Zona 1', 'Zona 2'],
            'Pacaipampa': ['Zona 1', 'Zona 2', 'Zona 3']
        }
    },
    'Huancabamba': {
        districts: {
            'Huancabamba': ['Zona 1', 'Zona 2'],
            'Canchaque': ['Zona 1', 'Zona 2', 'Zona 3'],
            'Sondor': ['Zona 1', 'Zona 2']
        }
    },
    'Morropón': {
        districts: {
            'Chulucanas': ['Zona 1', 'Zona 2', 'Zona 3'],
            'Morropón': ['Zona 1', 'Zona 2'],
            'Buenos Aires': ['Zona 1', 'Zona 2', 'Zona 3']
        }
    }
};

const candidatesByLocation = {
    'Piura-Piura-Zona 1': [
        { name: 'Sarah Johnson', party: 'Democratic Party' },
        { name: 'Michael Roberts', party: 'Republican Party' },
        { name: 'Emily Chen', party: 'Independent' }
    ]
};


// Update total votes counter with animation
function updateTotalVotes() {
    const totalVotesElement = document.getElementById('totalVotes');
    let currentVotes = 0;
    const targetVotes = 9913577;
    const duration = 2000;
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
    tableBody.innerHTML = '';
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

// Initialize location selectors
document.addEventListener('DOMContentLoaded', () => {
    const provinceSelect = document.getElementById('province');
    const districtSelect = document.getElementById('district');
    const zoneSelect = document.getElementById('zone');
    const locationForm = document.getElementById('locationForm');
    const voteForm = document.getElementById('voteForm');

    Object.keys(locations).forEach(province => {
        provinceSelect.add(new Option(province, province));
    });

    provinceSelect.addEventListener('change', () => {
        districtSelect.innerHTML = '<option value="">Seleccione Distrito</option>';
        zoneSelect.innerHTML = '<option value="">Seleccione Zona</option>';
        
        if (provinceSelect.value) {
            Object.keys(locations[provinceSelect.value].districts).forEach(district => {
                districtSelect.add(new Option(district, district));
            });
            districtSelect.disabled = false;
        } else {
            districtSelect.disabled = true;
            zoneSelect.disabled = true;
        }
    });

    districtSelect.addEventListener('change', () => {
        zoneSelect.innerHTML = '<option value="">Seleccione Zona</option>';
        
        if (districtSelect.value) {
            locations[provinceSelect.value].districts[districtSelect.value].forEach(zone => {
                zoneSelect.add(new Option(zone, zone));
            });
            zoneSelect.disabled = false;
        } else {
            zoneSelect.disabled = true;
        }
    });

    locationForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const locationKey = `${provinceSelect.value}-${districtSelect.value}-${zoneSelect.value}`;
        const candidates = candidatesByLocation[locationKey] || [];
        updateCandidatesForm(candidates);
        voteForm.classList.remove('d-none');
    });

    updateTotalVotes();
    populateRegionalTable();
});

function updateCandidatesForm(candidates) {
    const candidatesContainer = document.querySelector('#voteForm .row');
    candidatesContainer.innerHTML = '';

    candidates.forEach(candidate => {
        const div = document.createElement('div');
        div.className = 'col-md-4 mb-3';
        div.innerHTML = `
            <div class="form-check">
                <input class="form-check-input" type="radio" name="candidate" value="${candidate.name}" required>
                <label class="form-check-label">
                    ${candidate.name} (${candidate.party})
                </label>
            </div>
        `;
        candidatesContainer.appendChild(div);
    });

    
}
