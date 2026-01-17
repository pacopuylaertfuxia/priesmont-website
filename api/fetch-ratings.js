/**
 * Rating Fetcher API Endpoint (Vercel Serverless Function)
 * 
 * ⚠️ IMPORTANT: This endpoint primarily uses environment variables for ratings.
 * Scraping is only attempted as a last resort and may violate platform Terms of Service.
 * 
 * RECOMMENDED: Set environment variables for all ratings instead of relying on scraping.
 * 
 * Platforms:
 * - Google Reviews (use GOOGLE_RATING env var or Google Places API)
 * - TripAdvisor (use TRIPADVISOR_RATING env var - scraping blocked)
 * - Booking.com (use BOOKING_RATING env var)
 * - Airbnb (use AIRBNB_RATING env var)
 * - Hotels.com (use HOTELS_RATING env var)
 * - Expedia (use EXPEDIA_RATING env var)
 */

export default async function handler(req, res) {
    // Allow GET and POST requests (POST for manual triggers, GET for cron)
    if (req.method !== 'GET' && req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    // Optional: Add authentication token check for security
    const AUTH_TOKEN = process.env.RATING_FETCH_TOKEN;
    if (AUTH_TOKEN && req.headers.authorization !== `Bearer ${AUTH_TOKEN}`) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
        const platformRatings = {};
        const scrapingEnabled = process.env.ENABLE_SCRAPING === 'true'; // Disabled by default

        // 1. Google Reviews (prefer env var or Google Places API)
        try {
            const googleRating = await fetchGoogleRating();
            if (googleRating) platformRatings.google = googleRating;
        } catch (error) {
            console.error('Error fetching Google rating:', error);
        }

        // 2. TripAdvisor (prefer env var - scraping blocked/not recommended)
        try {
            const tripAdvisorRating = await fetchTripAdvisorRating();
            if (tripAdvisorRating) platformRatings.tripadvisor = tripAdvisorRating;
        } catch (error) {
            console.error('Error fetching TripAdvisor rating:', error);
        }

        // 3. Booking.com (prefer env var)
        try {
            const bookingRating = await fetchBookingRating();
            if (bookingRating) platformRatings.booking = bookingRating;
        } catch (error) {
            console.error('Error fetching Booking.com rating:', error);
        }

        // 4. Airbnb (prefer env var)
        try {
            const airbnbRating = await fetchAirbnbRating();
            if (airbnbRating) platformRatings.airbnb = airbnbRating;
        } catch (error) {
            console.error('Error fetching Airbnb rating:', error);
        }

        // 5. Hotels.com (prefer env var)
        try {
            const hotelsRating = await fetchHotelsRating();
            if (hotelsRating) platformRatings.hotels = hotelsRating;
        } catch (error) {
            console.error('Error fetching Hotels.com rating:', error);
        }

        // 6. Expedia (prefer env var)
        try {
            const expediaRating = await fetchExpediaRating();
            if (expediaRating) platformRatings.expedia = expediaRating;
        } catch (error) {
            console.error('Error fetching Expedia rating:', error);
        }

        // Calculate average rating (only count platforms that returned valid ratings)
        const ratings = Object.values(platformRatings).filter(r => r !== null && !isNaN(r));
        const averageRating = ratings.length > 0
            ? (ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length).toFixed(1)
            : null;
        
        // Log which platforms succeeded/failed for debugging
        console.log(`Rating fetch complete: ${ratings.length} platforms succeeded, average: ${averageRating || 'N/A'}`);

        const result = {
            success: true,
            timestamp: new Date().toISOString(),
            platformRatings,
            averageRating: averageRating ? parseFloat(averageRating) : null,
            platformsCount: ratings.length
        };

        // In a real implementation, you'd store this in a database or KV store
        // For now, we'll return it and rely on the /api/ratings endpoint to cache it
        // You can use Vercel KV, Upstash, or a database to persist this

        return res.status(200).json(result);

    } catch (error) {
        console.error('Error fetching ratings:', error);
        return res.status(500).json({
            error: 'Failed to fetch ratings',
            message: error.message
        });
    }
}

/**
 * Fetch rating from Google Reviews
 * Note: Google doesn't provide a public API for reviews without Places API
 * Recommendation: Use GOOGLE_RATING environment variable
 */
async function fetchGoogleRating() {
    // Google actively blocks automated scraping
    // Use environment variable as primary source
    if (process.env.GOOGLE_RATING) {
        return parseFloat(process.env.GOOGLE_RATING);
    }

    // Google Places API option (requires API key and billing)
    // To use: Set GOOGLE_PLACES_API_KEY and GOOGLE_PLACE_ID in environment variables
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

/**
 * Fetch rating from TripAdvisor
 * ⚠️ IMPORTANT: TripAdvisor prohibits scraping in their Terms of Service.
 * Always use TRIPADVISOR_RATING environment variable instead.
 */
async function fetchTripAdvisorRating() {
    // ALWAYS use environment variable - scraping violates ToS
    if (process.env.TRIPADVISOR_RATING) {
        return parseFloat(process.env.TRIPADVISOR_RATING);
    }
    
    // DO NOT attempt scraping - it violates TripAdvisor's Terms of Service
    // Scraping disabled - only use environment variables
    console.warn('TRIPADVISOR_RATING environment variable not set. Set it in Vercel to use TripAdvisor rating.');
    return null;
}

/**
 * Fetch rating from Booking.com
 */
async function fetchBookingRating() {
    // Use environment variable as primary source (more reliable)
    if (process.env.BOOKING_RATING) {
        return parseFloat(process.env.BOOKING_RATING);
    }
    
    const url = 'https://www.booking.com/hotel/be/priesmont-vielsalm.html';
    
    try {
        const response = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                'Accept-Language': 'en-US,en;q=0.9',
                'Accept-Encoding': 'gzip, deflate, br',
                'Connection': 'keep-alive',
                'Upgrade-Insecure-Requests': '1'
            }
        });
        
        if (!response.ok) {
            console.warn(`Booking.com returned ${response.status} - use BOOKING_RATING environment variable`);
            return null;
        }

        const html = await response.text();
        
        // Booking.com typically uses structured data or specific classes
        const ratingMatch = html.match(/"ratingValue":\s*([0-9.]+)/i) ||
                           html.match(/data-testid="rating-score"[^>]*>([0-9.]+)/i) ||
                           html.match(/class="bui-review-score__badge"[^>]*>([0-9.]+)/i) ||
                           html.match(/review-score-badge[^>]*>([0-9.]+)/i);
        
        if (ratingMatch && ratingMatch[1]) {
            return parseFloat(ratingMatch[1]);
        }
        
        return null;
    } catch (error) {
        console.warn('Booking.com scraping failed:', error.message);
        return null;
    }
}

/**
 * Fetch rating from Airbnb
 */
async function fetchAirbnbRating() {
    // Use environment variable as primary source
    if (process.env.AIRBNB_RATING) {
        return parseFloat(process.env.AIRBNB_RATING);
    }
    
    const url = 'https://www.airbnb.com/rooms/51616420';
    
    try {
        const response = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                'Accept-Language': 'en-US,en;q=0.9',
                'Accept-Encoding': 'gzip, deflate, br'
            }
        });
        
        if (!response.ok) {
            console.warn(`Airbnb returned ${response.status} - use AIRBNB_RATING environment variable`);
            return null;
        }

        const html = await response.text();
        
        // Airbnb uses React/JSON data embedded in the page
        const jsonMatch = html.match(/<script[^>]*id="data-state"[^>]*>(.*?)<\/script>/s);
        
        if (jsonMatch) {
            try {
                const data = JSON.parse(jsonMatch[1]);
                const rating = data?.bootstrapData?.presentation?.pdpSections?.rating;
                if (rating) return parseFloat(rating);
            } catch (e) {
                // JSON parse failed, try regex
            }
        }
        
        // Try regex fallback
        const ratingMatch = html.match(/"rating":\s*([0-9.]+)/i) ||
                           html.match(/_rating["\s]*:\s*([0-9.]+)/i) ||
                           html.match(/rating.*?([0-9]\.[0-9])/i);
        
        if (ratingMatch && ratingMatch[1]) {
            return parseFloat(ratingMatch[1]);
        }
        
        return null;
    } catch (error) {
        console.warn('Airbnb scraping failed:', error.message);
        return null;
    }
}

/**
 * Fetch rating from Hotels.com
 */
async function fetchHotelsRating() {
    // Use environment variable as primary source
    if (process.env.HOTELS_RATING) {
        return parseFloat(process.env.HOTELS_RATING);
    }
    
    const url = 'https://be.hotels.com/ho2987315648/domaine-de-priesmont-vielsalm-belgie/';
    
    try {
        const response = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                'Accept-Language': 'en-US,en;q=0.9'
            }
        });
        
        if (!response.ok) {
            console.warn(`Hotels.com returned ${response.status} - use HOTELS_RATING environment variable`);
            return null;
        }

        const html = await response.text();
        
        // Hotels.com rating extraction
        const ratingMatch = html.match(/"ratingValue":\s*([0-9.]+)/i) ||
                           html.match(/data-rating="([0-9.]+)"/i) ||
                           html.match(/class="[^"]*rating[^"]*">([0-9.]+)/i);
        
        if (ratingMatch && ratingMatch[1]) {
            return parseFloat(ratingMatch[1]);
        }
        
        return null;
    } catch (error) {
        console.warn('Hotels.com scraping failed:', error.message);
        return null;
    }
}

/**
 * Fetch rating from Expedia
 */
async function fetchExpediaRating() {
    // Use environment variable as primary source
    if (process.env.EXPEDIA_RATING) {
        return parseFloat(process.env.EXPEDIA_RATING);
    }
    
    const url = 'https://www.expedia.be/fr/Vielsalm-Hotel-Domaine-De-Priesmont.h93322364.Description-Hotel';
    
    try {
        const response = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                'Accept-Language': 'fr-FR,fr;q=0.9,en;q=0.8'
            }
        });
        
        if (!response.ok) {
            console.warn(`Expedia returned ${response.status} - use EXPEDIA_RATING environment variable`);
            return null;
        }

        const html = await response.text();
        
        // Expedia rating extraction
        const ratingMatch = html.match(/"ratingValue":\s*([0-9.]+)/i) ||
                           html.match(/data-rating="([0-9.]+)"/i) ||
                           html.match(/class="[^"]*rating[^"]*">([0-9.]+)/i);
        
        if (ratingMatch && ratingMatch[1]) {
            return parseFloat(ratingMatch[1]);
        }
        
        return null;
    } catch (error) {
        console.warn('Expedia scraping failed:', error.message);
        return null;
    }
}