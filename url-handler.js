// URL Handler for clean URLs - Client-side fallback
(function() {
    'use strict';
    
    // Route mappings
    const routes = {
        '/': 'index.html',
        '/home': 'index.html',
        '/about': 'about.html',
        '/programs': 'service.html',
        '/contact': 'contact.html',
        '/coaching-staff': 'coachingstaff.html',
        '/achievements': 'achievements.html',
        '/facilities': 'facilities.html',
        '/academy-life': 'academy-life.html',
        '/news': 'news.html',
        '/registration': 'registration.html'
    };
    
    // Function to handle navigation
    function handleNavigation(event) {
        const link = event.target.closest('a');
        if (!link) return;
        
        const href = link.getAttribute('href');
        if (!href || href.startsWith('http') || href.startsWith('#') || href.includes('.')) return;
        
        event.preventDefault();
        
        // Map clean URL to actual file
        const actualFile = routes[href] || href + '.html';
        
        // Check if file exists by trying to load it
        fetch(actualFile, { method: 'HEAD' })
            .then(response => {
                if (response.ok) {
                    window.location.href = actualFile;
                } else {
                    console.warn('File not found:', actualFile);
                    // Fallback: try with .html extension
                    window.location.href = href + '.html';
                }
            })
            .catch(() => {
                // Fallback: try with .html extension
                window.location.href = href + '.html';
            });
    }
    
    // Add event listener when DOM is ready
    document.addEventListener('DOMContentLoaded', function() {
        document.addEventListener('click', handleNavigation);
    });
    
    // Handle browser back/forward buttons
    window.addEventListener('popstate', function(event) {
        const path = window.location.pathname;
        const actualFile = routes[path] || path + '.html';
        
        if (path !== '/' && !path.includes('.')) {
            window.location.replace(actualFile);
        }
    });
})();