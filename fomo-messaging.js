/**
 * FOMO (Fear of Missing Out) Messaging System
 * Rotates urgency messages to create time pressure and scarcity
 */

(function() {
    'use strict';

    // Hero availability messages (subtle, elegant)
    const heroMessages = [
        "Limited availability this season — Book now to secure your dates",
        "Popular weekends filling fast — Reserve your stay today",
        "Only a few dates remaining this season",
        "High demand period — Secure your preferred dates now",
        "Last chance to book for upcoming holidays"
    ];

    // Booking section urgency messages (more direct)
    const bookingMessages = [
        "Only a few weekends still available this season",
        "Popular dates booking quickly — Reserve now",
        "Limited availability for upcoming months",
        "High demand — Book today to avoid disappointment",
        "Last remaining dates for peak season",
        "Weekend availability is limited — Secure your stay"
    ];

    // Contact form urgency (when user is about to submit)
    const contactMessages = [
        "Don't miss out — Limited availability this season",
        "Popular dates are filling fast",
        "Only a few weekends remaining"
    ];

    /**
     * Get a random message from array
     */
    function getRandomMessage(messages) {
        return messages[Math.floor(Math.random() * messages.length)];
    }

    /**
     * Rotate messages periodically (every 8 seconds)
     */
    function rotateMessages() {
        const heroBanner = document.getElementById('heroAvailabilityBanner');
        const heroText = document.getElementById('availabilityText');
        const bookingText = document.getElementById('bookingUrgencyText');

        if (heroText) {
            let heroIndex = 0;
            setInterval(() => {
                heroIndex = (heroIndex + 1) % heroMessages.length;
                heroText.textContent = heroMessages[heroIndex];
                // Fade effect
                heroText.style.opacity = '0';
                setTimeout(() => {
                    heroText.style.opacity = '1';
                }, 200);
            }, 8000);
        }

        if (bookingText) {
            let bookingIndex = 0;
            setInterval(() => {
                bookingIndex = (bookingIndex + 1) % bookingMessages.length;
                bookingText.textContent = bookingMessages[bookingIndex];
                // Fade effect
                bookingText.style.opacity = '0';
                setTimeout(() => {
                    bookingText.style.opacity = '1';
                }, 200);
            }, 10000);
        }
    }

    /**
     * Initialize FOMO messaging
     */
    function init() {
        // Set initial random messages
        const heroText = document.getElementById('availabilityText');
        const bookingText = document.getElementById('bookingUrgencyText');

        if (heroText) {
            heroText.textContent = getRandomMessage(heroMessages);
            heroText.style.transition = 'opacity 0.3s ease';
        }

        if (bookingText) {
            bookingText.textContent = getRandomMessage(bookingMessages);
            bookingText.style.transition = 'opacity 0.3s ease';
        }

        // Start rotating messages after a delay
        setTimeout(rotateMessages, 5000);
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
