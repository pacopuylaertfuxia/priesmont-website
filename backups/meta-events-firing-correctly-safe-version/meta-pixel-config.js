// Meta Pixel Configuration
// Replace with your actual Meta Pixel ID from Facebook Events Manager
// Get your Pixel ID from: https://business.facebook.com/events_manager2

const META_PIXEL_ID = '2799036220300123';

// Make pixel ID available globally
if (typeof window !== 'undefined') {
    window.META_PIXEL_ID = META_PIXEL_ID;
}

// Initialize Meta Pixel
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');

// Initialize pixel once fbq is available (Facebook script loads asynchronously)
function initPixel() {
    if (typeof fbq !== 'undefined' && META_PIXEL_ID && META_PIXEL_ID !== 'YOUR_PIXEL_ID_HERE') {
        try {
            fbq('init', META_PIXEL_ID);
            fbq('track', 'PageView');
            if (window.location.search.includes('debug_tracking=1')) {
                console.log('[MetaPixel] Pixel initialized with ID:', META_PIXEL_ID);
            }
        } catch (e) {
            console.error('[MetaPixel] Error initializing pixel:', e);
        }
    } else if (typeof fbq === 'undefined') {
        // fbq not loaded yet, wait a bit and try again
        setTimeout(initPixel, 50);
    }
}

// Start initialization
initPixel();

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { META_PIXEL_ID };
}

