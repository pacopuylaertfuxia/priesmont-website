# Lodgify Integration Setup Guide

This guide will help you connect your custom website to Lodgify's API and booking system, allowing you to leverage Lodgify's channel manager while maintaining your beautiful custom website.

## Why Integrate with Lodgify?

- ✅ **Channel Manager**: Sync bookings across Airbnb, Booking.com, VRBO, and more
- ✅ **Real-time Availability**: Calendar updates automatically across all platforms
- ✅ **Direct Bookings**: Accept bookings directly on your website
- ✅ **Payment Processing**: Secure payment handling through Lodgify
- ✅ **Guest Management**: All bookings managed in one place

## Step 1: Get Your Lodgify API Credentials

### API Key
1. Log in to your Lodgify account
2. Navigate to **Settings** → **Public API**
3. If you don't see an API key, contact Lodgify support to enable API access
4. Copy your **API Key**

### Account ID
1. Click on your profile icon (top right corner)
2. Your **Account ID** will be visible in the URL or profile settings
3. Copy your **Account ID**

### Website URL
1. In Lodgify, go to **Settings** → **Website**
2. Note your Lodgify website URL (e.g., `https://yourproperty.lodgify.com`)

## Step 2: Configure the Integration (Simplified)

The easiest way is to use Lodgify's direct booking page embed:

1. **Get Your Lodgify Website URL:**
   - Log in to Lodgify
   - Go to **Settings** → **Website**
   - Copy your Lodgify website URL (e.g., `https://priesmont.lodgify.com`)

2. **Update the Configuration:**
   - Open `lodgify-config.js`
   - Update the `websiteUrl`:

```javascript
const LODGIFY_CONFIG = {
    widgetSettings: {
        websiteUrl: 'https://priesmont.lodgify.com', // Your actual Lodgify URL
        theme: 'light', // 'light' or 'dark'
        language: 'en'
    }
};
```

**Note:** The API key and Account ID are optional for the basic booking widget. You only need them if you want to use the API for custom integrations.

## Step 3: Get Your Booking Widget Embed Code (Recommended Method)

Lodgify provides an embeddable booking widget that's easier to use than the API:

1. In Lodgify, go to **Settings** → **Booking Widget**
2. Click **Get Embed Code**
3. Copy the embed code
4. Replace the widget initialization in `index.html` (around line 340) with your embed code

**Alternative**: The integration script will automatically load the widget if you've configured the `websiteUrl` correctly.

## Step 4: Test the Integration

1. Open your website in a browser
2. Navigate to the "Book Now" section
3. You should see the Lodgify booking calendar
4. Test the booking flow to ensure everything works

## Step 5: Customize the Widget (Optional)

### Change Widget Theme
In `lodgify-config.js`, change:
```javascript
theme: 'dark' // or 'light'
```

### Change Language
```javascript
language: 'fr' // or 'de', 'es', etc.
```

### Customize Widget Appearance
You can add custom CSS in `styles.css` to style the Lodgify widget container:

```css
.lodgify-widget-container {
    /* Your custom styles */
}
```

## API Endpoints Available

The integration includes these API methods:

- `checkAvailability(checkIn, checkOut)` - Check if dates are available
- `getPropertyDetails()` - Get property information
- `getRates(checkIn, checkOut)` - Get pricing for dates
- `createBooking(bookingData)` - Create a booking (if API supports it)

## Troubleshooting

### Widget Not Loading
- Check that your `websiteUrl` in `lodgify-config.js` is correct
- Verify your Lodgify account is active
- Check browser console for errors

### API Errors
- Verify your API key is correct
- Ensure API access is enabled in your Lodgify account
- Check that your Account ID is correct

### CORS Issues
If you encounter CORS (Cross-Origin Resource Sharing) errors:
- Lodgify's API should handle CORS, but if issues persist, contact Lodgify support
- Consider using Lodgify's embeddable widget instead of direct API calls

## Security Notes

⚠️ **Important**: Never commit your API keys to version control!

1. Add `lodgify-config.js` to your `.gitignore` file
2. Consider using environment variables for production
3. Keep your API keys secure and don't share them publicly

## Next Steps

1. ✅ Configure your API credentials
2. ✅ Test the booking widget
3. ✅ Customize the appearance to match your website
4. ✅ Set up payment processing in Lodgify
5. ✅ Connect your channel manager accounts (Airbnb, Booking.com, etc.)

## Support

- **Lodgify Support**: support@lodgify.com
- **Lodgify API Docs**: https://www.lodgify.com/partners/
- **Lodgify Help Center**: https://help.lodgify.com/

## Additional Features

Once integrated, you can:
- Display real-time availability on your website
- Show dynamic pricing
- Sync bookings across all channels
- Manage guest communications
- Process payments securely

Your custom website now has all the power of Lodgify's booking system while maintaining your unique design! 🎉


