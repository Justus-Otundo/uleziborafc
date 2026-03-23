// Performance Optimizations
document.addEventListener('DOMContentLoaded', function() {
    // Remove preloader when page is loaded
    const preloader = document.querySelector('.preloader');
    if (preloader) {
        preloader.classList.add('fade-out');
        setTimeout(() => {
            preloader.style.display = 'none';
        }, 500);
    }

    // Lazy load images
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.add('loaded');
                    observer.unobserve(img);
                }
            });
        });

        lazyImages.forEach(img => imageObserver.observe(img));
    }

    // Defer non-critical CSS
    const deferredStyles = document.querySelectorAll('link[rel="stylesheet"][data-defer]');
    deferredStyles.forEach(styleSheet => {
        styleSheet.setAttribute('rel', 'stylesheet');
        styleSheet.removeAttribute('data-defer');
    });

    // Initialize components only when needed
    const initializeComponent = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                if (element.dataset.component) {
                    // Initialize component based on data attribute
                    switch(element.dataset.component) {
                        case 'carousel':
                            // Initialize carousel when visible
                            if (typeof bootstrap !== 'undefined') {
                                new bootstrap.Carousel(element);
                            }
                            break;
                        // Add other components as needed
                    }
                    observer.unobserve(element);
                }
            }
        });
    };

    const componentObserver = new IntersectionObserver(initializeComponent, {
        threshold: 0.1
    });

    document.querySelectorAll('[data-component]').forEach(component => {
        componentObserver.observe(component);
    });
});

// Add font loading optimization
if ('fonts' in document) {
    Promise.all([
        document.fonts.load('1em Barlow'),
        document.fonts.load('1em "Open Sans"')
    ]).then(() => {
        document.documentElement.classList.add('fonts-loaded');
    });
}

// Add service worker for caching
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').then(registration => {
            console.log('ServiceWorker registration successful');
        }).catch(err => {
            console.log('ServiceWorker registration failed: ', err);
        });
    });
}
