/**
 * DOM Event Hooks for Meta Tracking
 * Wires up all user interactions to the tracking layer
 */

(function() {
    'use strict';

    const DEBUG = new URLSearchParams(window.location.search).has('debug_tracking');

    // ============================================================================
    // Booking Funnel Hooks
    // ============================================================================

    /**
     * Navigation "Book Now" buttons - removed InitiateCheckout tracking
     * InitiateCheckout should only fire when user actually interacts with booking widget
     * (selects dates, checks availability), not just navigation clicks
     */
    function initBookingButtonHooks() {
        // Navigation clicks are just navigation - no tracking needed here
        // InitiateCheckout is tracked in initLodgifyHooks() when user actually interacts with widget
        if (DEBUG) {
            console.log('[MetaTracking DOM] Booking button hooks initialized (no tracking on nav clicks)');
        }
    }

    /**
     * Detect Lodgify widget interactions
     * Attempts multiple methods:
     * 1. postMessage events from Lodgify iframe
     * 2. Click detection on widget container
     * 3. URL change detection (if redirects to Lodgify)
     * 4. Custom Book Now button (tracks event then triggers Lodgify button)
     */
    function initLodgifyHooks() {
        // There are multiple widget instances (hero + booking section), each mounted
        // independently by Lodgify via querySelectorAll on the shared id.
        const widgetContainers = document.querySelectorAll('#lodgify-book-now-box');
        if (widgetContainers.length === 0) {
            if (DEBUG) console.log('[MetaTracking DOM] Lodgify widget container not found');
            return;
        }

        // Shared across all widgets: one InitiateCheckout per session regardless of
        // which widget the visitor touched.
        let lodgifyInteractionTracked = false;
        let lodgifyBookNowTracked = false;

        // Method 1: Listen for postMessage events from Lodgify iframe (global - register once)
        window.addEventListener('message', function(event) {
            // Only accept messages from Lodgify domains
            if (!event.origin.includes('lodgify.com') && !event.origin.includes('app.lodgify.com')) {
                return;
            }

            // Lodgify may send events like: { type: 'lodgify:dateSelected', data: {...} }
            if (event.data && typeof event.data === 'object') {
                const data = event.data;
                
                // Detect meaningful interactions (date selection, guest selection)
                if (data.type && (
                    data.type.includes('date') || 
                    data.type.includes('guest') || 
                    data.type.includes('select') ||
                    data.type === 'lodgify:interaction'
                )) {
                    if (!lodgifyInteractionTracked && window.MetaTracking) {
                        window.MetaTracking.trackInitiateCheckout('lodgify_widget_interaction', {
                            interaction_type: data.type || 'unknown',
                            widget_id: 'lodgify-book-now-box',
                            widget_location: 'unknown'
                        });
                        if (window.GA4Tracking) {
                            window.GA4Tracking.trackInitiateCheckout('lodgify_widget_interaction', {
                                interaction_type: data.type || 'unknown',
                                widget_id: 'lodgify-book-now-box',
                                widget_location: 'unknown'
                            });
                        }
                        lodgifyInteractionTracked = true;
                        if (DEBUG) console.log('[MetaTracking DOM] Lodgify interaction detected via postMessage:', data);
                    }
                }
            }
        });

        // Method 2: Listen for clicks on each widget container (tracking only, don't intercept)
        // Each widget mounts independently, so each needs its own readiness poll + listeners.
        widgetContainers.forEach(function(widgetContainer) {
            const widgetLocation = widgetContainer.closest('[data-widget-location]')?.dataset.widgetLocation || 'booking-section';

            const checkWidgetReady = setInterval(function() {
                if (widgetContainer.children.length > 0) {
                    clearInterval(checkWidgetReady);

                    // Listen for clicks on the widget container (just for tracking, don't prevent default)
                    widgetContainer.addEventListener('click', function(e) {
                        const target = e.target;
                        const button = target.tagName === 'BUTTON' ? target : target.closest('button');

                        if (button) {
                            // Strip accents so "Réserver" matches "reserver". The site ships en/nl/fr
                            // (translations.js: "Book Now" / "Boek Nu" / "Réserver"), so matching only
                            // "book" silently missed every non-English visitor.
                            const buttonText = (button.textContent || button.innerText || '')
                                .trim()
                                .toLowerCase()
                                .normalize('NFD')
                                .replace(/[\u0300-\u036f]/g, '');
                            const isBookNow = ['book', 'boek', 'reserver'].some(function (label) {
                                return buttonText.includes(label);
                            });

                            if (isBookNow && !lodgifyBookNowTracked) {
                                // Track the event (but don't prevent default - let Lodgify handle the redirect)
                                if (window.MetaTracking && window.MetaTracking.trackLodgifyBookNowClick) {
                                    window.MetaTracking.trackLodgifyBookNowClick('lodgify_widget_book_now_button', {
                                        widget_id: 'lodgify-book-now-box',
                                        widget_location: widgetLocation
                                    });
                                    if (DEBUG) console.log('[MetaTracking DOM] ✅ LodgifyBookNowClick event fired', widgetLocation);
                                }
                                // Fired independently of Meta: ad blockers block the Meta Pixel far more
                                // often than the Google tag, and this is the strongest intent signal we have.
                                if (window.GA4Tracking) {
                                    window.GA4Tracking.trackCustom('book_now_click', {
                                        widget_id: 'lodgify-book-now-box',
                                        widget_location: widgetLocation
                                    });
                                    if (DEBUG) console.log('[GA4 DOM] ✅ book_now_click event fired', widgetLocation);
                                }
                                lodgifyBookNowTracked = true;
                            }
                        }

                        // For other interactions (date selection, etc.), fire InitiateCheckout
                        if (!lodgifyInteractionTracked && window.MetaTracking) {
                            const isInput = target.tagName === 'INPUT' || target.tagName === 'SELECT';
                            const isClickable = target.closest('[role="button"]') ||
                                              target.closest('[aria-label*="date"]') ||
                                              target.closest('[aria-label*="guest"]');

                            if (isInput || isClickable) {
                                window.MetaTracking.trackInitiateCheckout('lodgify_widget_click', {
                                    interaction_type: isInput ? 'input_focus' : 'widget_interaction',
                                    widget_id: 'lodgify-book-now-box',
                                    widget_location: widgetLocation
                                });
                                if (window.GA4Tracking) {
                                    window.GA4Tracking.trackInitiateCheckout('lodgify_widget_click', {
                                        interaction_type: isInput ? 'input_focus' : 'widget_interaction',
                                        widget_id: 'lodgify-book-now-box',
                                        widget_location: widgetLocation
                                    });
                                }
                                lodgifyInteractionTracked = true;
                                if (DEBUG) console.log('[MetaTracking DOM] Lodgify widget interaction detected:', widgetLocation, target);
                            }
                        }
                    });

                    // Also detect focus events on inputs (date/guest selection)
                    widgetContainer.addEventListener('focusin', function(e) {
                        if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT') {
                            if (!lodgifyInteractionTracked && window.MetaTracking) {
                                window.MetaTracking.trackInitiateCheckout('lodgify_widget_input_focus', {
                                    interaction_type: 'input_focus',
                                    widget_id: 'lodgify-book-now-box',
                                    widget_location: widgetLocation
                                });
                                if (window.GA4Tracking) {
                                    window.GA4Tracking.trackInitiateCheckout('lodgify_widget_input_focus', {
                                        interaction_type: 'input_focus',
                                        widget_id: 'lodgify-book-now-box',
                                        widget_location: widgetLocation
                                    });
                                }
                                lodgifyInteractionTracked = true;
                                if (DEBUG) console.log('[MetaTracking DOM] Lodgify input focus detected:', widgetLocation, e.target);
                            }
                        }
                    }, { once: true });
                }
            }, 500);
        });

        // Method 3: Detect navigation to Lodgify checkout URL
        // Check if current URL indicates we're on Lodgify checkout
        const currentUrl = window.location.href;
        if (currentUrl.includes('lodgify.com') || currentUrl.includes('/checkout') || currentUrl.includes('/booking')) {
            if (window.MetaTracking && !lodgifyInteractionTracked) {
                window.MetaTracking.trackInitiateCheckout('lodgify_checkout_url', {
                    url: currentUrl
                });
                if (window.GA4Tracking) {
                    window.GA4Tracking.trackInitiateCheckout('lodgify_checkout_url', {
                        url: currentUrl
                    });
                }
                lodgifyInteractionTracked = true;
                if (DEBUG) console.log('[MetaTracking DOM] Lodgify checkout URL detected:', currentUrl);
            }
        }
        
    }


    // ============================================================================
    // Inquiry Funnel Hooks
    // ============================================================================

    /**
     * Wire up Contact navigation link click (optional ViewContent)
     */
    function initContactNavHooks() {
        const contactLinks = document.querySelectorAll('a[href="#contact"]');
        
        contactLinks.forEach(link => {
            link.addEventListener('click', function() {
                if (window.MetaTracking) {
                    // Optional soft signal - ViewContent when user shows interest in contacting
                    window.MetaTracking.trackViewContent('contact_nav', {
                        content_name: 'Contact Section',
                        content_category: 'Inquiry'
                    });
                }
                if (window.GA4Tracking) {
                    window.GA4Tracking.trackViewContent('contact_nav', {
                        content_name: 'Contact Section',
                        content_category: 'Inquiry'
                    });
                }
            }, { once: true });
        });

        if (DEBUG && contactLinks.length > 0) {
            console.log('[MetaTracking DOM] Initialized contact nav hooks:', contactLinks.length);
        }
    }

    /**
     * Wire up Contact form submission
     * Only fires Lead on successful submission (validates form first)
     */
    function initContactFormHooks() {
        const contactForm = document.getElementById('contactForm');
        if (!contactForm) {
            if (DEBUG) console.log('[MetaTracking DOM] Contact form not found');
            return;
        }

        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Validate form before tracking
            if (!contactForm.checkValidity()) {
                if (DEBUG) console.log('[MetaTracking DOM] Contact form invalid, not tracking');
                contactForm.reportValidity();
                return;
            }

            // Get form data
            const formData = {
                name: document.getElementById('name')?.value || '',
                email: document.getElementById('email')?.value || '',
                checkin: document.getElementById('checkin')?.value || '',
                checkout: document.getElementById('checkout')?.value || '',
                guests: document.getElementById('guests')?.value || '',
                hearAbout: document.getElementById('hearAbout')?.value || '',
                message: document.getElementById('message')?.value || '',
                website: document.getElementById('website')?.value || ''
            };

            // Prepare Lead event parameters
            const leadParams = {};
            
            if (formData.checkin) {
                leadParams.check_in = formData.checkin;
            }
            
            if (formData.checkout) {
                leadParams.check_out = formData.checkout;
            }
            
            if (formData.guests) {
                leadParams.guests = parseInt(formData.guests) || 0;
            }

            if (formData.hearAbout) {
                leadParams.referral_source = formData.hearAbout;
            }

            const submitButton = contactForm.querySelector('button[type="submit"]');
            const originalText = submitButton?.textContent || 'Submit';

            function setStatus(message, isError) {
                let status = contactForm.querySelector('.contact-form-status');
                if (!status) {
                    status = document.createElement('p');
                    status.className = 'contact-form-status';
                    status.setAttribute('role', 'status');
                    status.setAttribute('aria-live', 'polite');
                    contactForm.appendChild(status);
                }
                status.textContent = message;
                status.style.color = isError ? '#b3261e' : '#1b5e20';
                status.style.marginTop = '1rem';
            }

            function trackLead(deliveryMethod) {
                const params = Object.assign({ delivery: deliveryMethod }, leadParams);
                if (window.MetaTracking) {
                    window.MetaTracking.trackLead('contact_form_submission', params);
                }
                if (window.GA4Tracking) {
                    window.GA4Tracking.trackLead('contact_form_submission', params);
                }
                if (DEBUG) console.log('[GA4 DOM] ✅ generate_lead fired, delivery:', deliveryMethod);
            }

            // Fallback for when the mail service is unreachable: hand off to the
            // visitor's email client rather than losing the enquiry entirely.
            function mailtoFallback() {
                const lines = [
                    'Name: ' + formData.name,
                    'Email: ' + formData.email,
                    formData.checkin ? 'Check-in: ' + formData.checkin : '',
                    formData.checkout ? 'Check-out: ' + formData.checkout : '',
                    formData.guests ? 'Guests: ' + formData.guests : '',
                    formData.hearAbout ? 'Heard about us via: ' + formData.hearAbout : '',
                    formData.message ? '\n' + formData.message : ''
                ].filter(Boolean).join('\n');

                const mailtoLink = 'mailto:carlpuylaert@hotmail.com' +
                    '?cc=' + encodeURIComponent('paco.puy.pp@gmail.com') +
                    '&subject=' + encodeURIComponent('Booking Inquiry from ' + formData.name + ' - Priesmont') +
                    '&body=' + encodeURIComponent(lines);

                trackLead('mailto_fallback');
                setStatus('We could not reach our server. Your email app will open so you can send the enquiry directly.', true);
                window.location.href = mailtoLink;
            }

            if (submitButton) {
                submitButton.disabled = true;
                submitButton.textContent = 'Sending...';
            }

            fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            }).then(function (response) {
                if (!response.ok) {
                    throw new Error('Request failed with status ' + response.status);
                }
                trackLead('api');
                setStatus('Thank you — your enquiry has been sent. We usually reply within a few hours.', false);
                contactForm.reset();
            }).catch(function (error) {
                if (DEBUG) console.warn('[Contact] API submit failed, falling back to mailto:', error);
                mailtoFallback();
            }).finally(function () {
                if (submitButton) {
                    submitButton.disabled = false;
                    submitButton.textContent = originalText;
                }
            });
        });
    }

    // ============================================================================
    // Initialization
    // ============================================================================

    function init() {
        if (DEBUG) {
            console.log('[MetaTracking DOM] Initializing DOM hooks...');
        }

        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', function() {
                initBookingButtonHooks();
                initLodgifyHooks();
                initContactNavHooks();
                initContactFormHooks();
            });
        } else {
            // DOM already ready
            initBookingButtonHooks();
            initLodgifyHooks();
            initContactNavHooks();
            initContactFormHooks();
        }
    }

    // Auto-initialize
    init();

    // Make available globally for manual initialization if needed
    if (typeof window !== 'undefined') {
        window.MetaTrackingDOM = {
            init: init,
            initBookingButtonHooks: initBookingButtonHooks,
            initLodgifyHooks: initLodgifyHooks,
            initContactNavHooks: initContactNavHooks,
            initContactFormHooks: initContactFormHooks
        };
    }

})();
