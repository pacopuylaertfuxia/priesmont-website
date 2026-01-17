/**
 * Rating Calculator API Endpoint (Vercel Serverless Function)
 * 
 * This endpoint reads ratings from environment variables and calculates the average.
 * No scraping - just simple lookup and calculation.
 * 
 * Platforms (set these in Vercel Environment Variables):
 * - GOOGLE_RATING (e.g., "4.8")
 * - TRIPADVISOR_RATING (e.g., "4.9")
 * - BOOKING_RATING (e.g., "5.0")
 * - AIRBNB_RATING (e.g., "4.7")
 * - HOTELS_RATING (e.g., "4.8")
 * - EXPEDIA_RATING (e.g., "4.6")
 * 
 * Optional: Google Places API
 * - GOOGLE_PLACES_API_KEY (Google Cloud API key)
 * - GOOGLE_PLACE_ID (Google Place ID for your property)
 */

export default async function handler(req, res) {
    // Allow GET and POST requests
    if (req.method !== 'GET' && req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const platformRatings = {};

        // 1. Google Reviews - Check environment variable first, then Places API
        const googleRating = await getGoogleRating();
        if (googleRating !== null) {
            platformRatings.google = googleRating;
        }

        // 2. TripAdvisor - Environment variable only
        if (process.env.TRIPADVISOR_RATING) {
            platformRatings.tripadvisor = parseFloat(process.env.TRIPADVISOR_RATING);
        }

        // 3. Booking.com - Environment variable only
        if (process.env.BOOKING_RATING) {
            platformRatings.booking = parseFloat(process.env.BOOKING_RATING);
        }

        // 4. Airbnb - Environment variable only
        if (process.env.AIRBNB_RATING) {
            platformRatings.airbnb = parseFloat(process.env.AIRBNB_RATING);
        }

        // 5. Hotels.com - Environment variable only
        if (process.env.HOTELS_RATING) {
            platformRatings.hotels = parseFloat(process.env.HOTELS_RATING);
        }

        // 6. Expedia - Environment variable only
        if (process.env.EXPEDIA_RATING) {
            platformRatings.expedia = parseFloat(process.env.EXPEDIA_RATING);
        }

        // Calculate average rating
        const ratings = Object.values(platformRatings).filter(r => r !== null && !isNaN(r) && r > 0);
        const averageRating = ratings.length > 0
            ? parseFloat((ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length).toFixed(1))
            : null;

        const result = {
            success: true,
            timestamp: new Date().toISOString(),
            platformRatings,
            averageRating,
            platformsCount: ratings.length,
            source: 'environment_variables'
        };

        return res.status(200).json(result);

    } catch (error) {
        console.error('Error calculating ratings:', error);
        return res.status(500).json({
            error: 'Failed to calculate ratings',
            message: error.message
        });
    }
}

/**
 * Get Google rating from environment variable or Places API
 */
async function getGoogleRating() {
    // First check environment variable
    if (process.env.GOOGLE_RATING) {
        return parseFloat(process.env.GOOGLE_RATING);
    }

    // Optionally use Google Places API if configured
    if (process.env.GOOGLE_PLACES_API_KEY && process.env.GOOGLE_PLACE_ID) {
        try {
            const apiUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${process.env.GOOGLE_PLACE_ID}&fields=rating&key=${process.env.GOOGLE_PLACES_API_KEY}`;
            const response = await fetch(apiUrl);
            
            if (response.ok) {
                const data = await response.json();
                if (data.result && data.result.rating) {
                    return parseFloat(data.result.rating);
                }
            }
        } catch (error) {
            console.warn('Google Places API error:', error.message);
        }
    }

    return null;
}
