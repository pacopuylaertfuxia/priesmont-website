// Google Analytics 4 (GA4) Configuration
// Replace with your actual GA4 Measurement ID from Google Analytics
// Get your Measurement ID from: https://analytics.google.com/
// Format: G-XXXXXXXXXX

const GA4_MEASUREMENT_ID = 'G-XXXXXXXXXX'; // Replace with your actual Measurement ID

// Initialize Google Analytics 4
(function() {
    // Only initialize if Measurement ID is set
    if (!GA4_MEASUREMENT_ID || GA4_MEASUREMENT_ID === 'G-XXXXXXXXXX') {
        if (window.location.search.includes('debug_tracking=1')) {
            console.log('[GA4] Measurement ID not configured. Skipping initialization.');
        }
        return;
    }

    // Load Google Analytics script
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA4_MEASUREMENT_ID}`;
    document.head.appendChild(script);

    // Initialize gtag
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    window.gtag = gtag;
    gtag('js', new Date());
    gtag('config', GA4_MEASUREMENT_ID, {
        // Privacy-friendly settings
        anonymize_ip: true,
        allow_google_signals: false,
        allow_ad_personalization_signals: false
    });

    if (window.location.search.includes('debug_tracking=1')) {
        console.log('[GA4] Google Analytics initialized with ID:', GA4_MEASUREMENT_ID);
    }
})();

// Make GA4 available globally for custom tracking
if (typeof window !== 'undefined') {
    window.GA4_MEASUREMENT_ID = GA4_MEASUREMENT_ID;
}
