// Mobile Menu Toggle
const mobileMenuToggle = document.getElementById('mobileMenuToggle');
const navMenu = document.getElementById('navMenu');
const navbar = document.getElementById('navbar');
const heroSection = document.getElementById('home');
let lastScroll = 0;
let ticking = false;

// Set hero margin-top dynamically based on navbar height + 15px spacing
if (navbar && heroSection) {
    const updateHeroMargin = () => {
        const navbarHeight = navbar.offsetHeight;
        heroSection.style.marginTop = `${navbarHeight + 15}px`;
    };
    
    // Update on load
    window.addEventListener('load', updateHeroMargin);
    
    // Update on resize
    window.addEventListener('resize', updateHeroMargin);
    
    // Initial calculation
    setTimeout(updateHeroMargin, 100);
}

mobileMenuToggle.addEventListener('click', () => {
    // If navbar is collapsed, expand it first
    if (navbar.classList.contains('nav-collapsed')) {
        navbar.classList.remove('nav-collapsed');
    }
    // Toggle mobile menu
    mobileMenuToggle.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
const navLinks = document.querySelectorAll('.nav-link');
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        mobileMenuToggle.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Navbar scroll effect - collapse to logo + hamburger on scroll down

window.addEventListener('scroll', () => {
    if (!ticking) {
        window.requestAnimationFrame(() => {
            const currentScroll = window.pageYOffset;
            const isMobile = window.innerWidth <= 968;
            
            // Add scrolled class for styling
            if (currentScroll > 100) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
                if (!isMobile) {
                    navbar.classList.remove('nav-collapsed');
                }
            }
            
            // Collapse/expand navbar based on scroll direction - DISABLED (keep nav expanded)
            // Navbar now stays expanded on scroll, only changes styling via 'scrolled' class
            
            lastScroll = currentScroll;
            ticking = false;
        });
        ticking = true;
    }
});

// Active nav link on scroll
const sections = document.querySelectorAll('section[id]');

function activateNavLink() {
    const scrollY = window.pageYOffset;
    
    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');
        const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
        
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            navLinks.forEach(link => link.classList.remove('active'));
            if (navLink) {
                navLink.classList.add('active');
            }
        }
    });
}

window.addEventListener('scroll', activateNavLink);

// Smooth scroll for anchor links (no tracking - handled by tracking/domHooks.js)
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Animated counter for stats
const animateCounter = (element, target, duration = 2000) => {
    let start = 0;
    const increment = target / (duration / 16);
    
    const updateCounter = () => {
        start += increment;
        if (start < target) {
            element.textContent = Math.floor(start);
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target;
        }
    };
    
    updateCounter();
};

// Intersection Observer for stats animation
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const statNumber = entry.target.querySelector('.stat-number');
            if (statNumber) {
                const target = parseInt(statNumber.getAttribute('data-target'));
                
                if (!statNumber.classList.contains('animated') && target) {
                    statNumber.classList.add('animated');
                    statNumber.textContent = '0';
                    animateCounter(statNumber, target);
                }
            }
        }
    });
}, { threshold: 0.3 });

document.querySelectorAll('.stat-item').forEach(stat => {
    statsObserver.observe(stat);
});

// Fade in animation on scroll - removed for service cards (they show immediately now)
// const fadeInObserver = new IntersectionObserver((entries) => {
//     entries.forEach(entry => {
//         if (entry.isIntersecting) {
//             entry.target.style.opacity = '1';
//             entry.target.style.transform = 'translateY(0)';
//         }
//     });
// }, { threshold: 0.1 });

// Service cards now show immediately - no fade-in animation
// document.querySelectorAll('.service-card').forEach((card, index) => {
//     card.style.opacity = '0';
//     card.style.transform = 'translateY(30px)';
//     card.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
//     fadeInObserver.observe(card);
// });

// Note: Contact form handling with Lead tracking has been moved to tracking/domHooks.js
// This ensures tracking only fires on successful form submission, not on field focus

// Hero Carousel Auto-Scroll - REMOVED (replaced with static image)

// Note: All Meta Pixel tracking has been moved to tracking/domHooks.js
// This ensures high-quality, non-noisy tracking without scroll-based "fake intent"

// Gallery Lightbox
let galleryItems = document.querySelectorAll('.gallery-item');
const lightbox = document.getElementById('gallery-lightbox');
const lightboxImage = document.getElementById('lightbox-image');
const lightboxClose = document.querySelector('.lightbox-close');
const lightboxPrev = document.querySelector('.lightbox-prev');
const lightboxNext = document.querySelector('.lightbox-next');
const lightboxCurrent = document.getElementById('lightbox-current');
const lightboxTotal = document.getElementById('lightbox-total');
const gallerySeeAllBtn = document.getElementById('gallerySeeAllBtn');
const galleryRemaining = document.getElementById('galleryRemaining');

let currentImageIndex = 0;
let images = Array.from(galleryItems).map(item => item.getAttribute('data-image'));

// Update total count
if (lightboxTotal) {
    lightboxTotal.textContent = images.length;
}

// Handle "See All" button
const gallerySeeLessBtn = document.getElementById('gallerySeeLessBtn');
const gallerySeeLessWrapper = document.getElementById('gallerySeeLessWrapper');
const galleryPreview = document.querySelector('.gallery-preview');

if (gallerySeeAllBtn && galleryRemaining) {
    gallerySeeAllBtn.addEventListener('click', () => {
        // Show remaining gallery
        galleryRemaining.style.display = 'grid';
        
        // Show "See Less" button
        if (gallerySeeLessWrapper) {
            gallerySeeLessWrapper.style.display = 'block';
        }
        
        // Hide the preview section and "See All" button
        if (galleryPreview) {
            galleryPreview.style.display = 'none';
        }
        
        // Re-initialize gallery handlers to include all images
        initializeGalleryHandlers();
        
        // Smooth scroll to remaining gallery
        setTimeout(() => {
            galleryRemaining.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
    });
}

// Handle "See Less" button
if (gallerySeeLessBtn && galleryRemaining && galleryPreview) {
    gallerySeeLessBtn.addEventListener('click', () => {
        // Hide remaining gallery
        galleryRemaining.style.display = 'none';
        
        // Hide "See Less" button
        if (gallerySeeLessWrapper) {
            gallerySeeLessWrapper.style.display = 'none';
        }
        
        // Show the preview section and "See All" button
        galleryPreview.style.display = 'block';
        
        // Re-initialize gallery handlers for preview only
        initializeGalleryHandlers();
        
        // Smooth scroll to gallery preview
        setTimeout(() => {
            galleryPreview.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
    });
}

// Open lightbox
function openLightbox(index) {
    currentImageIndex = index;
    updateLightboxImage();
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Hide navbar when lightbox is open
    const navbar = document.getElementById('navbar');
    if (navbar) {
        navbar.style.opacity = '0';
        navbar.style.pointerEvents = 'none';
    }
    
    // Gallery lightbox tracking removed - focusing on booking/inquiry funnels only
}

// Close lightbox
function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
    
    // Show navbar again when lightbox is closed
    const navbar = document.getElementById('navbar');
    if (navbar) {
        navbar.style.opacity = '';
        navbar.style.pointerEvents = '';
    }
}

// Update lightbox image
function updateLightboxImage() {
    if (lightboxImage && images[currentImageIndex]) {
        lightboxImage.src = images[currentImageIndex];
        if (lightboxCurrent) {
            lightboxCurrent.textContent = currentImageIndex + 1;
        }
    }
}

// Navigate to previous image
function showPrevImage() {
    currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
    updateLightboxImage();
}

// Navigate to next image
function showNextImage() {
    currentImageIndex = (currentImageIndex + 1) % images.length;
    updateLightboxImage();
}

// Function to initialize gallery click handlers
function initializeGalleryHandlers() {
    galleryItems = document.querySelectorAll('.gallery-item');
    images = Array.from(galleryItems).map(item => item.getAttribute('data-image'));
    
    // Update total count
    if (lightboxTotal) {
        lightboxTotal.textContent = images.length;
    }
    
    // Add click handlers to all gallery items
    galleryItems.forEach((item, index) => {
        // Remove any existing listeners by cloning (clean slate)
        const newItem = item.cloneNode(true);
        item.parentNode.replaceChild(newItem, item);
        
        // Add click handler
        newItem.addEventListener('click', () => {
            openLightbox(index);
        });
    });
    
    // Update galleryItems reference after cloning
    galleryItems = document.querySelectorAll('.gallery-item');
}

// Initialize gallery handlers on page load
initializeGalleryHandlers();

// Lightbox controls
if (lightboxClose) {
    // Use both click and touch events for maximum compatibility
    const handleClose = (e) => {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        closeLightbox();
        return false;
    };
    
    lightboxClose.addEventListener('click', handleClose, { passive: false });
    lightboxClose.addEventListener('touchend', handleClose, { passive: false });
    lightboxClose.addEventListener('touchstart', (e) => {
        e.stopPropagation();
    }, { passive: true });
}

if (lightboxPrev) {
    lightboxPrev.addEventListener('click', (e) => {
        e.stopPropagation();
        showPrevImage();
    });
}

if (lightboxNext) {
    lightboxNext.addEventListener('click', (e) => {
        e.stopPropagation();
        showNextImage();
    });
}

// Close on overlay click
if (lightbox) {
    const lightboxOverlay = lightbox.querySelector('.lightbox-overlay');
    if (lightboxOverlay) {
        lightboxOverlay.addEventListener('click', (e) => {
            e.stopPropagation();
            closeLightbox();
        });
    }
    
    // Also close when clicking on the lightbox container itself (but not on content)
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });
}

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (lightbox.classList.contains('active')) {
        if (e.key === 'Escape') {
            closeLightbox();
        } else if (e.key === 'ArrowLeft') {
            showPrevImage();
        } else if (e.key === 'ArrowRight') {
            showNextImage();
        }
    }
});

// Add loading animation
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});

// Testimonials Read More/Less functionality
document.addEventListener('DOMContentLoaded', () => {
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    
    testimonialCards.forEach(card => {
        const textElement = card.querySelector('.testimonial-text-truncated');
        const button = card.querySelector('.testimonial-read-more-btn');
        
        if (!textElement || !button) return;
        
        // Check if text needs truncation
        const fullHeight = textElement.scrollHeight;
        const lineHeight = parseFloat(getComputedStyle(textElement).lineHeight);
        const maxHeight = lineHeight * 4;
        
        if (fullHeight > maxHeight) {
            button.style.display = 'block';
            button.textContent = 'Read more';
            
            button.addEventListener('click', () => {
                const isExpanded = card.classList.contains('expanded');
                
                if (isExpanded) {
                    card.classList.remove('expanded');
                    button.textContent = 'Read more';
                } else {
                    card.classList.add('expanded');
                    button.textContent = 'Read less';
                }
            });
        }
    });
});

// Service card hover effect - REMOVED (cards are not clickable)
// document.querySelectorAll('.service-card').forEach(card => {
//     card.addEventListener('mouseenter', function() {
//         this.style.transform = 'translateY(-10px) scale(1.02)';
//     });
//     
//     card.addEventListener('mouseleave', function() {
//         this.style.transform = 'translateY(0) scale(1)';
//     });
// });

// Add smooth reveal animation to sections
const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('section').forEach(section => {
    sectionObserver.observe(section);
});

// Simple Lodgify Widget Integration - No modal, just widgets
// Note: ViewContent tracking is now handled in index.html for user-initiated interactions only
document.addEventListener('DOMContentLoaded', function() {
    // Widgets are loaded, but ViewContent tracking happens on user interaction
    // This ensures ViewContent fires only when user shows intent, not on page load
    
    
    // Fetch and update hero rating from API
    fetchAndUpdateRating();
});

/**
 * Fetch and update hero rating from API
 * 
 * This function fetches the current average rating from the API endpoint
 * which is automatically updated weekly via cron job.
 */
async function fetchAndUpdateRating() {
    try {
        // Determine API URL based on environment
        const apiUrl = window.location.hostname === 'localhost' 
            ? 'http://localhost:3000/api/ratings'
            : '/api/ratings';
        
        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            // Cache for 1 hour on client side
            cache: 'default'
        });
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.averageRating) {
            updateHeroRatingDisplay(data.averageRating);
            updateTestimonialsRatingDisplay(data.averageRating);
            
            // Optional: Log platform breakdown for debugging
            if (data.platformRatings) {
                console.log('Platform ratings:', data.platformRatings);
            }
        } else {
            console.warn('No average rating in API response, using fallback');
            // Keep default 4.9 if API doesn't return rating
        }
        
    } catch (error) {
        console.error('Error fetching rating from API:', error);
        // On error, keep the default 4.9 rating
        // The display will show the placeholder value
    }
}

/**
 * Update hero rating display with fetched rating
 */
function updateHeroRatingDisplay(rating) {
    const ratingElement = document.querySelector('.hero-rating-value');
    if (!ratingElement) return;
    
    const roundedRating = parseFloat(rating).toFixed(1);
    
    // Update rating value
    ratingElement.textContent = roundedRating;
    ratingElement.setAttribute('data-rating', roundedRating);
    
    // Update star display
    const stars = document.querySelectorAll('.hero-rating-stars .star');
    const fullStars = Math.floor(rating);
    const decimal = rating % 1;
    
    stars.forEach((star, index) => {
        // Remove all classes and inline styles first
        star.classList.remove('filled', 'half-filled');
        star.style.background = '';
        
        if (index < fullStars) {
            star.classList.add('filled');
        } else if (index === fullStars && decimal > 0) {
            // Create gradient based on exact decimal value
            const fillPercent = decimal * 100;
            star.classList.add('half-filled');
            star.style.setProperty('--fill-percent', `${fillPercent}%`);
        }
    });
}

/**
 * Update testimonials rating display with fetched rating
 */
function updateTestimonialsRatingDisplay(rating) {
    const ratingElement = document.querySelector('.testimonials-rating-value');
    if (!ratingElement) return;
    
    const roundedRating = parseFloat(rating).toFixed(1);
    
    // Update rating value
    ratingElement.textContent = roundedRating;
    ratingElement.setAttribute('data-rating', roundedRating);
    
    // Update star display
    const stars = document.querySelectorAll('.testimonials-rating-stars .star');
    const fullStars = Math.floor(rating);
    const decimal = rating % 1;
    
    stars.forEach((star, index) => {
        // Remove all classes and inline styles first
        star.classList.remove('filled', 'half-filled');
        star.style.background = '';
        
        if (index < fullStars) {
            star.classList.add('filled');
        } else if (index === fullStars && decimal > 0) {
            // Create gradient based on exact decimal value
            const fillPercent = decimal * 100;
            star.classList.add('half-filled');
            star.style.setProperty('--fill-percent', `${fillPercent}%`);
        }
    });
}

// Block unavailable dates in contact form date pickers
document.addEventListener('DOMContentLoaded', async function() {
    const checkinInput = document.getElementById('checkin');
    const checkoutInput = document.getElementById('checkout');
    
    if (!checkinInput || !checkoutInput) return;

    let bookedDates = [];

    // Fetch availability to get booked dates
    try {
        const apiUrl = window.location.hostname === 'localhost' 
            ? 'http://localhost:3000/api/availability'
            : '/api/availability';
        
        const response = await fetch(apiUrl);
        if (response.ok) {
            const data = await response.json();
            if (data.success && data.bookedDates) {
                bookedDates = data.bookedDates.map(date => new Date(date).toISOString().split('T')[0]);
            }
        }
    } catch (error) {
        console.error('Error fetching availability for date pickers:', error);
    }

    // Set minimum date to today
    const today = new Date().toISOString().split('T')[0];
    checkinInput.setAttribute('min', today);
    checkoutInput.setAttribute('min', today);

    // Function to check if a date is booked
    function isDateBooked(dateString) {
        return bookedDates.includes(dateString);
    }

    // Function to get next available date
    function getNextAvailableDate(startDate) {
        let currentDate = new Date(startDate);
        currentDate.setDate(currentDate.getDate() + 1);
        
        // Check up to 1 year ahead
        for (let i = 0; i < 365; i++) {
            const dateString = currentDate.toISOString().split('T')[0];
            if (!isDateBooked(dateString)) {
                return dateString;
            }
            currentDate.setDate(currentDate.getDate() + 1);
        }
        return null;
    }

    // Block dates in date pickers using invalid attribute
    checkinInput.addEventListener('change', function() {
        const selectedDate = this.value;
        
        if (selectedDate && isDateBooked(selectedDate)) {
            alert('This date is not available. Please select another date.');
            this.value = '';
            return;
        }

        // Set minimum checkout date to day after check-in
        if (selectedDate) {
            const checkinDate = new Date(selectedDate);
            checkinDate.setDate(checkinDate.getDate() + 1);
            checkoutInput.setAttribute('min', checkinDate.toISOString().split('T')[0]);
            
            // If checkout is before checkin, clear it
            if (checkoutInput.value && checkoutInput.value <= selectedDate) {
                checkoutInput.value = '';
            }
        }
    });

    checkoutInput.addEventListener('change', function() {
        const selectedDate = this.value;
        
        if (selectedDate && isDateBooked(selectedDate)) {
            alert('This date is not available. Please select another date.');
            this.value = '';
            return;
        }

        // Validate checkout is after checkin
        if (checkinInput.value && selectedDate <= checkinInput.value) {
            alert('Check-out date must be after check-in date.');
            this.value = '';
            return;
        }
    });

    // Custom validation on input
    checkinInput.addEventListener('input', function() {
        if (this.value && isDateBooked(this.value)) {
            this.setCustomValidity('This date is not available');
        } else {
            this.setCustomValidity('');
        }
    });

    checkoutInput.addEventListener('input', function() {
        if (this.value && isDateBooked(this.value)) {
            this.setCustomValidity('This date is not available');
        } else {
            this.setCustomValidity('');
        }
    });
});

// Show/hide language-specific content for About section
function updateAboutSectionLanguage(lang) {
    const langContents = document.querySelectorAll('#about .lang-content');
    langContents.forEach(content => {
        content.style.display = 'none';
    });
    const activeContent = document.querySelector(`#about .lang-${lang}`);
    if (activeContent) {
        activeContent.style.display = 'block';
        // Reset text to truncated state when language changes
        const textContent = activeContent.querySelector('.about-text-content');
        if (textContent) {
            textContent.classList.remove('about-text-expanded');
            textContent.classList.add('about-text-truncated');
            const readMoreBtn = activeContent.querySelector('.about-read-more-btn');
            if (readMoreBtn) {
                readMoreBtn.querySelector('.read-more-text').style.display = 'inline';
                readMoreBtn.querySelector('.read-less-text').style.display = 'none';
            }
        }
    }
}

// Set truncated height based on left column height (image + tiles)
function setTextTruncatedHeight() {
    const imageColumn = document.querySelector('.about-image-column');
    if (!imageColumn) return;
    
    // Find active language content (not hidden)
    const allLangContents = document.querySelectorAll('#about .lang-content');
    let activeLangContent = null;
    for (let content of allLangContents) {
        const display = window.getComputedStyle(content).display;
        if (display !== 'none') {
            activeLangContent = content;
            break;
        }
    }
    
    if (activeLangContent) {
        const aboutImage = document.querySelector('.about-castle-image');
        const referenceHeight = aboutImage ? aboutImage.offsetHeight : imageColumn.offsetHeight;
        
        const h3Element = activeLangContent.querySelector('h3');
        const buttonElement = activeLangContent.querySelector('.about-read-more-btn');
        const textContent = activeLangContent.querySelector('.about-text-content');
        
        if (textContent && textContent.classList.contains('about-text-truncated')) {
            // Calculate the height needed for h3 and button (including margins)
            let otherElementsHeight = 0;
            if (h3Element) {
                const h3Styles = window.getComputedStyle(h3Element);
                otherElementsHeight += h3Element.offsetHeight + 
                    (parseFloat(h3Styles.marginBottom) || 0);
            }
            if (buttonElement) {
                const btnStyles = window.getComputedStyle(buttonElement);
                otherElementsHeight += buttonElement.offsetHeight + 
                    (parseFloat(btnStyles.marginTop) || 0);
            }
            
            // Set text content max-height to stay within the castle image height
            const textMaxHeight = referenceHeight - otherElementsHeight - 40; // 40px for gradient fade area
            textContent.style.maxHeight = `${Math.max(Math.min(textMaxHeight, referenceHeight - 40), 180)}px`; // clamp to image height, minimum 180px
        }
    }
}

// Listen for language changes
document.addEventListener('DOMContentLoaded', () => {
    // Get initial language
    const initialLang = localStorage.getItem('preferredLanguage') || 'en';
    updateAboutSectionLanguage(initialLang);
    
    // Set truncated height after images load
    window.addEventListener('load', () => {
        setTimeout(setTextTruncatedHeight, 100);
    });
    
    // Also set height when window resizes
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            setTextTruncatedHeight();
        }, 250);
    });
    
    // Listen for language button clicks
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const lang = btn.dataset.lang;
            if (lang) {
                updateAboutSectionLanguage(lang);
                setTimeout(setTextTruncatedHeight, 50);
            }
        });
    });
    
    // Also update when language changes via the translation system
    const langObserver = new MutationObserver(() => {
        const activeLangBtn = document.querySelector('.lang-btn.active');
        if (activeLangBtn) {
            const lang = activeLangBtn.dataset.lang;
            updateAboutSectionLanguage(lang);
            setTimeout(setTextTruncatedHeight, 50);
        }
    });
    
    const langSwitcher = document.querySelector('.language-switcher');
    if (langSwitcher) {
        langObserver.observe(langSwitcher, { attributes: true, subtree: true, attributeFilter: ['class'] });
    }
    
    // Handle read more/less button clicks
    document.querySelectorAll('.about-read-more-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const langContent = this.closest('.lang-content');
            const textContent = langContent.querySelector('.about-text-content');
            const moreText = this.querySelector('.read-more-text');
            const lessText = this.querySelector('.read-less-text');
            if (textContent) {
                if (textContent.classList.contains('about-text-truncated')) {
                    textContent.classList.remove('about-text-truncated');
                    textContent.classList.add('about-text-expanded');
                    textContent.style.maxHeight = 'none';
                    if (moreText) moreText.style.display = 'none';
                    if (lessText) lessText.style.display = 'inline';
                } else {
                    textContent.classList.remove('about-text-expanded');
                    textContent.classList.add('about-text-truncated');
                    setTextTruncatedHeight();
                    if (moreText) moreText.style.display = 'inline';
                    if (lessText) lessText.style.display = 'none';
                }
            }
        });
    });
});
// Language Dropdown Functionality
document.addEventListener('DOMContentLoaded', () => {
    const langDropdownToggle = document.getElementById('langDropdownToggle');
    const langDropdownMenu = document.getElementById('langDropdownMenu');
    const langDropdownItems = document.querySelectorAll('.lang-dropdown-item');
    const langCurrent = document.querySelector('.lang-current');
    const languageDropdown = document.querySelector('.language-dropdown');
    const mobileLangSwitcher = document.querySelector('.nav-menu .mobile-language-switcher');
    
    // Language labels mapping
    const langLabels = {
        'en': 'EN',
        'nl': 'NL',
        'fr': 'FR'
    };
    
    const langFullLabels = {
        'en': 'English',
        'nl': 'Nederlands',
        'fr': 'Français'
    };
    
    // Update dropdown display based on current language
    function updateDropdownDisplay() {
        const currentLang = localStorage.getItem('preferredLanguage') || 'en';
        const currentLabel = langLabels[currentLang] || 'EN';
        
        // Update toggle button
        if (langCurrent) {
            langCurrent.textContent = currentLabel;
        }
        
        // Update dropdown items
        langDropdownItems.forEach(item => {
            item.classList.remove('active');
            if (item.dataset.lang === currentLang) {
                item.classList.add('active');
            }
        });
    }
    
    // Toggle dropdown
    if (langDropdownToggle && langDropdownMenu) {
        langDropdownToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            const isExpanded = langDropdownToggle.getAttribute('aria-expanded') === 'true';
            langDropdownToggle.setAttribute('aria-expanded', !isExpanded);
            languageDropdown?.classList.toggle('active', !isExpanded);
        });
        
        // Handle dropdown item clicks
        langDropdownItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.stopPropagation();
                const lang = item.dataset.lang;
                if (lang) {
                    // Trigger language change by clicking corresponding lang-btn (which will be handled by translations.js)
                    const langBtn = document.querySelector(`.lang-btn[data-lang="${lang}"]`);
                    if (langBtn) {
                        langBtn.click();
                    } else {
                        // Fallback: directly call setLanguage if available
                        if (typeof setLanguage === 'function') {
                            setLanguage(lang);
                        }
                    }
                    // Close dropdown
                    langDropdownToggle.setAttribute('aria-expanded', 'false');
                    languageDropdown?.classList.remove('active');
                    updateDropdownDisplay();
                }
            });
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (languageDropdown && !languageDropdown.contains(e.target)) {
                langDropdownToggle.setAttribute('aria-expanded', 'false');
                languageDropdown.classList.remove('active');
            }
        });
        
        // Update display when language changes
        const langObserver = new MutationObserver(() => {
            updateDropdownDisplay();
        });
        
        // Observe changes to active lang-btn elements
        document.querySelectorAll('.lang-btn').forEach(btn => {
            langObserver.observe(btn, { attributes: true, attributeFilter: ['class'] });
        });
        
        // Initial update
        updateDropdownDisplay();
        
        // Also update when language changes via localStorage
        window.addEventListener('storage', () => {
            updateDropdownDisplay();
        });
    }
});

// Sync language switcher between desktop and mobile
document.addEventListener('DOMContentLoaded', () => {
    const desktopLangSwitcher = document.querySelector('.nav-wrapper .language-switcher');
    const mobileLangSwitcher = document.querySelector('.nav-menu .mobile-language-switcher');
    
    function syncLanguageButtons() {
        // Sync dropdown items with mobile switcher
        const langDropdownItems = document.querySelectorAll('.lang-dropdown-item');
        if (langDropdownItems.length > 0 && mobileLangSwitcher) {
            const activeDropdownItem = Array.from(langDropdownItems).find(item => item.classList.contains('active'));
            if (activeDropdownItem) {
                const lang = activeDropdownItem.dataset.lang;
                mobileLangSwitcher.querySelectorAll('.lang-btn').forEach(btn => {
                    btn.classList.remove('active');
                    if (btn.dataset.lang === lang) {
                        btn.classList.add('active');
                    }
                });
            }
        }
        
        // Legacy sync for old structure (if it exists)
        if (desktopLangSwitcher && mobileLangSwitcher) {
            const activeDesktopBtn = desktopLangSwitcher.querySelector('.lang-btn.active');
            if (activeDesktopBtn) {
                const lang = activeDesktopBtn.dataset.lang;
                mobileLangSwitcher.querySelectorAll('.lang-btn').forEach(btn => {
                    btn.classList.remove('active');
                    if (btn.dataset.lang === lang) {
                        btn.classList.add('active');
                    }
                });
            }
        }
    }
    
    // Sync when menu opens
    if (mobileMenuToggle) {
        const originalClickHandler = mobileMenuToggle.onclick;
        mobileMenuToggle.addEventListener('click', () => {
            setTimeout(syncLanguageButtons, 50);
        });
    }
    
    // Sync when language button is clicked on mobile
    if (mobileLangSwitcher) {
        mobileLangSwitcher.querySelectorAll('.lang-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const lang = btn.dataset.lang;
                const desktopBtn = desktopLangSwitcher?.querySelector(`[data-lang="${lang}"]`);
                if (desktopBtn) {
                    desktopBtn.click();
                }
                syncLanguageButtons();
            });
        });
    }
    
    // Hide "Your perfect escape..." on smallest mobile (480px and below)
    function hideSecondSentence() {
        const heroSubtitle = document.querySelector('.hero-subtitle');
        if (!heroSubtitle) return;
        
        if (window.innerWidth <= 480) {
            // Store original if not already stored
            if (!heroSubtitle.hasAttribute('data-original')) {
                heroSubtitle.setAttribute('data-original', heroSubtitle.innerHTML);
            }
            const text = heroSubtitle.getAttribute('data-original') || heroSubtitle.innerHTML;
            // Split by <br> and keep only first part
            if (text.includes('<br>')) {
                const firstPart = text.split('<br>')[0].trim();
                heroSubtitle.innerHTML = firstPart;
            }
        } else {
            // Restore original text on larger screens
            if (heroSubtitle.hasAttribute('data-original')) {
                heroSubtitle.innerHTML = heroSubtitle.getAttribute('data-original');
            }
        }
    }
    
    // Check on load and resize
    hideSecondSentence();
    window.addEventListener('resize', hideSecondSentence);
    
    // Re-hide when language changes (translation updates the content)
    const allLangButtons = document.querySelectorAll('.lang-btn');
    allLangButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            setTimeout(() => {
                const heroSubtitle = document.querySelector('.hero-subtitle');
                if (heroSubtitle) {
                    heroSubtitle.removeAttribute('data-original'); // Clear stored original
                    hideSecondSentence(); // Re-hide with new translation
                }
            }, 200);
        });
    });
    
    // Initial sync
    syncLanguageButtons();
});

// Static carousel with swipe functionality for Features & Amenities
document.addEventListener('DOMContentLoaded', () => {
    const carouselTrack = document.getElementById('featuresCarousel');
    const carouselDots = document.getElementById('featuresCarouselDots');
    const prevArrow = document.getElementById('featuresCarouselPrev');
    const nextArrow = document.getElementById('featuresCarouselNext');
    
    if (!carouselTrack || !carouselDots) return;
    
    const cards = carouselTrack.querySelectorAll('.service-card');
    const totalCards = cards.length;
    // Responsive: 3 cards on desktop, 1 card on mobile
    const getCardsPerView = () => window.innerWidth <= 768 ? 1 : 3;
    let cardsPerView = getCardsPerView();
    let totalSlides = Math.ceil(totalCards / cardsPerView);
    let currentSlide = 0;
    
    // Calculate card width including gap
    const getCardWidth = () => {
        if (cards.length === 0) return 0;
        const card = cards[0];
        const cardWidth = 413; // Fixed card width
        const gap = 32; // 2rem gap
        return cardWidth + gap;
    };
    
    // Create navigation dots
    const createDots = () => {
        carouselDots.innerHTML = '';
        for (let i = 0; i < totalSlides; i++) {
            const dot = document.createElement('button');
            dot.className = 'carousel-dot';
            if (i === 0) dot.classList.add('active');
            dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
            dot.addEventListener('click', () => goToSlide(i));
            carouselDots.appendChild(dot);
        }
    };
    
    // Update dots and arrows
    const updateDots = () => {
        const dots = carouselDots.querySelectorAll('.carousel-dot');
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentSlide);
        });
    };
    
    // Update arrow states
    const updateArrows = () => {
        if (prevArrow) {
            prevArrow.disabled = currentSlide === 0;
        }
        if (nextArrow) {
            nextArrow.disabled = currentSlide === totalSlides - 1;
        }
    };
    
    // Go to specific slide
    const goToSlide = (slideIndex) => {
        currentSlide = Math.max(0, Math.min(slideIndex, totalSlides - 1));
        const cardWidth = getCardWidth();
        const translateX = -currentSlide * cardWidth * cardsPerView;
        carouselTrack.style.transform = `translateX(${translateX}px)`;
        updateDots();
        updateArrows();
    };
    
    // Navigate to previous slide
    const goToPrev = () => {
        if (currentSlide > 0) {
            goToSlide(currentSlide - 1);
        }
    };
    
    // Navigate to next slide
    const goToNext = () => {
        if (currentSlide < totalSlides - 1) {
            goToSlide(currentSlide + 1);
        }
    };
    
    // Add arrow event listeners
    if (prevArrow) {
        prevArrow.addEventListener('click', goToPrev);
    }
    if (nextArrow) {
        nextArrow.addEventListener('click', goToNext);
    }
    
    // Swipe functionality
    let startX = 0;
    let currentX = 0;
    let isDragging = false;
    let startTranslate = 0;
    let currentTranslate = 0;
    
    const getPositionX = (event) => {
        return event.type.includes('mouse') ? event.clientX : event.touches[0].clientX;
    };
    
    const touchStart = (event) => {
        startX = getPositionX(event);
        isDragging = true;
        startTranslate = currentTranslate;
        carouselTrack.style.transition = 'none';
    };
    
    const touchMove = (event) => {
        if (!isDragging) return;
        currentX = getPositionX(event);
        currentTranslate = startTranslate + currentX - startX;
        carouselTrack.style.transform = `translateX(${currentTranslate}px)`;
    };
    
    const touchEnd = () => {
        if (!isDragging) return;
        isDragging = false;
        carouselTrack.style.transition = 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
        
        const cardWidth = getCardWidth();
        const movedBy = currentTranslate - startTranslate;
        const threshold = cardWidth * 0.3; // 30% of card width to trigger slide change
        
        if (Math.abs(movedBy) > threshold) {
            if (movedBy > 0 && currentSlide > 0) {
                goToSlide(currentSlide - 1);
            } else if (movedBy < 0 && currentSlide < totalSlides - 1) {
                goToSlide(currentSlide + 1);
            } else {
                goToSlide(currentSlide); // Snap back
            }
        } else {
            goToSlide(currentSlide); // Snap back
        }
        
        currentTranslate = -currentSlide * cardWidth * cardsPerView;
    };
    
    // Event listeners for touch
    carouselTrack.addEventListener('touchstart', touchStart, { passive: true });
    carouselTrack.addEventListener('touchmove', touchMove, { passive: true });
    carouselTrack.addEventListener('touchend', touchEnd);
    
    // Event listeners for mouse (for desktop drag)
    let mouseDown = false;
    carouselTrack.addEventListener('mousedown', (e) => {
        mouseDown = true;
        touchStart(e);
    });
    
    carouselTrack.addEventListener('mousemove', (e) => {
        if (mouseDown) touchMove(e);
    });
    
    carouselTrack.addEventListener('mouseup', () => {
        mouseDown = false;
        touchEnd();
    });
    
    carouselTrack.addEventListener('mouseleave', () => {
        if (mouseDown) {
            mouseDown = false;
            touchEnd();
        }
    });
    
    // Initialize
    createDots();
    goToSlide(0);
    updateArrows();
    
    // Handle window resize
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            const newCardsPerView = getCardsPerView();
            if (newCardsPerView !== cardsPerView) {
                cardsPerView = newCardsPerView;
                totalSlides = Math.ceil(totalCards / cardsPerView);
                createDots();
                currentSlide = Math.min(currentSlide, totalSlides - 1);
                updateArrows();
            }
            goToSlide(currentSlide);
        }, 250);
    });
});

// Testimonials Carousel Auto-Scroll (same as Features & Amenities)
document.addEventListener('DOMContentLoaded', function() {
    const testimonialsCarouselRow = document.querySelector('.testimonials-carousel-row');
    
    if (!testimonialsCarouselRow) return;
    
    // Check if mobile (disable auto-scroll on mobile for better performance)
    const isMobile = window.innerWidth <= 968;
    
    if (isMobile) {
        // On mobile, just enable smooth scrolling - no auto-animation
        testimonialsCarouselRow.style.scrollBehavior = 'smooth';
        return;
    }
    
    const track = testimonialsCarouselRow.querySelector('.testimonials-carousel-track');
    if (!track) return;
    
    let animationId = null;
    let isPaused = false;
    let scrollDirection = 1; // Scrolls left (positive direction)
    let scrollSpeed = 0.5; // Pixels per frame (slow)
    let halfWidth = 0;
    
    // Wait for layout to calculate proper widths
    setTimeout(() => {
        // Calculate half width for infinite scroll
        halfWidth = track.scrollWidth / 2;
        
        // Initialize scroll position
        testimonialsCarouselRow.scrollLeft = 0;
        
        // Auto-scroll animation
        const animate = () => {
            if (!isPaused) {
                testimonialsCarouselRow.scrollLeft += scrollDirection * scrollSpeed;
                
                // Reset position for infinite scroll
                if (testimonialsCarouselRow.scrollLeft >= halfWidth) {
                    testimonialsCarouselRow.scrollLeft = 0;
                }
            }
            animationId = requestAnimationFrame(animate);
        };
        
        // Start animation
        animate();
    }, 100);
    
    // Pause on user interaction
    const pauseOnInteraction = () => {
        isPaused = true;
    };
    
    // Resume when interaction ends
    const resumeOnLeave = () => {
        isPaused = false;
    };
    
    // Mouse events
    testimonialsCarouselRow.addEventListener('mouseenter', pauseOnInteraction);
    testimonialsCarouselRow.addEventListener('mouseleave', resumeOnLeave);
    
    // Touch events
    testimonialsCarouselRow.addEventListener('touchstart', pauseOnInteraction, { passive: true });
    testimonialsCarouselRow.addEventListener('touchmove', pauseOnInteraction, { passive: true });
    testimonialsCarouselRow.addEventListener('touchend', resumeOnLeave, { passive: true });
    testimonialsCarouselRow.addEventListener('touchcancel', resumeOnLeave, { passive: true });
    
    // Cleanup on page unload
    window.addEventListener('beforeunload', () => {
        if (animationId) {
            cancelAnimationFrame(animationId);
        }
    });
});

// Mobile Services Accordion
document.addEventListener('DOMContentLoaded', () => {
    const accordionItems = document.querySelectorAll('.services-accordion-item');
    
    accordionItems.forEach(item => {
        const header = item.querySelector('.services-accordion-header');
        
        header.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // Close all other items
            accordionItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                }
            });
            
            // Toggle current item
            if (isActive) {
                item.classList.remove('active');
            } else {
                item.classList.add('active');
            }
        });
        
        // Prevent event bubbling
        const content = item.querySelector('.services-accordion-content');
        if (content) {
            content.addEventListener('click', (e) => {
                e.stopPropagation();
            });
        }
    });
});

// Use Case Cards Read More/Less functionality
document.addEventListener('DOMContentLoaded', () => {
    const useCaseCards = document.querySelectorAll('.use-case-card');
    
    useCaseCards.forEach(card => {
        const descriptionElement = card.querySelector('.use-case-description-truncated');
        const button = card.querySelector('.use-case-read-more-btn');
        
        if (!descriptionElement || !button) return;
        
        // Check if description needs truncation
        const fullHeight = descriptionElement.scrollHeight;
        const lineHeight = parseFloat(getComputedStyle(descriptionElement).lineHeight);
        const maxHeight = lineHeight * 2; // 2 lines
        
        if (fullHeight > maxHeight) {
            button.style.display = 'block';
            button.textContent = 'Read more';
            
            button.addEventListener('click', () => {
                const isExpanded = card.classList.contains('expanded');
                
                if (isExpanded) {
                    card.classList.remove('expanded');
                    button.textContent = 'Read more';
                } else {
                    card.classList.add('expanded');
                    button.textContent = 'Read less';
                }
            });
        }
    });
});
