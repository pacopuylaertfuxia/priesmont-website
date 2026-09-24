/**
 * Book Now click -> dashboard, so Lodgify bookings can be attributed.
 *
 * Lodgify's checkout lives on its own domain and never reports back, but its Book Now
 * link carries the chosen dates (…&arrival=YYYY-MM-DD&departure=YYYY-MM-DD). A single
 * house is booked once per date range, so the dashboard matches a later Lodgify booking
 * to this click by dates. Sends the tracked source (tracking/attribution.js) and the
 * optional "How did you find us?" answer. Nothing personal: no name, email or click ID.
 */
(function () {
    'use strict';

    var STORE = 'priesmont_found_us';

    function selects() { return document.querySelectorAll('.found-us-select'); }

    function answerKey() {
        try { return sessionStorage.getItem(STORE) || ''; } catch (e) { return ''; }
    }

    // Keep the hero and booking-section dropdowns in step, and remember the answer
    // across the widget's own re-renders.
    function initSelects() {
        var saved = answerKey();
        selects().forEach(function (sel) {
            if (saved) sel.value = saved;
            sel.addEventListener('change', function () {
                try { sessionStorage.setItem(STORE, sel.value); } catch (e) { /* private mode */ }
                selects().forEach(function (other) { if (other !== sel) other.value = sel.value; });
            });
        });
    }

    function answer() {
        var key = answerKey();
        return (window.PriesmontAttribution && window.PriesmontAttribution.foundUsLabel(key)) || '';
    }

    // Capture phase on document: the Lodgify widget rebuilds its DOM when dates are picked,
    // so listeners on the widget element itself can go stale.
    document.addEventListener('click', function (e) {
        var link = e.target.closest && e.target.closest('a[href*="checkout.lodgify.com"]');
        if (!link) return;
        var url;
        try { url = new URL(link.href); } catch (err) { return; }

        var touch = window.PriesmontAttribution && window.PriesmontAttribution.get();
        var payload = {
            kind: 'book_now',
            arrival: url.searchParams.get('arrival') || '',
            departure: url.searchParams.get('departure') || '',
            adults: Number(url.searchParams.get('adults')) || 0,
            answer: answer(),
            firstSource: (touch && touch.first && touch.first.source) || '',
            lastSource: (touch && touch.last && touch.last.source) || '',
            lang: (function () { try { return localStorage.getItem('preferredLanguage') || 'en'; } catch (err) { return 'en'; } })()
        };
        // sendBeacon survives the navigation to Lodgify's checkout
        try {
            navigator.sendBeacon('/api/book-click', new Blob([JSON.stringify(payload)], { type: 'application/json' }));
        } catch (err) { /* best effort */ }
    }, true);

    window.PriesmontBookClick = { answer: answer };

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initSelects);
    else initSelects();
})();
