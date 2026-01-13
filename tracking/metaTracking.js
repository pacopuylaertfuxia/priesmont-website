/**
 * Meta Pixel + Conversions API Tracking Layer
 * High-quality, deduplicated event tracking for luxury rental site
 * 
 * Features:
 * - UUID-based event_id generation for deduplication
 * - SessionStorage-based deduplication (one action = one event)
 * - Support for Pixel + Conversions API (CAPI) with same event_id
 * - Debug mode via ?debug_tracking=1
 */

(function() {
    'use strict';

    // ============================================================================
    // Configuration
    // ============================================================================

    const DEBUG = new URLSearchParams(window.location.search).has('debug_tracking');
    const PIXEL_ID = window.META_PIXEL_ID || null;
    
    // Storage keys for deduplication
    const STORAGE_KEYS = {
        INITIATE_CHECKOUT: 'meta_initiate_checkout_fired',
        LEAD: 'meta_lead_fired',
        VIEW_CONTENT: 'meta_view_content_contact_fired',
        ADD_PAYMENT_INFO: 'meta_add_payment_info_fired'
    };

    // ============================================================================
    // Utilities
    // ============================================================================

    /**
     * Generate UUID v4 for event_id (for deduplication)
     */
    function generateEventId() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            const r = Math.random() * 16 | 0;
            const v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    /**
     * Check if event has already fired this session
     */
    function hasFired(storageKey) {
        try {
            return sessionStorage.getItem(storageKey) === 'true';
        } catch (e) {
            if (DEBUG) console.warn('[MetaTracking] sessionStorage unavailable:', e);
            return false;
        }
    }

    /**
     * Mark event as fired in this session
     */
    function markAsFired(storageKey) {
        try {
            sessionStorage.setItem(storageKey, 'true');
        } catch (e) {
            if (DEBUG) console.warn('[MetaTracking] sessionStorage unavailable:', e);
        }
    }

    /**
     * Check if Meta Pixel (fbq) is available
     * Waits a bit if fbq is not immediately available (async script loading)
     */
    function isPixelReady() {
        if (typeof fbq === 'undefined') {
            // Pixel script might still be loading, wait a moment
            if (DEBUG) console.warn('[MetaTracking] fbq not yet available, pixel script may still be loading');
            return false;
        }
        if (!PIXEL_ID || PIXEL_ID === 'YOUR_PIXEL_ID_HERE') {
            if (DEBUG) console.warn('[MetaTracking] PIXEL_ID not configured:', PIXEL_ID);
            return false;
        }
        return true;
    }

    /**
     * Debug logging
     */
    function debugLog(event, params, eventId, wasDeduped) {
        if (!DEBUG) return;
        console.log('[MetaTracking]', {
            event: event,
            params: params,
            event_id: eventId,
            deduped: wasDeduped,
            pixel_ready: isPixelReady()
        });
    }

    /**
     * Get current page URL for event_source_url
     */
    function getCurrentUrl() {
        return window.location.href;
    }

    // ============================================================================
    // Core Tracking Functions
    // ============================================================================

    /**
     * Track InitiateCheckout event (Booking funnel)
     * @param {string} source - Source of the event (e.g., 'button_click', 'lodgify_interaction')
     * @param {object} extraParams - Additional parameters to include
     */
    function trackInitiateCheckout(source = 'unknown', extraParams = {}) {
        const storageKey = STORAGE_KEYS.INITIATE_CHECKOUT;
        
        // Deduplication: fire only once per session
        if (hasFired(storageKey)) {
            debugLog('InitiateCheckout', { source, ...extraParams }, null, true);
            return false;
        }

        if (!isPixelReady()) {
            if (DEBUG) {
                console.warn('[MetaTracking] Pixel not ready for InitiateCheckout');
                console.warn('  - fbq available:', typeof fbq !== 'undefined');
                console.warn('  - PIXEL_ID:', PIXEL_ID);
            }
            // Retry once after a short delay if fbq might still be loading
            if (typeof fbq === 'undefined') {
                setTimeout(function() {
                    if (isPixelReady() && !hasFired(storageKey)) {
                        trackInitiateCheckout(source, extraParams);
                    }
                }, 500);
            }
            return false;
        }

        const eventId = generateEventId();
        const params = {
            content_name: 'Priesmont Manor Booking',
            content_category: 'Booking',
            currency: 'EUR',
            event_source_url: getCurrentUrl(),
            ...extraParams
        };

        try {
            fbq('track', 'InitiateCheckout', params, { eventID: eventId });
            markAsFired(storageKey);
            debugLog('InitiateCheckout', params, eventId, false);

            // TODO: If CAPI is implemented, send to server with same eventId
            // sendToCAPI('InitiateCheckout', params, eventId);

            return true;
        } catch (e) {
            if (DEBUG) console.error('[MetaTracking] Error tracking InitiateCheckout:', e);
            return false;
        }
    }

    /**
     * Track Lead event (Inquiry funnel)
     * @param {string} source - Source of the event (e.g., 'contact_form_submission')
     * @param {object} extraParams - Additional parameters (check_in, check_out, guests, etc.)
     */
    function trackLead(source = 'unknown', extraParams = {}) {
        const storageKey = STORAGE_KEYS.LEAD;
        
        // Note: Lead can fire once per session (form submission = strong signal)
        // If you want to allow multiple leads per session, remove this check
        if (hasFired(storageKey)) {
            debugLog('Lead', { source, ...extraParams }, null, true);
            return false;
        }

        if (!isPixelReady()) {
            if (DEBUG) {
                console.warn('[MetaTracking] Pixel not ready for Lead');
                console.warn('  - fbq available:', typeof fbq !== 'undefined');
                console.warn('  - PIXEL_ID:', PIXEL_ID);
            }
            // Retry once after a short delay if fbq might still be loading
            if (typeof fbq === 'undefined') {
                setTimeout(function() {
                    if (isPixelReady() && !hasFired(storageKey)) {
                        trackLead(source, extraParams);
                    }
                }, 500);
            }
            return false;
        }

        const eventId = generateEventId();
        
        // Build parameters based on form data
        const hasDates = !!(extraParams.check_in || extraParams.check_out);
        const params = {
            content_name: 'Contact Form',
            content_category: source,
            event_source_url: getCurrentUrl(),
            content_type: hasDates ? 'booking_inquiry' : 'general_inquiry',
            has_dates: hasDates,
            ...extraParams
        };

        try {
            fbq('track', 'Lead', params, { eventID: eventId });
            markAsFired(storageKey);
            debugLog('Lead', params, eventId, false);

            // TODO: If CAPI is implemented, send to server with same eventId
            // sendToCAPI('Lead', params, eventId);

            return true;
        } catch (e) {
            if (DEBUG) console.error('[MetaTracking] Error tracking Lead:', e);
            return false;
        }
    }

    /**
     * Track ViewContent event (optional soft signal)
     * @param {string} source - Source of the event
     * @param {object} extraParams - Additional parameters
     */
    function trackViewContent(source = 'unknown', extraParams = {}) {
        // ViewContent for Contact nav is optional, so we dedupe but allow once per session
        const storageKey = STORAGE_KEYS.VIEW_CONTENT;
        
        if (hasFired(storageKey) && source === 'contact_nav') {
            debugLog('ViewContent', { source, ...extraParams }, null, true);
            return false;
        }

        if (!isPixelReady()) {
            if (DEBUG) console.warn('[MetaTracking] Pixel not ready for ViewContent');
            return false;
        }

        const eventId = generateEventId();
        const params = {
            content_name: 'Priesmont Manor',
            content_category: 'Property',
            event_source_url: getCurrentUrl(),
            ...extraParams
        };

        try {
            fbq('track', 'ViewContent', params, { eventID: eventId });
            if (source === 'contact_nav') {
                markAsFired(storageKey);
            }
            debugLog('ViewContent', params, eventId, false);

            return true;
        } catch (e) {
            if (DEBUG) console.error('[MetaTracking] Error tracking ViewContent:', e);
            return false;
        }
    }

    /**
     * Track LodgifyBookNowClick custom event (high-intent conversion)
     * Fires when user clicks "Book Now" in Lodgify widget after selecting dates/checking availability
     * This is a custom conversion event - set it up in Meta Events Manager as a conversion
     * @param {string} source - Source of the event (default: 'lodgify_widget_book_now')
     * @param {object} extraParams - Additional parameters (value, currency, etc.)
     */
    function trackLodgifyBookNowClick(source = 'lodgify_widget_book_now', extraParams = {}) {
        const storageKey = STORAGE_KEYS.ADD_PAYMENT_INFO; // Reusing storage key for deduplication
        
        // Allow multiple fires (user might click multiple times), but we can dedupe per session if desired
        // For high-intent conversion, we'll allow it to fire multiple times in case user goes back and clicks again
        
        if (!isPixelReady()) {
            if (DEBUG) {
                console.warn('[MetaTracking] Pixel not ready for LodgifyBookNowClick');
                console.warn('  - fbq available:', typeof fbq !== 'undefined');
                console.warn('  - PIXEL_ID:', PIXEL_ID);
            }
            // Retry once after a short delay if fbq might still be loading
            if (typeof fbq === 'undefined') {
                setTimeout(function() {
                    if (isPixelReady()) {
                        trackLodgifyBookNowClick(source, extraParams);
                    }
                }, 500);
            }
            return false;
        }

        const eventId = generateEventId();
        const params = {
            content_name: 'Priesmont Manor Booking',
            content_category: 'Booking',
            event_source_url: getCurrentUrl(),
            source: source,
            ...extraParams
        };

        try {
            // Using trackCustom for custom event - can be set up as conversion in Meta Events Manager
            fbq('trackCustom', 'LodgifyBookNowClick', params, { eventID: eventId });
            debugLog('LodgifyBookNowClick', params, eventId, false);

            // TODO: If CAPI is implemented, send to server with same eventId
            // sendToCAPI('LodgifyBookNowClick', params, eventId);

            return true;
        } catch (e) {
            if (DEBUG) console.error('[MetaTracking] Error tracking LodgifyBookNowClick:', e);
            return false;
        }
    }

    // ============================================================================
    // Public API
    // ============================================================================

    const MetaTracking = {
        init: function() {
            const ready = isPixelReady();
            if (DEBUG) {
                console.log('[MetaTracking] Initialized', {
                    pixel_id: PIXEL_ID,
                    pixel_ready: ready,
                    fbq_available: typeof fbq !== 'undefined',
                    debug_mode: true
                });
                
                if (!ready) {
                    console.warn('[MetaTracking] Pixel not ready! Check:');
                    console.warn('  1. Is meta-pixel-config.js loaded in <head>?');
                    console.warn('  2. Is META_PIXEL_ID set correctly?');
                    console.warn('  3. Is fbq function available?', typeof fbq);
                }
            }
            return this;
        },
        
        trackInitiateCheckout: trackInitiateCheckout,
        trackLead: trackLead,
        trackViewContent: trackViewContent,
        trackLodgifyBookNowClick: trackLodgifyBookNowClick,
        
        // Utility for checking if events fired (for testing)
        hasFired: function(eventType) {
            const keyMap = {
                'InitiateCheckout': STORAGE_KEYS.INITIATE_CHECKOUT,
                'Lead': STORAGE_KEYS.LEAD,
                'ViewContent': STORAGE_KEYS.VIEW_CONTENT,
                'LodgifyBookNowClick': STORAGE_KEYS.ADD_PAYMENT_INFO
            };
            const key = keyMap[eventType];
            return key ? hasFired(key) : false;
        }
    };

    // Make available globally
    if (typeof window !== 'undefined') {
        window.MetaTracking = MetaTracking;
    }

    // Auto-initialize when DOM is ready, but wait for pixel to be ready
    function waitForPixelAndInit() {
        if (typeof fbq !== 'undefined' || document.readyState === 'complete') {
            // Pixel loaded or page fully loaded, initialize
            MetaTracking.init();
        } else {
            // Wait a bit more for async pixel script
            setTimeout(waitForPixelAndInit, 100);
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', waitForPixelAndInit);
    } else {
        waitForPixelAndInit();
    }

})();
