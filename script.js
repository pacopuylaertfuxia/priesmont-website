// Mobile Menu Toggle
const mobileMenuToggle = document.getElementById('mobileMenuToggle');
const navMenu = document.getElementById('navMenu');
const navbar = document.getElementById('navbar');
let lastScroll = 0;
let ticking = false;

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

// Hero Carousel Auto-Scroll
document.addEventListener('DOMContentLoaded', function() {
    const slides = document.querySelectorAll('.hero-slide');
    if (slides.length === 0) return;
    
    let currentSlide = 0;
    const totalSlides = slides.length;
    
    function nextSlide() {
        // Remove active class from current slide
        slides[currentSlide].classList.remove('active');
        
        // Move to next slide
        currentSlide = (currentSlide + 1) % totalSlides;
        
        // Add active class to new slide
        slides[currentSlide].classList.add('active');
    }
    
    // Auto-scroll every 5 seconds
    setInterval(nextSlide, 5000);
    
    // Initialize - make sure first slide is active
    slides[0].classList.add('active');
});

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
    lightboxClose.addEventListener('click', closeLightbox);
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

// Auto-scrolling carousels with user scroll control (desktop only)
document.addEventListener('DOMContentLoaded', () => {
    const carouselRows = document.querySelectorAll('.services-carousel-row');
    
    // Check if mobile (disable auto-scroll on mobile for better performance)
    const isMobile = window.innerWidth <= 968;
    
    if (isMobile) {
        // On mobile, just enable smooth scrolling - no auto-animation
        carouselRows.forEach((row) => {
            row.style.scrollBehavior = 'smooth';
        });
        return;
    }
    
    carouselRows.forEach((row, index) => {
        const track = row.querySelector('.services-carousel-track');
        if (!track) return;
        
        let animationId = null;
        let isPaused = false;
        let scrollDirection = index === 0 ? 1 : -1; // Row 1 scrolls left (positive), Row 2 scrolls right (negative)
        let scrollSpeed = 0.5; // Pixels per frame (slow)
        let halfWidth = 0;
        
        // Wait for layout to calculate proper widths
        setTimeout(() => {
            // Calculate half width for infinite scroll
            halfWidth = track.scrollWidth / 2;
            
            // Initialize scroll position
            row.scrollLeft = index === 0 ? 0 : halfWidth;
            
            // Auto-scroll animation
            const animate = () => {
                if (!isPaused) {
                    row.scrollLeft += scrollDirection * scrollSpeed;
                    
                    // Reset position for infinite scroll
                    if (index === 0) {
                        // Row 1: scrolls left (increasing scrollLeft)
                        if (row.scrollLeft >= halfWidth) {
                            row.scrollLeft = 0;
                        }
                    } else {
                        // Row 2: scrolls right (decreasing scrollLeft)
                        if (row.scrollLeft <= 0) {
                            row.scrollLeft = halfWidth;
                        }
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
        row.addEventListener('mouseenter', pauseOnInteraction);
        row.addEventListener('mouseleave', resumeOnLeave);
        
        // Touch events
        row.addEventListener('touchstart', pauseOnInteraction, { passive: true });
        row.addEventListener('touchmove', pauseOnInteraction, { passive: true });
        row.addEventListener('touchend', resumeOnLeave, { passive: true });
        row.addEventListener('touchcancel', resumeOnLeave, { passive: true });
        
        // Cleanup on page unload
        window.addEventListener('beforeunload', () => {
            if (animationId) {
                cancelAnimationFrame(animationId);
            }
        });
    });
});
