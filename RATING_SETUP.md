# Rating System Setup Guide

This guide explains how to set up the rating system using environment variables.

## Overview

The system reads ratings from environment variables and calculates the average automatically.
**No scraping - just simple lookup and calculation.**

Supported platforms:
- Google Reviews (environment variable or Google Places API)
- TripAdvisor (environment variable)
- Booking.com (environment variable)
- Airbnb (environment variable)
- Hotels.com (environment variable)
- Expedia (environment variable)

## How It Works

1. **Rating Storage**: All ratings stored in Vercel environment variables
2. **Rating Calculation**: `/api/fetch-ratings.js` reads values and calculates average
3. **Rating Cache**: `/api/ratings.js` serves ratings to the frontend
4. **Frontend Display**: `script.js` fetches and displays the rating on page load
5. **Weekly Update**: Optional cron job - but you'll still need to update env vars manually

**Note:** The cron job doesn't automatically fetch ratings - you need to update the environment variables yourself. The cron job just triggers recalculation.

## Setup Instructions

### 1. Deploy to Vercel

Make sure your site is deployed on Vercel.

### 2. Set Up Environment Variables (REQUIRED)

For platforms that are difficult to scrape, you can set manual fallback ratings in Vercel environment variables:

- `GOOGLE_RATING` - Google Reviews rating (e.g., `4.8`)
- `TRIPADVISOR_RATING` - TripAdvisor rating (e.g., `4.9`)
- `BOOKING_RATING` - Booking.com rating (e.g., `5.0`)
- `AIRBNB_RATING` - Airbnb rating (e.g., `4.7`)
- `HOTELS_RATING` - Hotels.com rating (e.g., `4.8`)
- `EXPEDIA_RATING` - Expedia rating (e.g., `4.6`)

**To set in Vercel:**
1. Go to your project dashboard: https://vercel.com/dashboard
2. Select your project (priesmont)
3. Go to **Settings** → **Environment Variables**
4. Add each variable with its value (click "Add New" for each one)
5. Make sure to select **Production**, **Preview**, and **Development** environments
6. Click "Save" after adding each variable

**Example values:**
- `GOOGLE_RATING` = `4.8`
- `TRIPADVISOR_RATING` = `4.9`
- `BOOKING_RATING` = `5.0`
- `AIRBNB_RATING` = `4.7`
- `HOTELS_RATING` = `4.8`
- `EXPEDIA_RATING` = `4.6`

**After adding variables:**
- Redeploy your site for changes to take effect
- Go to **Deployments** → Click the three dots on latest deployment → **Redeploy**

### 3. (Optional) Google Places API Setup

If you want to automatically fetch Google Reviews rating:

1. Go to Google Cloud Console: https://console.cloud.google.com
2. Create a project or select existing one
3. Enable "Places API"
4. Create an API key
5. Find your Place ID: https://developers.google.com/maps/documentation/places/web-service/place-id
6. Add to Vercel environment variables:
   - `GOOGLE_PLACES_API_KEY` = your API key
   - `GOOGLE_PLACE_ID` = your Place ID

**Note:** Google Places API has usage costs. Check pricing before enabling.

### 4. Test the Setup

1. **Test API endpoint:**
   ```
   https://your-domain.com/api/ratings
   ```
   You should see JSON with your ratings and average.

2. **Check Vercel logs:**
   - Go to Vercel dashboard → Your project → Logs
   - Visit the `/api/ratings` endpoint to trigger logs

### 5. (Optional) Configure Cron Job

The cron job is already configured in `vercel.json` to run weekly:
- Runs every Monday at 2 AM UTC
- Just recalculates the average (doesn't fetch new ratings)

**To disable cron job:**
- Remove the `crons` section from `vercel.json`
- Or leave it - it's harmless and just recalculates

## How It Works

The system:
1. ✅ Reads ratings from environment variables
2. ✅ Calculates average automatically
3. ✅ Serves to frontend via `/api/ratings`
4. ✅ Updates weekly via cron (just recalculation)

**No scraping - completely legal and reliable!**

## Updating Ratings

To update ratings:
1. Log into Vercel dashboard
2. Go to your project → Settings → Environment Variables
3. Update the rating values (e.g., change `TRIPADVISOR_RATING` from `4.9` to `5.0`)
4. Redeploy your site for changes to take effect
5. The average will automatically recalculate

## Troubleshooting

### Ratings Not Showing

1. Check environment variables are set correctly in Vercel
2. Visit `/api/ratings` endpoint to see what's being calculated
3. Check browser console for errors
4. Make sure you redeployed after adding environment variables

### Wrong Average Calculation

1. Check all rating values in environment variables
2. Make sure they're numeric (e.g., `4.8` not `"4.8"` or `4.8 stars`)
3. Visit `/api/ratings` to see the calculation breakdown

### Rating Not Displaying on Frontend

1. Check browser console for errors
2. Verify `/api/ratings` endpoint is accessible
3. Check network tab to see if API call is succeeding

## API Endpoints

### GET `/api/ratings`

Returns the current average rating and platform breakdown.

**Response:**
```json
{
  "success": true,
  "timestamp": "2024-01-15T10:00:00.000Z",
  "platformRatings": {
    "google": 4.8,
    "tripadvisor": 4.9,
    "booking": 5.0,
    "airbnb": 4.7,
    "hotels": 4.8,
    "expedia": 4.6
  },
  "averageRating": 4.8,
  "platformsCount": 6
}
```

### GET/POST `/api/fetch-ratings`

Fetches fresh ratings from all platforms (called by cron job).

**Response:** Same as `/api/ratings`

**Note:** Requires authentication token if `RATING_FETCH_TOKEN` is set.

## Support

For issues or questions:
1. Check Vercel logs
2. Test API endpoints manually
3. Verify environment variables
4. Review platform-specific scraping notes above
