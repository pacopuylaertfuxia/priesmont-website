// Meta Pixel Configuration - EXAMPLE FILE
// Copy this file to meta-pixel-config.js and add your actual Pixel ID
// ⚠️ Never commit meta-pixel-config.js to version control!

// Get your Pixel ID from: https://business.facebook.com/events_manager2
const META_PIXEL_ID = 'YOUR_PIXEL_ID_HERE';

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

if (META_PIXEL_ID && META_PIXEL_ID !== 'YOUR_PIXEL_ID_HERE') {
    fbq('init', META_PIXEL_ID);
    fbq('track', 'PageView');
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { META_PIXEL_ID };
}


