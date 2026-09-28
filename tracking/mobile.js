/**
 * Mobile speed + booking reach (no content changes, nothing Google indexes):
 * 1. Hero slideshow: load each photo at screen size, only just before it is shown
 * 2. Use-case videos (former GIFs): load and play only when scrolled near
 * 3. Floating "Book Now" on phones, hidden while the booking widget is on screen
 */
(function () {
    'use strict';
    var PHONE = window.matchMedia('(max-width: 768px)');

    // 1. Hero slides carry data-bg (the 1920px URL); pick a width that fits the screen
    var width = Math.min(1920, Math.ceil((window.innerWidth * (window.devicePixelRatio || 1)) / 200) * 200);
    var slides = document.querySelectorAll('.hero-slide[data-bg]');
    function loadSlide(slide) {
        if (!slide || slide.dataset.loaded) return;
        slide.style.backgroundImage = 'url("' + slide.dataset.bg.replace(/w=\d+/, 'w=' + width) + '")';
        slide.dataset.loaded = '1';
    }
    loadSlide(slides[0]);
    // When a slide becomes active (script.js rotates every 5s), fetch the one after it
    slides.forEach(function (slide, i) {
        new MutationObserver(function () {
            if (slide.classList.contains('active')) { loadSlide(slide); loadSlide(slides[(i + 1) % slides.length]); }
        }).observe(slide, { attributes: true, attributeFilter: ['class'] });
    });
    window.addEventListener('load', function () { loadSlide(slides[1]); });

    // 2. Videos with data-src start when within ~one screen
    var videos = document.querySelectorAll('video[data-src]');
    function start(v) {
        if (!v.src) { v.src = v.dataset.src; }
        var play = v.play();
        if (play && play.catch) play.catch(function () { /* autoplay blocked: poster stays */ });
    }
    if ('IntersectionObserver' in window) {
        var io = new IntersectionObserver(function (entries) {
            entries.forEach(function (e) { if (e.isIntersecting) { start(e.target); io.unobserve(e.target); } });
        }, { rootMargin: '600px 0px' });
        videos.forEach(function (v) { io.observe(v); });
    } else {
        videos.forEach(start);
    }

    // 3. Floating Book Now (phones only)
    var btn = document.querySelector('.sticky-book-btn');
    var widget = document.getElementById('lodgify-booking-widget');
    if (!btn || !widget) return;
    var widgetVisible = false;
    function update() {
        btn.classList.toggle('is-visible', PHONE.matches && !widgetVisible);
    }
    if ('IntersectionObserver' in window) {
        new IntersectionObserver(function (entries) {
            widgetVisible = entries[0].isIntersecting;
            update();
        }).observe(widget);
    }
    PHONE.addEventListener ? PHONE.addEventListener('change', update) : PHONE.addListener(update);
    btn.addEventListener('click', function (e) {
        e.preventDefault();
        // script.js scrolls every #anchor to its section top; for this button we want the widget itself
        e.stopImmediatePropagation();
        widget.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
    update();
})();
