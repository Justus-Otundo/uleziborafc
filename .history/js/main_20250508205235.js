(function ($) {
    "use strict";

    // Sticky Navbar
    $(window).scroll(function () {
        if ($(this).scrollTop() > 0) {
            $('.navbar').addClass('fixed-top shadow-sm').css('position', 'fixed');
            $('body').css('padding-top', $('.navbar').outerHeight());
        } else {
            $('.navbar').removeClass('fixed-top shadow-sm').css('position', '');
            $('body').css('padding-top', 0);
        }
    });
    
    // Dropdown on mouse hover
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
    
    
    // Back to top button
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


    // Testimonials carousel
    $(".testimonial-carousel").owlCarousel({
        autoplay: true,
        smartSpeed: 1000,
        items: 1,
        dots: false,
        loop: true,
        nav : true,
        navText : [
            '<i class="bi bi-arrow-left"></i>',
            '<i class="bi bi-arrow-right"></i>'
        ],
    });
    
})(jQuery);

// Add this to your existing main.js file
document.addEventListener('DOMContentLoaded', function() {
    // Handle all navigation clicks
    document.querySelectorAll('.nav-link, .dropdown-item').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const page = this.getAttribute('data-page');
            const url = this.getAttribute('href');
            
            // Update URL without page reload
            window.history.pushState({page: page}, '', url);
            
            // Load the content
            loadPage(page);
        });
    });
    
    function loadPage(page) {
        const pageMap = {
            'home': 'index.html',
            'about': 'about.html',
            'teams': 'service.html',
            'coaching': 'coachingstaff.html',
            'training': 'trainingprograms.html',
            'contact': 'contact.html',
            'blog': 'blog.html',
            'blog-detail': 'detail.html',
            'features': 'feature.html',
            'register': 'quote.html',
            'testimonial': 'testimonial.html'
        };
        
        // Load the content using AJAX
        fetch(pageMap[page])
            .then(response => response.text())
            .then(html => {
                const content = new DOMParser()
                    .parseFromString(html, 'text/html')
                    .querySelector('.content-wrapper');
                document.querySelector('.content-wrapper').innerHTML = content.innerHTML;
                
                // Update active state in navbar
                document.querySelectorAll('.nav-link, .dropdown-item').forEach(link => {
                    link.classList.remove('active');
                    if(link.getAttribute('data-page') === page) {
                        link.classList.add('active');
                    }
                });
            });
    }
    
    // Handle browser back/forward buttons
    window.addEventListener('popstate', function(e) {
        if(e.state && e.state.page) {
            loadPage(e.state.page);
        }
    });
});

