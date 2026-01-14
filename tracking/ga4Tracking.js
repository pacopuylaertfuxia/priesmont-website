/**
 * Google Analytics 4 (GA4) Tracking Layer
 * Integrates with existing Meta Pixel tracking for dual-platform analytics
 * 
 * Events are automatically sent to both Meta Pixel and GA4
 */

(function() {
    'use strict';

    const DEBUG = new URLSearchParams(window.location.search).has('debug_tracking');

    /**
     * Check if GA4 is loaded and ready
     */
    function isGA4Ready() {
        return typeof window.gtag !== 'undefined' && window.GA4_MEASUREMENT_ID && window.GA4_MEASUREMENT_ID !== 'G-XXXXXXXXXX';
    }

    /**
     * Track GA4 event
     */
    function trackEvent(eventName, parameters = {}) {
        if (!isGA4Ready()) {
            if (DEBUG) {
                console.log('[GA4] Not initialized or Measurement ID not configured');
            }
            return;
        }

        try {
            window.gtag('event', eventName, parameters);
            if (DEBUG) {
                console.log('[GA4] Event tracked:', eventName, parameters);
            }
        } catch (e) {
            console.error('[GA4] Error tracking event:', e);
        }
    }

    /**
     * Track page view
     */
    function trackPageView(pagePath, pageTitle) {
        if (!isGA4Ready()) return;
        
        trackEvent('page_view', {
            page_path: pagePath || window.location.pathname,
            page_title: pageTitle || document.title
        });
    }

    /**
     * Track InitiateCheckout (user starts booking process)
     */
    function trackInitiateCheckout(source, params = {}) {
        trackEvent('begin_checkout', {
            currency: params.currency || 'EUR',
            value: params.value || null,
            items: params.items || [],
            source: source,
            ...params
        });
    }

    /**
     * Track Lead (contact form submission)
     */
    function trackLead(source, params = {}) {
        trackEvent('generate_lead', {
            currency: params.currency || 'EUR',
            value: params.value || null,
            source: source,
            ...params
        });
    }

    /**
     * Track ViewContent (user views property/content)
     */
    function trackViewContent(source, params = {}) {
        trackEvent('view_item', {
            item_name: params.content_name || 'Priesmont Manor',
            item_category: params.content_category || 'Property',
            source: source,
            ...params
        });
    }

    /**
     * Track CompleteRegistration (booking completed)
     */
    function trackCompleteRegistration(source, params = {}) {
        trackEvent('sign_up', {
            method: 'booking',
            source: source,
            ...params
        });
    }

    /**
     * Track custom event
     */
    function trackCustom(eventName, parameters = {}) {
        trackEvent(eventName, parameters);
    }

    // Make GA4 tracking available globally
    if (typeof window !== 'undefined') {
        window.GA4Tracking = {
            trackPageView,
            trackInitiateCheckout,
            trackLead,
            trackViewContent,
            trackCompleteRegistration,
            trackCustom,
            isReady: isGA4Ready
        };

        // Auto-track page views on navigation
        if (isGA4Ready()) {
            trackPageView();
        }
    }

    if (DEBUG) {
        console.log('[GA4] Tracking layer initialized');
    }

})();
