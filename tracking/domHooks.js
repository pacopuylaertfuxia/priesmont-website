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
        const widgetContainer = document.getElementById('lodgify-book-now-box');
        if (!widgetContainer) {
            if (DEBUG) console.log('[MetaTracking DOM] Lodgify widget container not found');
            return;
        }

        let lodgifyInteractionTracked = false;
        let lodgifyBookNowTracked = false;

        // Method 1: Listen for postMessage events from Lodgify iframe
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
                            widget_id: 'lodgify-book-now-box'
                        });
                        lodgifyInteractionTracked = true;
                        if (DEBUG) console.log('[MetaTracking DOM] Lodgify interaction detected via postMessage:', data);
                    }
                }
            }
        });

        // Method 2: Detect clicks on widget container or its children
        // Since widget loads dynamically, wait for it to be ready
        const checkWidgetReady = setInterval(function() {
            if (widgetContainer.children.length > 0) {
                clearInterval(checkWidgetReady);
                
                // Listen for clicks on the widget container (capture phase to catch all)
                widgetContainer.addEventListener('click', function(e) {
                    const target = e.target;
                    const button = target.tagName === 'BUTTON' ? target : target.closest('button');
                    
                    if (DEBUG) {
                        console.log('[MetaTracking DOM] Widget click detected:', {
                            target: target.tagName,
                            targetText: target.textContent?.trim().substring(0, 50),
                            hasButton: !!button,
                            buttonText: button ? button.textContent?.trim() : null
                        });
                    }
                    
                    // Check if this is the "Book Now" button
                    if (button) {
                        const buttonText = button.textContent.trim().toLowerCase();
                        const buttonInnerText = button.innerText?.trim().toLowerCase() || buttonText;
                        const ariaLabel = (button.getAttribute('aria-label') || '').toLowerCase();
                        
                        // More flexible detection - check for "book" anywhere in button text
                        const isBookNowButton = buttonText.includes('book') || 
                                              buttonInnerText.includes('book') ||
                                              ariaLabel.includes('book');
                        
                        if (DEBUG) {
                            console.log('[MetaTracking DOM] Button detected:', {
                                buttonText: buttonText,
                                buttonInnerText: buttonInnerText,
                                ariaLabel: ariaLabel,
                                isBookNowButton: isBookNowButton,
                                alreadyTracked: lodgifyBookNowTracked
                            });
                        }
                        
                        if (isBookNowButton && !lodgifyBookNowTracked) {
                            // Track high-intent conversion event (user clicked Book Now after selecting dates)
                            if (window.MetaTracking && window.MetaTracking.trackLodgifyBookNowClick) {
                                window.MetaTracking.trackLodgifyBookNowClick('lodgify_widget_book_now_button', {
                                    widget_id: 'lodgify-book-now-box',
                                    button_text: buttonText || buttonInnerText
                                });
                                lodgifyBookNowTracked = true;
                                console.log('[MetaTracking DOM] ✅ Lodgify Book Now button clicked - LodgifyBookNowClick event fired');
                                return; // Don't also fire InitiateCheckout
                            } else {
                                console.warn('[MetaTracking DOM] ❌ MetaTracking.trackLodgifyBookNowClick not available');
                            }
                        }
                    }
                    
                    // For other interactions (date selection, etc.), fire InitiateCheckout
                    if (!lodgifyInteractionTracked && window.MetaTracking) {
                        // Only track meaningful clicks (not just the container itself)
                        const isInput = target.tagName === 'INPUT' || target.tagName === 'SELECT';
                        const isClickable = target.closest('[role="button"]') || 
                                          target.closest('[aria-label*="date"]') ||
                                          target.closest('[aria-label*="guest"]');

                        if (isInput || isClickable) {
                            window.MetaTracking.trackInitiateCheckout('lodgify_widget_click', {
                                interaction_type: isInput ? 'input_focus' : 'widget_interaction',
                                widget_id: 'lodgify-book-now-box'
                            });
                            lodgifyInteractionTracked = true;
                            if (DEBUG) console.log('[MetaTracking DOM] Lodgify widget interaction detected:', target);
                        }
                    }
                }, { capture: true }); // Don't use 'once' - we want to catch Book Now button clicks
                

                // Also detect focus events on inputs (date/guest selection)
                widgetContainer.addEventListener('focusin', function(e) {
                    if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT') {
                        if (!lodgifyInteractionTracked && window.MetaTracking) {
                            window.MetaTracking.trackInitiateCheckout('lodgify_widget_input_focus', {
                                interaction_type: 'input_focus',
                                widget_id: 'lodgify-book-now-box'
                            });
                            lodgifyInteractionTracked = true;
                            if (DEBUG) console.log('[MetaTracking DOM] Lodgify input focus detected:', e.target);
                        }
                    }
                }, { once: true });
            }
        }, 500);

        // Stop checking after 10 seconds
        setTimeout(function() {
            clearInterval(checkWidgetReady);
        }, 10000);

        // Method 3: Detect navigation to Lodgify checkout URL
        // Check if current URL indicates we're on Lodgify checkout
        const currentUrl = window.location.href;
        if (currentUrl.includes('lodgify.com') || currentUrl.includes('/checkout') || currentUrl.includes('/booking')) {
            if (window.MetaTracking && !lodgifyInteractionTracked) {
                window.MetaTracking.trackInitiateCheckout('lodgify_checkout_url', {
                    url: currentUrl
                });
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
                checkout: null, // Contact form only has checkin
                guests: document.getElementById('guests')?.value || '',
                message: document.getElementById('message')?.value || ''
            };

            // Prepare Lead event parameters
            const leadParams = {};
            
            if (formData.checkin) {
                leadParams.check_in = formData.checkin;
                // If we had checkout, we'd include it here
            }
            
            if (formData.guests) {
                leadParams.guests = parseInt(formData.guests) || 0;
            }

            // Track Lead event BEFORE async submission (to ensure it fires)
            // In production, you'd track this AFTER server confirms success
            // For now, we track on client-side validation success
            if (window.MetaTracking) {
                window.MetaTracking.trackLead('contact_form_submission', leadParams);
            }

            // Simulate form submission (replace with actual API call)
            const submitButton = contactForm.querySelector('button[type="submit"]');
            const originalText = submitButton?.textContent || 'Submit';

            if (submitButton) {
                submitButton.textContent = 'Sending...';
                submitButton.disabled = true;
            }

            // TODO: Replace with actual form submission
            // Example: fetch('/api/contact', { method: 'POST', body: JSON.stringify(formData) })
            //   .then(response => response.json())
            //   .then(data => {
            //       if (data.success) {
            //           // Lead already tracked above, or track here if you prefer
            //           showSuccessMessage();
            //       }
            //   });

            // Simulate async submission
            setTimeout(function() {
                if (submitButton) {
                    submitButton.textContent = 'Message Sent! ✓';
                    submitButton.style.background = '#10b981';
                    
                    // Reset form
                    contactForm.reset();
                    
                    // Reset button after 3 seconds
                    setTimeout(function() {
                        if (submitButton) {
                            submitButton.textContent = originalText;
                            submitButton.disabled = false;
                            submitButton.style.background = '';
                        }
                    }, 3000);
                }

                if (DEBUG) {
                    console.log('[MetaTracking DOM] Contact form submitted successfully:', formData);
                }
            }, 1500);
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
