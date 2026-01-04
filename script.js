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
            
            // Add scrolled class for styling
            if (currentScroll > 100) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
                navbar.classList.remove('nav-collapsed');
            }
            
            // Collapse/expand navbar based on scroll direction
            if (currentScroll > lastScroll && currentScroll > 150) {
                // Scrolling down - collapse to logo + hamburger
                navbar.classList.add('nav-collapsed');
                navMenu.classList.remove('active'); // Close mobile menu if open
                mobileMenuToggle.classList.remove('active');
            } else if (currentScroll < lastScroll || currentScroll <= 100) {
                // Scrolling up or at top - expand navbar
                navbar.classList.remove('nav-collapsed');
            }
            
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

// Smooth scroll for anchor links
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
            const target = parseInt(statNumber.getAttribute('data-target'));
            
            if (!statNumber.classList.contains('animated')) {
                statNumber.classList.add('animated');
                animateCounter(statNumber, target);
            }
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-item').forEach(stat => {
    statsObserver.observe(stat);
});

// Fade in animation on scroll
const fadeInObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, { threshold: 0.1 });

// Apply fade-in to service cards
document.querySelectorAll('.service-card').forEach((card, index) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
    fadeInObserver.observe(card);
});

// Contact form handling
const contactForm = document.getElementById('contactForm');

contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Get form values
    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        checkin: document.getElementById('checkin').value,
        guests: document.getElementById('guests').value,
        message: document.getElementById('message').value
    };
    
    // Here you would typically send the data to a server
    // For now, we'll just show a success message
    const submitButton = contactForm.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    
    submitButton.textContent = 'Sending...';
    submitButton.disabled = true;
    
    // Track Lead event with Meta Pixel
    if (window.metaPixelTracker) {
        window.metaPixelTracker.trackLead('Contact Form');
    }
    
    // Simulate form submission
    setTimeout(() => {
        submitButton.textContent = 'Booking Request Sent! ✓';
        submitButton.style.background = '#10b981';
        
        // Track CompleteRegistration if they provided check-in date
        if (formData.checkin && window.metaPixelTracker) {
            window.metaPixelTracker.trackCompleteRegistration('Website Form');
        }
        
        // Reset form
        contactForm.reset();
        
        // Reset button after 3 seconds
        setTimeout(() => {
            submitButton.textContent = originalText;
            submitButton.disabled = false;
            submitButton.style.background = '';
        }, 3000);
    }, 1500);
});

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

// Track button clicks with pixel events
document.querySelectorAll('[data-pixel-event]').forEach(button => {
    button.addEventListener('click', function() {
        const eventName = this.getAttribute('data-pixel-event');
        if (window.metaPixelTracker) {
            if (eventName === 'InitiateCheckout') {
                window.metaPixelTracker.trackInitiateCheckout();
            } else if (eventName === 'ViewContent') {
                window.metaPixelTracker.trackViewContent('Priesmont Manor Features', 'Property');
            }
        }
    });
});

// Track when user views gallery
const galleryObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && window.metaPixelTracker) {
            window.metaPixelTracker.trackViewContent('Priesmont Manor Gallery', 'Gallery');
            galleryObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.3 });

const gallerySection = document.getElementById('gallery');
if (gallerySection) {
    galleryObserver.observe(gallerySection);
}

// Track when user interacts with booking section
const bookingObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && window.metaPixelTracker) {
            window.metaPixelTracker.trackInitiateCheckout();
            bookingObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.3 });

const bookingSection = document.getElementById('booking');
if (bookingSection) {
    bookingObserver.observe(bookingSection);
}

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
    
    // Track gallery view with Meta Pixel
    if (window.metaPixelTracker) {
        window.metaPixelTracker.trackViewContent('Priesmont Manor Gallery - Fullscreen', 'Gallery');
    }
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

// Service card hover effect enhancement
document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-10px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

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

