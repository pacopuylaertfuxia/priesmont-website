# Meta Pixel Not Firing - Troubleshooting Guide

## Quick Checks

### 1. Check Browser Console
Open browser DevTools (F12) and check for errors. Look for:
- Script loading errors (404, CORS, etc.)
- `fbq is not defined` errors
- Any JavaScript errors

### 2. Verify Script Loading Order
Scripts must load in this order:
1. `meta-pixel-config.js` (in `<head>`)
2. `tracking/metaTracking.js` (in `<body>`)
3. `tracking/domHooks.js` (in `<body>`)

### 3. Test with Debug Mode
Add `?debug_tracking=1` to your URL:
```
http://localhost:8000/?debug_tracking=1
```

This will show detailed console logs for all tracking events.

### 4. Check Pixel Initialization
In browser console, run:
```javascript
console.log('fbq:', typeof fbq !== 'undefined' ? 'Available' : 'NOT AVAILABLE');
console.log('META_PIXEL_ID:', window.META_PIXEL_ID);
console.log('MetaTracking:', window.MetaTracking ? 'Available' : 'NOT AVAILABLE');
```

### 5. Test Pixel Directly
Try calling pixel directly:
```javascript
fbq('track', 'PageView');
```

If this doesn't work, the pixel isn't initialized.

## Common Issues

### Issue 1: Scripts Not Loading (404 Errors)
**Symptom:** Console shows 404 for tracking scripts

**Fix:** 
- Check file paths are correct
- If using local server, ensure `tracking/` folder exists
- Verify script paths in `index.html` match actual file structure

### Issue 2: Pixel Never Initializes
**Symptom:** `fbq is not defined` in console

**Possible Causes:**
1. **File:// protocol** - Meta Pixel requires HTTP/HTTPS
   - Fix: Use a local server: `python3 -m http.server 8000`
   
2. **Blocked by ad blocker** - Ad blockers block Facebook scripts
   - Fix: Disable ad blocker for localhost
   
3. **Network issue** - Can't load Facebook's script
   - Fix: Check internet connection, check firewall

4. **Timing issue** - Scripts load in wrong order
   - Fix: Already handled in code, but verify `meta-pixel-config.js` is in `<head>`

### Issue 3: Events Not Firing
**Symptom:** Pixel loads but events don't fire

**Check:**
1. Is deduplication preventing events?
   ```javascript
   // Clear session storage
   sessionStorage.clear();
   ```

2. Are event hooks attached?
   ```javascript
   // Check if buttons exist
   document.querySelectorAll('a[href="#booking"]').length
   ```

3. Test manually:
   ```javascript
   window.MetaTracking.trackInitiateCheckout('manual_test');
   ```

### Issue 4: Local Testing Issues
**Symptom:** Works on production but not locally

**Common Causes:**
- **Ad blockers** - Most common issue
- **HTTPS required** - Some browsers block mixed content
- **Localhost not whitelisted** - Facebook may require domain verification

**Fix:**
- Disable ad blocker
- Use `127.0.0.1` instead of `localhost`
- Test in incognito mode (no extensions)

## Step-by-Step Debugging

### Step 1: Verify Pixel Script Loads
1. Open DevTools → Network tab
2. Reload page
3. Look for `fbevents.js` request
4. Should see 200 status, not blocked

### Step 2: Verify Pixel Initializes
1. Open DevTools → Console
2. Type: `typeof fbq`
3. Should return: `"function"`
4. If returns: `"undefined"`, pixel script didn't load

### Step 3: Verify Tracking Layer Loads
1. In console, type: `window.MetaTracking`
2. Should see object with methods
3. If `undefined`, check script loading errors

### Step 4: Test Event Firing
1. Add `?debug_tracking=1` to URL
2. Click "Book Now" button
3. Check console for `[MetaTracking]` logs
4. Should see event fired with parameters

### Step 5: Verify with Meta Pixel Helper
1. Install [Meta Pixel Helper](https://chrome.google.com/webstore/detail/facebook-pixel-helper/fdgfkebogiimcoedlicjlajpkdmockpc)
2. Open your site
3. Extension should show:
   - ✅ Pixel ID: `2799036220300123`
   - ✅ PageView event
   - ✅ Other events when triggered

## Quick Test Script

Add this to your page temporarily to test:

```html
<script>
// Wait for everything to load
window.addEventListener('load', function() {
    setTimeout(function() {
        console.log('=== Pixel Status ===');
        console.log('fbq:', typeof fbq !== 'undefined' ? '✅' : '❌');
        console.log('PIXEL_ID:', window.META_PIXEL_ID || '❌ Missing');
        console.log('MetaTracking:', window.MetaTracking ? '✅' : '❌');
        
        if (window.MetaTracking) {
            console.log('Testing InitiateCheckout...');
            window.MetaTracking.trackInitiateCheckout('debug_test');
        }
    }, 2000);
});
</script>
```

## Expected Console Output (with debug_tracking=1)

```
[MetaPixel] Pixel initialized with ID: 2799036220300123
[MetaTracking] Initialized { pixel_id: "2799036220300123", pixel_ready: true, fbq_available: true, debug_mode: true }
[MetaTracking DOM] Initialized DOM hooks...
[MetaTracking DOM] Initialized booking button hooks: 2
[MetaTracking] InitiateCheckout { params: {...}, event_id: "...", deduped: false }
```

## Still Not Working?

1. **Check if old tracking code is interfering**
   - Search for `metaPixelTracker` in codebase
   - Make sure no duplicate tracking calls

2. **Verify file structure:**
   ```
   /tracking/
     ├── metaTracking.js
     ├── domHooks.js
     └── README.md
   ```

3. **Check for JavaScript errors**
   - Any error can stop script execution
   - Fix errors first, then test pixel again

4. **Test with minimal page**
   - Use `tracking/test.html` to isolate issues
