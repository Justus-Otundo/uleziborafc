(function ($) {
    "use strict";

    // Responsive Navbar with Enhanced Mobile Support
    $(window).scroll(function () {
        if ($(this).scrollTop() > 0) {
            $('.navbar').addClass('fixed-top shadow-sm scrolled').css('position', 'fixed');
            // Adjust body padding based on navbar height for different screen sizes
            var navbarHeight = $('.navbar').outerHeight();
            $('body').css('padding-top', navbarHeight);
        } else {
            $('.navbar').removeClass('fixed-top shadow-sm scrolled').css('position', '');
            $('body').css('padding-top', 0);
        }
    });
    
    // Enhanced Dropdown with Touch Support
    $(document).ready(function () {
        function toggleNavbarMethod() {
            if ($(window).width() > 992) {
                $('.navbar .dropdown').on('mouseover', function () {
                    $('.dropdown-toggle', this).trigger('click');
                }).on('mouseout', function () {
                    $('.dropdown-toggle', this).trigger('click').blur();
                });
            } else {
                $('.navbar .dropdown').off('mouseover').off('mouseout');
            }
        }
        toggleNavbarMethod();
        $(window).resize(toggleNavbarMethod);
    });
    
    // Responsive Back to Top Button
    $(window).scroll(function () {
        if ($(this).scrollTop() > 100) {
            $('.back-to-top').fadeIn('slow');
        } else {
            $('.back-to-top').fadeOut('slow');
        }
    });
    
    $('.back-to-top').click(function () {
        $('html, body').animate({scrollTop: 0}, 1500, 'easeInOutExpo');
        return false;
    });

    // Enhanced Testimonials Carousel with Responsive Settings
    $(".testimonial-carousel").owlCarousel({
        autoplay: true,
        autoplayTimeout: 5000,
        autoplayHoverPause: true,
        smartSpeed: 1000,
        items: 1,
        dots: false,
        loop: true,
        nav: true,
        navText: [
            '<i class="bi bi-arrow-left"></i>',
            '<i class="bi bi-arrow-right"></i>'
        ],
        responsive: {
            0: {
                nav: false,
                dots: true
            },
            768: {
                nav: true,
                dots: false
            }
        }
    });

    // Responsive Image Loading and Optimization
    function optimizeImages() {
        // Lazy loading for images
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.classList.remove('img-lazy');
                        img.classList.add('loaded');
                        imageObserver.unobserve(img);
                    }
                });
            });

            document.querySelectorAll('img[data-src]').forEach(img => {
                imageObserver.observe(img);
            });
        }

        // Enhanced responsive image sizing for better laptop display
        function adjustImageSizes() {
            const screenWidth = $(window).width();
            const screenHeight = $(window).height();
            
            $('.carousel-item, .carousel-item div[style*="height"]').each(function() {
                let newHeight;
                
                if (screenWidth <= 575) {
                    newHeight = '350px';
                } else if (screenWidth <= 767) {
                    newHeight = '400px';
                } else if (screenWidth <= 991) {
                    newHeight = '450px';
                } else if (screenWidth <= 1199) {
                    newHeight = '500px';
                } else if (screenWidth <= 1399) {
                    // Laptop screen optimization
                    if (screenHeight <= 768) {
                        newHeight = '480px'; // For 1366x768 laptops
                    } else {
                        newHeight = '520px'; // For higher resolution laptops
                    }
                } else {
                    newHeight = '600px'; // Large desktop screens
                }
                
                $(this).css('height', newHeight);
            });
            
            $('.carousel-item img').each(function() {
                let newHeight;
                
                if (screenWidth <= 575) {
                    newHeight = '350px';
                } else if (screenWidth <= 767) {
                    newHeight = '400px';
                } else if (screenWidth <= 991) {
                    newHeight = '450px';
                } else if (screenWidth <= 1199) {
                    newHeight = '500px';
                } else if (screenWidth <= 1399) {
                    // Laptop screen optimization
                    if (screenHeight <= 768) {
                        newHeight = '480px';
                        $(this).css('object-position', 'center top');
                    } else {
                        newHeight = '520px';
                        $(this).css('object-position', 'center');
                    }
                } else {
                    newHeight = '600px';
                    $(this).css('object-position', 'center');
                }
                
                $(this).css({
                    'height': newHeight,
                    'object-fit': 'cover',
                    'width': '100%'
                });
            });
            
            // Adjust carousel container max-height
            $('#header-carousel').css('max-height', $('.carousel-item').first().css('height'));
        }

        adjustImageSizes();
        $(window).resize(adjustImageSizes);
    }

    // Touch and Gesture Support
    function initTouchSupport() {
        // Add touch-friendly classes for mobile devices
        if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
            $('body').addClass('touch-device');
            
            // Enhance button touch targets
            $('.btn').addClass('touch-friendly');
            $('.nav-link').addClass('touch-friendly');
            
            // Add touch feedback
            $('.btn, .nav-link, .service-item, .team-item').on('touchstart', function() {
                $(this).addClass('touch-active');
            }).on('touchend', function() {
                $(this).removeClass('touch-active');
            });
        }
    }

    // Responsive Form Enhancements
    function enhanceForms() {
        // Auto-resize textareas
        $('textarea').on('input', function() {
            this.style.height = 'auto';
            this.style.height = (this.scrollHeight) + 'px';
        });

        // Enhanced form validation with responsive messages
        $('form').on('submit', function(e) {
            const form = $(this);
            let isValid = true;
            
            form.find('input[required], select[required], textarea[required]').each(function() {
                if (!this.value.trim()) {
                    isValid = false;
                    $(this).addClass('is-invalid');
                } else {
                    $(this).removeClass('is-invalid');
                }
            });

            if (!isValid) {
                e.preventDefault();
                // Show responsive error message
                if ($(window).width() <= 767) {
                    alert('Please fill in all required fields.');
                } else {
                    // Show inline validation messages for larger screens
                    form.find('.is-invalid').first().focus();
                }
            }
        });
    }

    // Responsive Navigation Enhancements
    function enhanceNavigation() {
        // Mobile menu improvements
        $('.navbar-toggler').on('click', function() {
            setTimeout(() => {
                if ($('.navbar-collapse').hasClass('show')) {
                    $('body').addClass('nav-open');
                } else {
                    $('body').removeClass('nav-open');
                }
            }, 100);
        });

        // Close mobile menu when clicking outside
        $(document).on('click', function(e) {
            if (!$(e.target).closest('.navbar').length && $('.navbar-collapse').hasClass('show')) {
                $('.navbar-toggler').click();
            }
        });

        // Smooth scrolling for anchor links
        $('a[href^="#"]').on('click', function(e) {
            e.preventDefault();
            const target = $(this.getAttribute('href'));
            if (target.length) {
                const offset = $('.navbar').outerHeight() + 20;
                $('html, body').animate({
                    scrollTop: target.offset().top - offset
                }, 1000);
            }
        });
    }

    // Performance Optimizations
    function optimizePerformance() {
        // Debounce resize events
        let resizeTimer;
        $(window).on('resize', function() {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(function() {
                // Trigger custom resize event
                $(window).trigger('debouncedResize');
            }, 250);
        });

        // Optimize scroll events
        let scrollTimer;
        $(window).on('scroll', function() {
            clearTimeout(scrollTimer);
            scrollTimer = setTimeout(function() {
                // Trigger custom scroll event
                $(window).trigger('debouncedScroll');
            }, 10);
        });
    }

    // Accessibility Enhancements
    function enhanceAccessibility() {
        // Add keyboard navigation support
        $('.service-item, .team-item, .blog-item').attr('tabindex', '0');
        
        // Enhanced focus management
        $('.service-item, .team-item, .blog-item').on('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                $(this).click();
            }
        });

        // Skip to main content link
        if (!$('#skip-to-main').length) {
            $('body').prepend('<a href="#main-content" id="skip-to-main" class="sr-only sr-only-focusable">Skip to main content</a>');
        }

        // Add main content landmark
        if (!$('#main-content').length) {
            $('.container-fluid').first().attr('id', 'main-content');
        }
    }

    // Responsive Utilities
    function addResponsiveUtilities() {
        // Add screen size classes to body
        function updateScreenSizeClass() {
            const width = $(window).width();
            $('body').removeClass('screen-xs screen-sm screen-md screen-lg screen-xl');
            
            if (width < 576) {
                $('body').addClass('screen-xs');
            } else if (width < 768) {
                $('body').addClass('screen-sm');
            } else if (width < 992) {
                $('body').addClass('screen-md');
            } else if (width < 1200) {
                $('body').addClass('screen-lg');
            } else {
                $('body').addClass('screen-xl');
            }
        }

        updateScreenSizeClass();
        $(window).on('debouncedResize', updateScreenSizeClass);

        // Responsive text sizing
        function adjustTextSizes() {
            const width = $(window).width();
            
            if (width <= 575) {
                $('.display-1').css('font-size', '2rem');
                $('.display-4').css('font-size', '1.5rem');
                $('.display-5').css('font-size', '1.3rem');
            } else if (width <= 767) {
                $('.display-1').css('font-size', '2.5rem');
                $('.display-4').css('font-size', '1.8rem');
                $('.display-5').css('font-size', '1.5rem');
            } else {
                $('.display-1, .display-4, .display-5').css('font-size', '');
            }
        }

        adjustTextSizes();
        $(window).on('debouncedResize', adjustTextSizes);
    }

    // Animation and Transition Enhancements
    function enhanceAnimations() {
        // Respect user's motion preferences
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            $('*').css({
                'animation-duration': '0.01ms !important',
                'animation-iteration-count': '1 !important',
                'transition-duration': '0.01ms !important'
            });
        }

        // Intersection Observer for animations
        if ('IntersectionObserver' in window) {
            const animationObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('animate-in');
                    }
                });
            }, {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            });

            document.querySelectorAll('.service-item, .team-item, .blog-item').forEach(el => {
                animationObserver.observe(el);
            });
        }
    }

    // Initialize all enhancements
    $(document).ready(function() {
        optimizeImages();
        initTouchSupport();
        enhanceForms();
        enhanceNavigation();
        optimizePerformance();
        enhanceAccessibility();
        addResponsiveUtilities();
        enhanceAnimations();

        // Add loading complete class
        setTimeout(() => {
            $('body').addClass('loaded');
        }, 100);
    });

    // Handle orientation changes
    $(window).on('orientationchange', function() {
        setTimeout(() => {
            $(window).trigger('resize');
        }, 500);
    });

    // Service Worker Registration for PWA capabilities
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', function() {
            navigator.serviceWorker.register('/sw.js').then(function(registration) {
                console.log('ServiceWorker registration successful');
            }, function(err) {
                console.log('ServiceWorker registration failed');
            });
        });
    }

})(jQuery);

// Add CSS for enhanced animations
const style = document.createElement('style');
style.textContent = `
    .touch-active {
        transform: scale(0.98);
        transition: transform 0.1s ease;
    }
    
    .animate-in {
        animation: fadeInUp 0.6s ease forwards;
    }
    
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .sr-only {
        position: absolute !important;
        width: 1px !important;
        height: 1px !important;
        padding: 0 !important;
        margin: -1px !important;
        overflow: hidden !important;
        clip: rect(0, 0, 0, 0) !important;
        white-space: nowrap !important;
        border: 0 !important;
    }
    
    .sr-only-focusable:focus {
        position: static !important;
        width: auto !important;
        height: auto !important;
        padding: 0.5rem 1rem !important;
        margin: 0 !important;
        overflow: visible !important;
        clip: auto !important;
        white-space: normal !important;
        background: #007bff !important;
        color: white !important;
        text-decoration: none !important;
        border-radius: 0.25rem !important;
        z-index: 9999 !important;
    }
    
    @media (prefers-reduced-motion: reduce) {
        .animate-in {
            animation: none !important;
        }
    }
`;
document.head.appendChild(style);

