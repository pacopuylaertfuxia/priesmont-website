# Meta Pixel Tracking Implementation

## Overview

Clean, high-quality Meta Pixel tracking layer with deduplication and event_id support for Conversions API (CAPI) integration.

## Features

✅ **High Signal Quality** - No scroll-based "fake intent" tracking  
✅ **One Action = One Event** - SessionStorage-based deduplication  
✅ **Event ID Generation** - UUID v4 for Pixel + CAPI deduplication  
✅ **Debug Mode** - Add `?debug_tracking=1` to URL for console logging  
✅ **Two Funnels** - Separate tracking for Booking vs Inquiry  

## Files

- `tracking/metaTracking.js` - Core tracking layer with deduplication
- `tracking/domHooks.js` - DOM event wiring for user interactions

## Events Implemented

### Booking Funnel

1. **InitiateCheckout** - Fires ONCE per session when:
   - User clicks "Book Now" / "Book Your Stay" buttons
   - User interacts with Lodgify widget (date/guest selection)
   - User lands on Lodgify checkout URL

### Inquiry Funnel

1. **ViewContent** (optional) - Fires ONCE when:
   - User clicks "Contact" navigation link

2. **Lead** - Fires ONCE per session when:
   - User successfully submits contact form

### Parameters

**InitiateCheckout:**
```javascript
{
    content_name: 'Priesmont Manor Booking',
    content_category: 'Booking',
    currency: 'EUR',
    event_source_url: current_url,
    eventID: uuid_v4 // for deduplication
}
```

**Lead:**
```javascript
{
    content_name: 'Contact Form',
    content_category: 'contact_form_submission',
    event_source_url: current_url,
    content_type: 'booking_inquiry' | 'general_inquiry', // based on form data
    has_dates: true | false,
    check_in: 'YYYY-MM-DD', // if present
    guests: number, // if present
    eventID: uuid_v4 // for deduplication
}
```

## Usage

### Manual Tracking (if needed)

```javascript
// InitiateCheckout
window.MetaTracking.trackInitiateCheckout('button_click', { button_text: 'Book Now' });

// Lead
window.MetaTracking.trackLead('contact_form_submission', { 
    check_in: '2024-06-15',
    guests: 4 
});

// ViewContent
window.MetaTracking.trackViewContent('contact_nav', { content_category: 'Inquiry' });
```

### Debug Mode

Add `?debug_tracking=1` to URL to see all events in console:
- Event fired
- Parameters
- Event ID
- Deduplication status

### Check if Event Fired

```javascript
window.MetaTracking.hasFired('InitiateCheckout'); // returns boolean
window.MetaTracking.hasFired('Lead');
window.MetaTracking.hasFired('ViewContent');
```

## Conversions API (CAPI) Integration

The tracking layer is structured to support CAPI. To implement:

1. Create API endpoint (e.g., `/api/meta-events`)
2. Uncomment CAPI calls in `metaTracking.js`:
   ```javascript
   // sendToCAPI('InitiateCheckout', params, eventId);
   ```
3. Send same event with same event_id to Meta Conversions API
4. Meta will automatically deduplicate based on event_id

## Lodgify Widget Detection

The implementation attempts multiple methods to detect Lodgify interactions:

1. **postMessage events** - Listens for messages from Lodgify iframe
2. **Click detection** - Detects clicks on widget container and inputs
3. **URL detection** - Checks if user navigated to Lodgify checkout URL

## Removed Tracking

❌ Scroll-based InitiateCheckout (booking section intersection)  
❌ Scroll-based Lead (contact section intersection)  
❌ Field focus tracking (form field focus)  
❌ Gallery view tracking  
❌ Automatic ViewContent on page load  

## Testing

1. Open site with `?debug_tracking=1`
2. Check console for tracking events
3. Click "Book Now" → Should see InitiateCheckout (once)
4. Click "Contact" → Should see ViewContent (once)
5. Submit contact form → Should see Lead (once)
6. Interact with Lodgify widget → Should see InitiateCheckout (if not already fired)

## Meta Pixel Helper

Install [Meta Pixel Helper](https://chrome.google.com/webstore/detail/facebook-pixel-helper/fdgfkebogiimcoedlicjlajpkdmockpc) to verify events in browser.

Expected behavior:
- ✅ PageView on load
- ✅ InitiateCheckout on booking intent (once per session)
- ✅ ViewContent on contact nav click (once)
- ✅ Lead on form submission (once per session)
- ❌ NO events on scroll
- ❌ NO events on field focus
