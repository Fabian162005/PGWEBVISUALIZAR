// Mock news data
const newsData = [
    {
        title: "Debate presidencial marca récord de audiencia",
        content: "El último debate presidencial alcanzó niveles históricos de audiencia con más de 10 millones de espectadores.",
        image: "https://placehold.co/600x400?text=Debate",
        date: "2024-02-20"
    },
    {
        title: "Nuevas propuestas económicas generan debate",
        content: "Los candidatos presentan sus planes económicos generando diversas reacciones en expertos y ciudadanos.",
        image: "https://placehold.co/600x400?text=Economia",
        date: "2024-02-19"
    },
    {
        title: "Encuestas muestran cerrada contienda electoral",
        content: "Las últimas encuestas revelan una diferencia mínima entre los principales candidatos presidenciales.",
        image: "https://placehold.co/600x400?text=Encuestas",
        date: "2024-02-18"
    }
];

// Function to load news
function loadNews() {
    const newsContainer = document.getElementById('news-container');
    
    newsData.forEach(news => {
        const newsElement = createNewsCard(news);
        newsContainer.appendChild(newsElement);
    });
}

// Function to create news card
function createNewsCard(news) {
    const col = document.createElement('div');
    col.className = 'col-md-4 mb-4';
    
    col.innerHTML = `
        <div class="card news-card">
            <img src="${news.image}" class="card-img-top" alt="${news.title}">
            <div class="card-body">
                <h5 class="card-title">${news.title}</h5>
                <p class="card-text">${news.content}</p>
                <p class="card-text">
                    <small class="text-muted">
                        <i class="fas fa-calendar-alt me-2"></i>${news.date}
                    </small>
                </p>
            </div>
        </div>
    `;
    
    return col;
}
