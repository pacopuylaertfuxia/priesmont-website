// Meta Pixel Event Tracking
// This file handles all Meta Pixel events for the website

class MetaPixelTracker {
    constructor() {
        this.pixelId = window.META_PIXEL_ID || null;
    }

    // Check if pixel is initialized
    isReady() {
        return typeof fbq !== 'undefined' && this.pixelId && this.pixelId !== 'YOUR_PIXEL_ID_HERE';
    }

    // Track PageView (automatic, but can be called manually)
    trackPageView() {
        if (this.isReady()) {
            fbq('track', 'PageView');
        }
    }

    // Track when user views property content
    trackViewContent(contentName = 'Priesmont Manor', contentCategory = 'Property') {
        if (this.isReady()) {
            fbq('track', 'ViewContent', {
                content_name: contentName,
                content_category: contentCategory,
                content_type: 'property'
            });
        }
    }

    // Track when user initiates booking/checkout
    trackInitiateCheckout(value = null, currency = 'EUR') {
        if (this.isReady()) {
            const params = {
                content_name: 'Priesmont Manor Booking',
                content_category: 'Booking',
                currency: currency
            };
            if (value) params.value = value;
            fbq('track', 'InitiateCheckout', params);
        }
    }

    // Track when user submits contact/booking form (Lead event)
    trackLead(source = 'Contact Form') {
        if (this.isReady()) {
            fbq('track', 'Lead', {
                content_name: 'Priesmont Manor Inquiry',
                content_category: source
            });
        }
    }

    // Track when user completes registration/booking
    trackCompleteRegistration(method = 'Website') {
        if (this.isReady()) {
            fbq('track', 'CompleteRegistration', {
                content_name: 'Priesmont Manor Booking',
                status: true,
                method: method
            });
        }
    }

    // Track when user searches for dates
    trackSearch(searchString = '') {
        if (this.isReady()) {
            fbq('track', 'Search', {
                search_string: searchString || 'Date Search',
                content_category: 'Booking'
            });
        }
    }

    // Track when user schedules a viewing
    trackSchedule() {
        if (this.isReady()) {
            fbq('track', 'Schedule', {
                content_name: 'Priesmont Manor Viewing',
                content_category: 'Viewing'
            });
        }
    }

    // Track when user adds to wishlist/favorites
    trackAddToWishlist() {
        if (this.isReady()) {
            fbq('track', 'AddToWishlist', {
                content_name: 'Priesmont Manor',
                content_category: 'Property'
            });
        }
    }

    // Track custom event
    trackCustomEvent(eventName, parameters = {}) {
        if (this.isReady()) {
            fbq('trackCustom', eventName, parameters);
        }
    }
}

// Initialize tracker
const metaPixelTracker = new MetaPixelTracker();

// Track page view on load
document.addEventListener('DOMContentLoaded', () => {
    // Track initial page view
    metaPixelTracker.trackPageView();
    
    // Track ViewContent for property viewing
    metaPixelTracker.trackViewContent('Priesmont Manor', 'Property');
});

// Export for use in other files
if (typeof window !== 'undefined') {
    window.metaPixelTracker = metaPixelTracker;
}


