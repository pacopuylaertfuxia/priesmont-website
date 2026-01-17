# Rating Auto-Update Setup Guide

This guide explains how to set up automatic rating fetching from all booking platforms.

## Overview

The system automatically fetches ratings from:
- Google Reviews
- TripAdvisor
- Booking.com
- Airbnb
- Hotels.com
- Expedia

And updates the average rating displayed in the hero section weekly via cron job.

## How It Works

1. **Weekly Cron Job**: Runs every Monday at 2 AM (via Vercel Cron)
2. **Rating Scraper**: `/api/fetch-ratings.js` fetches ratings from all platforms
3. **Rating Cache**: `/api/ratings.js` serves cached ratings to the frontend
4. **Frontend Update**: `script.js` fetches and displays the rating on page load

## Setup Instructions

### 1. Deploy to Vercel

Make sure your site is deployed on Vercel (the cron jobs only work on Vercel).

### 2. Set Up Environment Variables (Optional)

For platforms that are difficult to scrape, you can set manual fallback ratings in Vercel environment variables:

- `GOOGLE_RATING` - Google Reviews rating (e.g., `4.8`)
- `TRIPADVISOR_RATING` - TripAdvisor rating (e.g., `4.9`)
- `BOOKING_RATING` - Booking.com rating (e.g., `5.0`)
- `AIRBNB_RATING` - Airbnb rating (e.g., `4.7`)
- `HOTELS_RATING` - Hotels.com rating (e.g., `4.8`)
- `EXPEDIA_RATING` - Expedia rating (e.g., `4.6`)

**To set in Vercel:**
1. Go to your project dashboard
2. Settings → Environment Variables
3. Add each variable with its value

### 3. Set Up Authentication (Recommended)

For security, set a token to protect the fetch endpoint:

- `RATING_FETCH_TOKEN` - Secret token for API authentication

### 4. Set Up Vercel KV (Optional but Recommended)

For caching ratings, set up Vercel KV:

1. Install Vercel KV: `vercel kv create`
2. Link to your project: `vercel kv link`
3. Environment variables will be automatically set:
   - `KV_REST_API_URL`
   - `KV_REST_API_TOKEN`

### 5. Configure Cron Job

The cron job is configured in `vercel.json`:

```json
{
  "crons": [
    {
      "path": "/api/fetch-ratings",
      "schedule": "0 2 * * 1"
    }
  ]
}
```

This runs every Monday at 2 AM UTC.

**To change schedule:**
- Edit the `schedule` field in `vercel.json`
- Use cron syntax: `minute hour day month weekday`
- Example: `0 2 * * 1` = Monday 2 AM
- Example: `0 0 * * 0` = Sunday midnight

### 6. Test the Setup

1. **Test API endpoint:**
   ```bash
   curl https://your-domain.com/api/ratings
   ```

2. **Manually trigger update:**
   ```bash
   curl -X POST https://your-domain.com/api/fetch-ratings
   ```

3. **Check Vercel logs:**
   - Go to Vercel dashboard → Your project → Logs
   - Check for any errors in rating fetching

## How Scraping Works

The scraper tries multiple methods:

1. **Web Scraping**: Extracts ratings from HTML using regex patterns
2. **Structured Data**: Looks for JSON-LD or data attributes
3. **Environment Variables**: Falls back to manual values if scraping fails

### Platform-Specific Notes

- **Google Reviews**: Requires Google Places API or manual entry (scraping often blocked)
- **TripAdvisor**: Extracts from HTML or structured data
- **Booking.com**: Looks for rating badges or structured data
- **Airbnb**: Extracts from embedded JSON data
- **Hotels.com**: Standard HTML scraping
- **Expedia**: Standard HTML scraping

## Troubleshooting

### Ratings Not Updating

1. Check Vercel logs for errors
2. Verify cron job is enabled in Vercel dashboard
3. Test the `/api/fetch-ratings` endpoint manually
4. Check environment variables are set correctly

### Scraping Fails

Many platforms block automated scraping. If scraping fails:

1. Use environment variables as fallback
2. Update ratings manually in Vercel environment variables
3. Set up official API access where available (e.g., Google Places API)

### Rating Not Displaying on Frontend

1. Check browser console for errors
2. Verify `/api/ratings` endpoint is accessible
3. Check CORS settings if accessing from different domain
4. Verify rating element exists in HTML

## Manual Rating Entry

If scraping doesn't work for a platform, you can:

1. Set the rating in Vercel environment variables
2. The system will use these values automatically
3. Update them manually when ratings change

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
