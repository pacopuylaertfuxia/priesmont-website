# Meta Pixel Events Not Showing in Events Manager - Troubleshooting

If Pixel Helper shows events but they don't appear in Events Manager, here's how to fix it:

## Step 1: Use Test Events (Real-Time Viewing)

Events Manager has a delay. Use Test Events for real-time viewing:

1. **Go to Events Manager:**
   - Visit: https://business.facebook.com/events_manager2
   - Select your Pixel: `2799036220300123`

2. **Open Test Events:**
   - Click "Test Events" in the left sidebar
   - Or go directly to: https://business.facebook.com/events_manager2/list/pixel/2799036220300123/test_events

3. **Enter Your Website URL:**
   - In the "Test Events" page, enter: `domainedepriesmont.netlify.app`
   - Click "Start Testing"

4. **Interact with Your Site:**
   - Keep the Test Events page open
   - In another tab, visit: https://domainedepriesmont.netlify.app
   - Interact with the site:
     - Scroll to gallery → Should see `ViewContent`
     - Click "Book Now" → Should see `InitiateCheckout`
     - Submit contact form → Should see `Lead`
   - Events should appear **in real-time** in the Test Events tab

## Step 2: Check Regular Events (Has Delay)

Regular events take 20-30 minutes to appear:

1. **Go to Events Manager:**
   - https://business.facebook.com/events_manager2
   - Select your Pixel

2. **Click "Overview" or "Events"**
   - Wait 20-30 minutes after visiting your site
   - Events should appear here (not immediately)

## Step 3: Verify Pixel Configuration

Check if pixel is properly initialized:

1. **Open browser console** (F12 or Right-click → Inspect → Console)
2. **Visit your site:** https://domainedepriesmont.netlify.app
3. **Look for errors:**
   - Should see: `fbq('init', '2799036220300123')`
   - Should NOT see any red errors

## Step 4: Check Pixel Status

1. **In Events Manager:**
   - Go to: https://business.facebook.com/events_manager2
   - Select your Pixel
   - Check "Overview" tab
   - Look for "Status" - should say "Active"

2. **Check if pixel is verified:**
   - Should show green checkmark
   - If not verified, you may need to verify domain

## Common Issues:

### Issue 1: Events Delayed
- **Solution:** Use Test Events for real-time viewing
- Regular events take 20-30 minutes

### Issue 2: Pixel Not Verified
- **Solution:** Verify your domain in Events Manager
- Settings → Domains → Add domain

### Issue 3: Ad Blockers
- **Solution:** Disable ad blockers when testing
- Some ad blockers block Facebook Pixel

### Issue 4: Wrong Pixel Selected
- **Solution:** Make sure you're looking at Pixel ID `2799036220300123`
- Check the Pixel ID in Events Manager matches

## Quick Test:

1. Open Test Events: https://business.facebook.com/events_manager2/list/pixel/2799036220300123/test_events
2. Enter: `domainedepriesmont.netlify.app`
3. Click "Start Testing"
4. Visit your site in another tab
5. Interact with site
6. Events should appear immediately in Test Events tab

---

**Most likely:** Events are there but delayed. Use Test Events for real-time viewing!

