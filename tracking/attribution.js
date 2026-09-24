/**
 * Visitor attribution — where did this visitor come from?
 *
 * Records a first-touch and a last-touch label (e.g. "Google Ads", "Google (organic)")
 * so the contact form can say how an enquirer found us. Stores only the label, the
 * campaign name if tagged, the landing path and the date — never raw click IDs.
 *
 * Exposes window.PriesmontAttribution.get() -> { first, last } or null values.
 */
(function () {
    'use strict';

    var KEY = 'priesmont_attribution';
    var MAX_AGE_DAYS = 90;

    function classify() {
        var params = new URLSearchParams(window.location.search);
        var campaign = params.get('utm_campaign') || '';

        if (params.has('gclid') || params.has('gbraid') || params.has('wbraid')) {
            return { source: 'Google Ads', campaign: campaign };
        }
        if (params.has('fbclid')) return { source: 'Facebook / Instagram', campaign: campaign };
        if (params.get('utm_source')) {
            var medium = params.get('utm_medium');
            return { source: params.get('utm_source') + (medium ? ' / ' + medium : ''), campaign: campaign };
        }

        var ref = '';
        try { ref = document.referrer ? new URL(document.referrer).hostname : ''; } catch (e) { ref = ''; }
        if (!ref || ref === window.location.hostname) return null; // internal navigation or reload
        if (/(^|\.)google\./.test(ref)) return { source: 'Google (organic)', campaign: '' };
        if (/bing\.|duckduckgo\.|ecosia\.|yahoo\./.test(ref)) return { source: 'Other search (' + ref + ')', campaign: '' };
        if (/chatgpt\.com|openai\.com|perplexity\.ai|gemini\.google|copilot\.microsoft|claude\.ai/.test(ref)) {
            return { source: 'AI assistant (' + ref + ')', campaign: '' };
        }
        if (/facebook\.|instagram\.|linkedin\.|t\.co$/.test(ref)) return { source: 'Social (' + ref + ')', campaign: '' };
        return { source: 'Referral (' + ref + ')', campaign: '' };
    }

    function read() {
        try {
            var saved = JSON.parse(localStorage.getItem(KEY) || 'null');
            if (!saved || !saved.first) return null;
            var age = (Date.now() - Date.parse(saved.first.date)) / 864e5;
            return age > MAX_AGE_DAYS ? null : saved;
        } catch (e) {
            return null;
        }
    }

    function record() {
        var touch = classify();
        var saved = read();

        // A visit with no signal (typed URL, bookmark) is "Direct" — but it must not
        // overwrite an earlier real source as the last touch within the same session.
        if (!touch) {
            if (saved) return saved;
            touch = { source: 'Direct', campaign: '' };
        }
        touch.date = new Date().toISOString().slice(0, 10);
        touch.landing = window.location.pathname;

        var next = { first: saved ? saved.first : touch, last: touch };
        try { localStorage.setItem(KEY, JSON.stringify(next)); } catch (e) { /* private mode */ }
        return next;
    }

    var current = record();

    function label(t) {
        if (!t) return '';
        return t.source + (t.campaign ? ' — ' + t.campaign : '') + ' · ' + t.date;
    }

    // Canonical English labels for the "How did you find us?" keys (index.html option values),
    // so emails, GA4 and the dashboard read the same words whatever the site language.
    var FOUND_US = {
        google: 'Google', ota: 'Saw you on Booking.com / Airbnb', friends: 'Friends, family or colleagues',
        returning: 'Stayed here before', company: 'Company event / team outing', social: 'Instagram / Facebook',
        ai: 'ChatGPT or another AI assistant', other: 'Other'
    };

    window.PriesmontAttribution = {
        get: function () { return current; },
        foundUsLabel: function (key) { return FOUND_US[key] || ''; },
        firstLabel: function () { return label(current && current.first); },
        lastLabel: function () { return label(current && current.last); }
    };
})();
