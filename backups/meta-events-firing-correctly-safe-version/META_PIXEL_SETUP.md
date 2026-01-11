# Meta Pixel Setup Guide

This guide will help you set up Meta Pixel (Facebook Pixel) tracking on your Priesmont website.

## Step 1: Get Your Pixel ID

1. Go to [Facebook Events Manager](https://business.facebook.com/events_manager2)
2. Select your existing pixel (the one tracking your old website)
3. Copy your **Pixel ID** (it's a 15-16 digit number)

## Step 2: Configure the Pixel

1. Open `meta-pixel-config.js`
2. Replace `YOUR_PIXEL_ID_HERE` with your actual Pixel ID:

```javascript
const META_PIXEL_ID = '1234567890123456'; // Your actual Pixel ID
```

## Step 3: Verify Installation

1. Open your website in a browser
2. Install the [Facebook Pixel Helper Chrome Extension](https://chrome.google.com/webstore/detail/facebook-pixel-helper/fdgfkebogiimcoedlicjlajpkdmockpc)
3. Visit your website and check that the extension shows:
   - ✅ Pixel ID matches your ID
   - ✅ PageView event fires
   - ✅ ViewContent event fires

## Events Tracked

The website automatically tracks these events:

### Automatic Events

1. **PageView** - Fires on every page load
2. **ViewContent** - Fires when user views property content

### User Interaction Events

3. **InitiateCheckout** - Fires when:
   - User clicks "Book Your Stay" button
   - User scrolls to booking section
   - User navigates to booking section

4. **Lead** - Fires when:
   - User submits the contact/booking form

5. **CompleteRegistration** - Fires when:
   - User submits form with check-in date (indicates booking intent)

6. **ViewContent (Gallery)** - Fires when:
   - User scrolls to gallery section

### Custom Events Available

You can also manually trigger these events:

```javascript
// Track a search
window.metaPixelTracker.trackSearch('Date Search');

// Track schedule/viewing
window.metaPixelTracker.trackSchedule();

// Track add to wishlist
window.metaPixelTracker.trackAddToWishlist();

// Track custom event
window.metaPixelTracker.trackCustomEvent('CustomEventName', {
    custom_parameter: 'value'
});
```

## Testing Events

### Test in Facebook Events Manager

1. Go to Events Manager → Test Events
2. Enter your website URL
3. Interact with your website:
   - Click "Book Your Stay"
   - Submit the contact form
   - Scroll to gallery
4. Verify events appear in real-time

### Test with Pixel Helper

1. Install Facebook Pixel Helper
2. Visit your website
3. Check the extension popup for:
   - Pixel ID confirmation
   - Events being fired
   - Any errors

## Event Parameters

Events include useful parameters:

- **ViewContent**: content_name, content_category, content_type
- **InitiateCheckout**: content_name, content_category, currency
- **Lead**: content_name, content_category
- **CompleteRegistration**: content_name, status, method

## Troubleshooting

### Pixel Not Loading

- Check that `META_PIXEL_ID` is set correctly
- Verify no ad blockers are interfering
- Check browser console for errors

### Events Not Firing

- Ensure `meta-pixel-events.js` is loaded
- Check that `window.metaPixelTracker` exists
- Verify pixel is initialized before events fire

### Events Not Showing in Events Manager

- Wait 20-30 minutes for events to appear
- Check Test Events tab for real-time verification
- Verify pixel ID matches in Events Manager

## Next Steps

1. ✅ Add your Pixel ID to `meta-pixel-config.js`
2. ✅ Test events using Pixel Helper
3. ✅ Verify events in Events Manager
4. ✅ Set up custom conversions in Facebook Ads Manager
5. ✅ Create retargeting audiences based on events

## Custom Conversions Setup

In Facebook Ads Manager, you can create custom conversions for:

- **Lead Generation**: Track `Lead` events
- **Booking Intent**: Track `InitiateCheckout` events
- **Property Views**: Track `ViewContent` events
- **Completed Bookings**: Track `CompleteRegistration` events

## Privacy & GDPR

Make sure to:
- Add cookie consent banner if required
- Update your privacy policy
- Comply with GDPR/CCPA regulations
- Consider using Facebook's Consent Mode if needed

## Support

- [Meta Pixel Documentation](https://www.facebook.com/business/help/952192354843755)
- [Events Manager Help](https://www.facebook.com/business/help/898752960903806)
- [Pixel Helper Guide](https://www.facebook.com/business/help/675615482516035)


