document.addEventListener('DOMContentLoaded', function() {
    
    // ========================================
    // DEVICE DETECTION & SMART CTA BUTTON
    // ========================================
    function detectDevice() {
        const userAgent = navigator.userAgent || navigator.vendor || window.opera;
        
        if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
            return 'ios';
        }
        
        if (/Macintosh|MacIntel|MacPPC|Mac68K/.test(userAgent)) {
            return 'ios'; 
        }
        
        if (/android/i.test(userAgent)) {
            return 'android';
        }
        
        return 'unknown';
    }

    function updateCTAButton() {
        const device = detectDevice();
        const ctaButtons = document.querySelectorAll('.cta-button');
        
        ctaButtons.forEach(button => {
            if (device === 'ios') {
                button.href = 'https://apps.apple.com/app/apple-store/id6557064118?pt=127193764&ct=applewebv2&mt=8';
            } else if (device === 'android') {
                button.href = 'https://play.google.com/store/apps/details?id=com.algo_mobile&referrer=utm_source=website&utm_medium=cta&utm_campaign=sito_algofantacalcio';
            } else {
                button.href = '#';
            }
        });

        console.log(`📱 Device detected: ${device} - CTA link updated with UTM tracking`);
    }

    updateCTAButton();

    // ========================================
    // SMOOTH SCROLLING
    // ========================================
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

    // ========================================
    // HEADER SCROLL EFFECT
    // ========================================
    window.addEventListener('scroll', () => {
        const header = document.querySelector('header');
        if (header) {
            if (window.scrollY > 100) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }
    });

    // ========================================
    // CAROUSEL FUNCTIONALITY
    // ========================================
    let currentSlide = 0;
    const slides = document.querySelectorAll('.carousel-slide');
    const indicators = document.querySelectorAll('.carousel-indicators button');
    const totalSlides = slides.length;
    let autoplayInterval;
    const AUTO_SLIDE_DURATION = 6500; 

    function showSlide(index) {
        slides.forEach(slide => slide.classList.remove('active'));
        indicators.forEach(indicator => indicator.classList.remove('active'));
        
        if (slides[index]) {
            slides[index].classList.add('active');
        }
        if (indicators[index]) {
            indicators[index].classList.add('active');
        }
        
        currentSlide = index;
    }

    function nextSlide() {
        currentSlide = (currentSlide + 1) % totalSlides;
        showSlide(currentSlide);
    }

    function prevSlide() {
        currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
        showSlide(currentSlide);
    }

    function startAutoplay() {
        stopAutoplay(); 
        if (totalSlides > 1) {
            autoplayInterval = setInterval(nextSlide, AUTO_SLIDE_DURATION);
        }
    }

    function stopAutoplay() {
        if (autoplayInterval) {
            clearInterval(autoplayInterval);
            autoplayInterval = null;
        }
    }

    const nextButton = document.querySelector('.carousel-control.next');
    const prevButton = document.querySelector('.carousel-control.prev');

    if (nextButton) {
        nextButton.addEventListener('click', () => {
            nextSlide();
            startAutoplay(); 
        });
    }

    if (prevButton) {
        prevButton.addEventListener('click', () => {
            prevSlide();
            startAutoplay(); 
        });
    }

    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            showSlide(index);
            startAutoplay(); 
        });
        
        indicator.setAttribute('data-slide', index);
    });

    const carouselContainer = document.querySelector('.carousel-container');
    
    if (carouselContainer) {
        carouselContainer.addEventListener('mouseenter', stopAutoplay);
        carouselContainer.addEventListener('mouseleave', startAutoplay);
    }

    let touchStartX = 0;
    let touchEndX = 0;
    const MIN_SWIPE_DISTANCE = 50;
    
    if (carouselContainer) {
        carouselContainer.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
            stopAutoplay(); 
        });
        
        carouselContainer.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
            startAutoplay(); 
        });
    }
    
    function handleSwipe() {
        const swipeDistance = touchEndX - touchStartX;
        
        if (Math.abs(swipeDistance) > MIN_SWIPE_DISTANCE) {
            if (swipeDistance > 0) {
                prevSlide();
            } else {
                nextSlide(); 
            }
        }
    }

    document.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowLeft') {
            prevSlide();
            startAutoplay();
        } else if (e.key === 'ArrowRight') {
            nextSlide();
            startAutoplay();
        } else if (e.key === ' ' || e.key === 'Escape') {
            if (autoplayInterval) {
                stopAutoplay();
            } else {
                startAutoplay();
            }
            e.preventDefault();
        }
    });

    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            stopAutoplay();
        } else {
            startAutoplay();
        }
    });

    if (totalSlides > 0) {
        showSlide(0); 
        startAutoplay(); 
    }

    // ========================================
    // NEWSLETTER FORM
    // ========================================
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const emailInput = this.querySelector('input[type="email"]');
            const email = emailInput.value.trim();
            
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            
            if (email && emailRegex.test(email)) {
                const button = this.querySelector('button');
                const originalText = button.textContent;
                
                button.textContent = 'Inviato!';
                button.style.background = '#22c55e';
                
                // Track newsletter signup in Google Analytics
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'newsletter_signup', {
                        'device': detectDevice(),
                        'email_domain': email.split('@')[1]
                    });
                }
                
                setTimeout(() => {
                    button.textContent = originalText;
                    button.style.background = '';
                }, 2000);
                
                alert('Grazie per esserti iscritto! Ti terremo aggiornato su tutte le novità di Algo.');
                this.reset();
                
                console.log('Newsletter signup:', email);
                
            } else {
                emailInput.style.borderColor = '#ef4444';
                emailInput.placeholder = 'Inserisci un email valida';
                
                setTimeout(() => {
                    emailInput.style.borderColor = '';
                    emailInput.placeholder = 'La tua e-mail';
                }, 3000);
                
                alert('Per favore inserisci un indirizzo email valido.');
            }
        });
    }

    // ========================================
    // DOWNLOAD BUTTON ACTIONS
    // ========================================
    document.querySelectorAll('.download-btn').forEach(button => {
        button.addEventListener('click', function(e) {
            const isIOS = this.classList.contains('ios');
            const platform = isIOS ? 'iOS' : 'Android';
            const device = detectDevice();
            const section = this.closest('section')?.className || 'unknown';
            
            // Track download click in Google Analytics
            if (typeof gtag !== 'undefined') {
                gtag('event', 'download_click', {
                    'platform': platform,
                    'user_device': device,
                    'button_location': section
                });
            }
            
            console.log(`Download clicked: ${platform} - Device: ${device}`);
        });
    });

    // ========================================
    // TWITCH BUTTON ACTION
    // ========================================
    const twitchButton = document.querySelector('.btn-twitch');
    if (twitchButton) {
        twitchButton.addEventListener('click', function(e) {
            // Track Twitch click in Google Analytics
            if (typeof gtag !== 'undefined') {
                gtag('event', 'twitch_click', {
                    'device': detectDevice()
                });
            }
            
            console.log('Twitch Prime link clicked');
        });
    }

    // ========================================
    // SOCIAL LINKS TRACKING
    // ========================================
    document.querySelectorAll('.social-link').forEach(link => {
        link.addEventListener('click', function(e) {
            const socialPlatform = this.getAttribute('data-social');
            
            // Track social click in Google Analytics
            if (typeof gtag !== 'undefined') {
                gtag('event', 'social_click', {
                    'social_platform': socialPlatform,
                    'device': detectDevice(),
                    'link_url': this.href
                });
            }
            
            console.log(`Social link clicked: ${socialPlatform}`);
        });
    });

    // ========================================
    // INTERSECTION OBSERVER FOR ANIMATIONS
    // ========================================
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const fadeInObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    document.querySelectorAll('.testimonial-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        fadeInObserver.observe(card);
    });

    document.querySelectorAll('.feature-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        fadeInObserver.observe(card);
    });

    // ========================================
    // FEATURE CARDS HOVER EFFECT
    // ========================================
    document.querySelectorAll('.feature-card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });

    // ========================================
    // SCREENSHOT ITEMS HOVER EFFECT
    // ========================================
    document.querySelectorAll('.screenshot-item').forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.zIndex = '15';
            this.style.transform += ' scale(1.05)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.zIndex = '';
            this.style.transform = this.style.transform.replace(' scale(1.05)', '');
        });
    });

    // ========================================
    // MOBILE MENU TOGGLE
    // ========================================
    const mobileMenuButton = document.querySelector('.mobile-menu-toggle');
    const nav = document.querySelector('nav');
    
    if (mobileMenuButton && nav) {
        mobileMenuButton.addEventListener('click', function() {
            nav.classList.toggle('mobile-open');
            this.classList.toggle('active');
        });
    }

    // ========================================
    // LAZY LOAD IMAGES
    // ========================================
    const lazyImages = document.querySelectorAll('img[data-src]');
    
    if (lazyImages.length > 0) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    img.classList.add('loaded');
                    imageObserver.unobserve(img);
                }
            });
        });

        lazyImages.forEach(img => {
            img.style.opacity = '0';
            img.style.transition = 'opacity 0.3s ease';
            img.addEventListener('load', () => {
                img.style.opacity = '1';
            });
            imageObserver.observe(img);
        });
    }

    // ========================================
    // SCROLL TO TOP BUTTON
    // ========================================
    const scrollToTopBtn = document.querySelector('.scroll-to-top');
    
    if (scrollToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 500) {
                scrollToTopBtn.style.opacity = '1';
                scrollToTopBtn.style.visibility = 'visible';
            } else {
                scrollToTopBtn.style.opacity = '0';
                scrollToTopBtn.style.visibility = 'hidden';
            }
        });
        
        scrollToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // ========================================
    // ERROR HANDLING
    // ========================================
    window.addEventListener('error', (e) => {
        console.error('JavaScript Error:', e.error);
    });

    // ========================================
    // INITIALIZATION COMPLETE
    // ========================================
    console.log('🚀 Algo Fantacalcio website loaded successfully!');
    console.log(`📱 Carousel initialized with ${totalSlides} slides`);
    console.log(`⏱️ Auto-scroll: ${AUTO_SLIDE_DURATION}ms`);
    console.log(`📱 Device detection enabled for CTA: ${detectDevice()}`);
    console.log('📊 Google Analytics tracking enabled');
});

// ========================================
// UTILITY FUNCTIONS
// ========================================
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}