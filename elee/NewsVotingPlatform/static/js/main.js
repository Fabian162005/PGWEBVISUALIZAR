// Main application initialization
document.addEventListener('DOMContentLoaded', function() {
    // Initialize news
    loadNews();
    
    // Initialize polls
    initializePolls();
    
    // Setup periodic updates
    setInterval(updatePollResults, 5000); // Update every 5 seconds
});

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});
