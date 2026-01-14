# Google Analytics 4 (GA4) Setup Guide

This guide will help you set up Google Analytics 4 on your Priesmont website.

## Current Setup

✅ **Meta Pixel** - Already configured and tracking  
🆕 **Google Analytics 4** - Ready to configure

## Step 1: Create a Google Analytics Account

1. Go to [Google Analytics](https://analytics.google.com/)
2. Sign in with your Google account
3. Click **"Start measuring"** or **"Admin"** → **"Create Account"**
4. Fill in:
   - **Account name:** Priesmont (or your preferred name)
   - **Property name:** Priesmont Website
   - **Reporting time zone:** Europe/Brussels (or your timezone)
   - **Currency:** EUR
5. Click **"Next"** and fill in business information
6. Click **"Create"**

## Step 2: Get Your Measurement ID

1. After creating the property, you'll see **"Data Streams"**
2. Click **"Add stream"** → **"Web"**
3. Fill in:
   - **Website URL:** `https://www.domainedepriesmont.com` (or your domain)
   - **Stream name:** Priesmont Website
4. Click **"Create stream"**
5. You'll see your **Measurement ID** (format: `G-XXXXXXXXXX`)
6. **Copy this ID** - you'll need it in the next step

## Step 3: Configure the Website

1. Open `google-analytics-config.js` in your project
2. Replace `G-XXXXXXXXXX` with your actual Measurement ID:

```javascript
const GA4_MEASUREMENT_ID = 'G-1234567890'; // Your actual ID
```

3. Save the file

## Step 4: Deploy and Test

1. Deploy your updated website
2. Visit your website
3. Open browser console and add `?debug_tracking=1` to URL
4. You should see: `[GA4] Google Analytics initialized with ID: G-XXXXXXXXXX`

## Step 5: Verify in Google Analytics

1. Go to [Google Analytics](https://analytics.google.com/)
2. Select your property
3. Go to **Reports** → **Realtime**
4. Visit your website
5. You should see yourself as an active user within 30 seconds

## What Gets Tracked

The website automatically tracks these events to **both Meta Pixel and GA4**:

### Automatic Events
- ✅ **PageView** - Every page load
- ✅ **ViewContent** - When users view property content
- ✅ **InitiateCheckout** - When users interact with booking widget
- ✅ **Lead** - When users submit contact form
- ✅ **CompleteRegistration** - When booking is completed

### Event Mapping

| Meta Pixel Event | GA4 Event | Description |
|-----------------|-----------|-------------|
| PageView | page_view | Page loads |
| ViewContent | view_item | Content viewed |
| InitiateCheckout | begin_checkout | Booking started |
| Lead | generate_lead | Form submitted |
| CompleteRegistration | sign_up | Booking completed |

## Benefits of Having Both

### Meta Pixel
- ✅ Facebook/Instagram ad optimization
- ✅ Audience building for retargeting
- ✅ Conversion tracking for Meta ads
- ✅ Lookalike audiences

### Google Analytics 4
- ✅ Comprehensive website analytics
- ✅ User behavior insights
- ✅ Traffic source analysis
- ✅ Conversion funnels
- ✅ Google Ads integration
- ✅ Free unlimited data retention
- ✅ Advanced reporting

## Testing

### Debug Mode
Add `?debug_tracking=1` to your URL to see tracking events in console:
```
https://www.domainedepriesmont.com/?debug_tracking=1
```

### Verify Events
1. Open browser console (F12)
2. Look for `[GA4]` logs
3. Check Google Analytics Realtime reports

## Privacy Settings

The GA4 configuration includes privacy-friendly settings:
- ✅ IP anonymization enabled
- ✅ Google signals disabled (for GDPR compliance)
- ✅ Ad personalization disabled

## Troubleshooting

### Events not showing in GA4?

1. **Check Measurement ID:**
   - Open `google-analytics-config.js`
   - Verify ID starts with `G-` and is correct

2. **Check Console:**
   - Add `?debug_tracking=1` to URL
   - Look for `[GA4]` messages in console

3. **Check GA4 Realtime:**
   - Go to GA4 → Reports → Realtime
   - Visit your site
   - Should see activity within 30 seconds

4. **Ad Blockers:**
   - Some ad blockers block GA4
   - Test in incognito mode or disable ad blocker

### Still not working?

1. Check browser console for errors
2. Verify `google-analytics-config.js` is loaded in `<head>`
3. Verify `tracking/ga4Tracking.js` is loaded before `tracking/domHooks.js`
4. Check network tab for requests to `googletagmanager.com`

## Next Steps

Once GA4 is working:
1. ✅ Set up conversion goals in GA4
2. ✅ Create custom reports for booking funnel
3. ✅ Set up Google Ads integration (if using Google Ads)
4. ✅ Configure audience segments
5. ✅ Set up email reports

## Support

For issues:
- Check [GA4 Documentation](https://support.google.com/analytics/answer/10089681)
- Use debug mode: `?debug_tracking=1`
- Check browser console for errors
