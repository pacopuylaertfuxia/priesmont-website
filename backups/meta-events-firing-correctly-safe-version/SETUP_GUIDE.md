# Complete Setup Guide: Lodgify + Meta Pixel

Follow these steps in order to properly set up your booking funnel tracking.

## Part 1: Connect Lodgify (Do This First)

### Step 1: Get Your Lodgify Website URL

1. Log in to your Lodgify account
2. Go to **Settings** → **Website**
3. Copy your Lodgify website URL
   - Example: `https://priesmont.lodgify.com`
   - Or: `https://yourproperty.lodgify.com`

### Step 2: Configure Lodgify

1. Open `lodgify-config.js`
2. Update the `websiteUrl`:

```javascript
const LODGIFY_CONFIG = {
    widgetSettings: {
        websiteUrl: 'https://priesmont.lodgify.com', // ← Your actual URL here
        theme: 'light',
        language: 'en'
    }
};
```

3. Save the file and refresh your website
4. The booking widget should now load!

### Step 3: Test Lodgify Integration

1. Visit your website
2. Navigate to the "Book Now" section
3. You should see the Lodgify booking calendar
4. Test selecting dates to ensure it works

**✅ Lodgify is now connected!**

---

## Part 2: Map Your Booking Funnel

Before setting up Meta Pixel events, let's understand your booking flow:

### Booking Funnel Stages

```
1. Awareness → 2. Interest → 3. Consideration → 4. Intent → 5. Engagement → 6. Lead → 7. Conversion
```

**Stage 1: Awareness**
- User lands on homepage
- Views property overview

**Stage 2: Interest**
- Scrolls through gallery
- Views features/amenities

**Stage 3: Consideration**
- Checks location
- Views distances

**Stage 4: Intent**
- Clicks "Book Now"
- Navigates to booking section

**Stage 5: Engagement (Lodgify)**
- Views booking calendar
- Selects dates
- Selects number of guests
- Starts filling booking form

**Stage 6: Lead**
- Submits inquiry form
- Or starts booking process

**Stage 7: Conversion**
- Completes booking through Lodgify
- Payment processed

---

## Part 3: Set Up Meta Pixel Events

Now that we understand the funnel, let's map Meta Pixel events:

### Current Events (Already Set Up)

✅ **PageView** - Automatic on page load
✅ **ViewContent** - When viewing property/gallery/features
✅ **InitiateCheckout** - When clicking "Book Now" or viewing booking section
✅ **Lead** - When submitting contact form
✅ **CompleteRegistration** - When form includes check-in date

### Events We Need to Add for Lodgify

Since bookings happen in Lodgify's iframe, we need to track:

1. **Widget Loaded** - When booking widget becomes visible
2. **Date Selected** - When user selects check-in/check-out dates
3. **Guest Selected** - When user selects number of guests
4. **Form Started** - When user starts filling booking form
5. **Payment Started** - When user reaches payment step
6. **Booking Completed** - When booking is confirmed

### How to Track Lodgify Events

Lodgify's iframe makes tracking tricky. Options:

**Option A: PostMessage API (Recommended)**
- Lodgify can send events via postMessage
- We listen for these events and fire Meta Pixel events

**Option B: URL Parameters**
- Track when user returns from Lodgify with booking confirmation
- Check URL for booking parameters

**Option C: Webhook Integration**
- Set up Lodgify webhook to notify when booking is made
- Fire Meta Pixel event server-side

---

## Part 4: Configure Meta Pixel

### Step 1: Add Your Pixel ID

1. Open `meta-pixel-config.js`
2. Replace `YOUR_PIXEL_ID_HERE` with your actual Pixel ID
3. Get Pixel ID from: [Facebook Events Manager](https://business.facebook.com/events_manager2)

### Step 2: Test Events

1. Install [Facebook Pixel Helper](https://chrome.google.com/webstore/detail/facebook-pixel-helper/fdgfkebogiimcoedlicjlajpkdmockpc)
2. Visit your website
3. Interact with the site:
   - Click "Book Now"
   - Submit contact form
   - Scroll to gallery
4. Check Pixel Helper to see events firing

### Step 3: Verify in Events Manager

1. Go to Events Manager → Test Events
2. Enter your website URL
3. Interact with your site
4. See events appear in real-time

---

## Part 5: Optimize Events for Your Funnel

Once Lodgify is working, we'll add these events:

### High Priority Events

1. **InitiateCheckout** ✅ (Already tracking)
   - When: User clicks "Book Now" or views booking section
   - Use for: Retargeting campaigns

2. **Lead** ✅ (Already tracking)
   - When: User submits contact form
   - Use for: Lead generation campaigns

3. **CompleteRegistration** ⏳ (Needs Lodgify integration)
   - When: Booking completed in Lodgify
   - Use for: Conversion tracking

### Medium Priority Events

4. **Search** ⏳ (To add)
   - When: User selects dates in Lodgify calendar
   - Use for: Intent-based targeting

5. **ViewContent** ✅ (Already tracking)
   - When: User views gallery/features
   - Use for: Awareness campaigns

### Custom Events to Add

6. **BookingStarted** ⏳
   - When: User starts filling booking form in Lodgify
   - Custom event for funnel tracking

7. **PaymentStarted** ⏳
   - When: User reaches payment step
   - Custom event for conversion optimization

---

## Next Steps

1. ✅ **First:** Set up Lodgify (just add website URL)
2. ⏳ **Then:** Test the booking flow end-to-end
3. ⏳ **Next:** Add Meta Pixel ID
4. ⏳ **Finally:** Add Lodgify-specific event tracking

Once Lodgify is working, we can add the advanced event tracking for the complete booking funnel!


