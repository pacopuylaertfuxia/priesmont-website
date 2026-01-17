/**
 * Rating Fetcher API Endpoint (Vercel Serverless Function)
 * 
 * This endpoint scrapes ratings from all booking platforms and calculates the average.
 * It's designed to be called weekly via Vercel Cron Jobs.
 * 
 * Platforms:
 * - Google Reviews
 * - TripAdvisor
 * - Booking.com
 * - Airbnb
 * - Hotels.com
 * - Expedia
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

        // 1. Google Reviews
        try {
            const googleRating = await fetchGoogleRating();
            if (googleRating) platformRatings.google = googleRating;
        } catch (error) {
            console.error('Error fetching Google rating:', error);
        }

        // 2. TripAdvisor
        try {
            const tripAdvisorRating = await fetchTripAdvisorRating();
            if (tripAdvisorRating) platformRatings.tripadvisor = tripAdvisorRating;
        } catch (error) {
            console.error('Error fetching TripAdvisor rating:', error);
        }

        // 3. Booking.com
        try {
            const bookingRating = await fetchBookingRating();
            if (bookingRating) platformRatings.booking = bookingRating;
        } catch (error) {
            console.error('Error fetching Booking.com rating:', error);
        }

        // 4. Airbnb
        try {
            const airbnbRating = await fetchAirbnbRating();
            if (airbnbRating) platformRatings.airbnb = airbnbRating;
        } catch (error) {
            console.error('Error fetching Airbnb rating:', error);
        }

        // 5. Hotels.com
        try {
            const hotelsRating = await fetchHotelsRating();
            if (hotelsRating) platformRatings.hotels = hotelsRating;
        } catch (error) {
            console.error('Error fetching Hotels.com rating:', error);
        }

        // 6. Expedia
        try {
            const expediaRating = await fetchExpediaRating();
            if (expediaRating) platformRatings.expedia = expediaRating;
        } catch (error) {
            console.error('Error fetching Expedia rating:', error);
        }

        // Calculate average rating
        const ratings = Object.values(platformRatings);
        const averageRating = ratings.length > 0
            ? (ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length).toFixed(1)
            : null;

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
 * Note: Google doesn't provide a public API, so we'd need to scrape or use Places API
 */
async function fetchGoogleRating() {
    // Option 1: Use Google Places API (requires API key and billing)
    // Option 2: Scrape the Google Reviews page (may violate ToS)
    // Option 3: Manual entry via environment variable
    
    // For now, use environment variable as fallback
    if (process.env.GOOGLE_RATING) {
        return parseFloat(process.env.GOOGLE_RATING);
    }

    // TODO: Implement actual scraping or API integration
    // Google Places API requires setup in Google Cloud Console
    return null;
}

/**
 * Fetch rating from TripAdvisor
 */
async function fetchTripAdvisorRating() {
    const url = 'https://www.tripadvisor.com/Hotel_Review-g666674-d20091508-Reviews-Domaine_De_Priesmont-Vielsalm_Luxembourg_Province_The_Ardennes_Wallonia.html';
    
    try {
        const response = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
        });
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        const html = await response.text();
        
        // Extract rating from HTML (TripAdvisor typically shows rating in data attributes or structured data)
        // Look for patterns like: "ratingValue": "4.5" or data-rating="4.5"
        const ratingMatch = html.match(/"ratingValue":\s*"([0-9.]+)"/i) ||
                           html.match(/data-rating="([0-9.]+)"/i) ||
                           html.match(/class="[^"]*rating[^"]*">([0-9.]+)/i);
        
        if (ratingMatch && ratingMatch[1]) {
            return parseFloat(ratingMatch[1]);
        }
        
        // Fallback: Check environment variable
        if (process.env.TRIPADVISOR_RATING) {
            return parseFloat(process.env.TRIPADVISOR_RATING);
        }
        
        return null;
    } catch (error) {
        console.error('TripAdvisor fetch error:', error);
        // Fallback to environment variable
        if (process.env.TRIPADVISOR_RATING) {
            return parseFloat(process.env.TRIPADVISOR_RATING);
        }
        return null;
    }
}

/**
 * Fetch rating from Booking.com
 */
async function fetchBookingRating() {
    const url = 'https://www.booking.com/hotel/be/priesmont-vielsalm.html';
    
    try {
        const response = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                'Accept-Language': 'en-US,en;q=0.9'
            }
        });
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        const html = await response.text();
        
        // Booking.com typically uses structured data or specific classes
        // Look for: data-testid="rating-score" or "ratingValue" in JSON-LD
        const ratingMatch = html.match(/"ratingValue":\s*([0-9.]+)/i) ||
                           html.match(/data-testid="rating-score"[^>]*>([0-9.]+)/i) ||
                           html.match(/class="bui-review-score__badge"[^>]*>([0-9.]+)/i);
        
        if (ratingMatch && ratingMatch[1]) {
            return parseFloat(ratingMatch[1]);
        }
        
        if (process.env.BOOKING_RATING) {
            return parseFloat(process.env.BOOKING_RATING);
        }
        
        return null;
    } catch (error) {
        console.error('Booking.com fetch error:', error);
        if (process.env.BOOKING_RATING) {
            return parseFloat(process.env.BOOKING_RATING);
        }
        return null;
    }
}

/**
 * Fetch rating from Airbnb
 */
async function fetchAirbnbRating() {
    const url = 'https://www.airbnb.com/rooms/51616420';
    
    try {
        const response = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
        });
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        const html = await response.text();
        
        // Airbnb uses React/JSON data embedded in the page
        // Look for JSON-LD or script tags with rating data
        const jsonMatch = html.match(/<script[^>]*id="data-state"[^>]*>(.*?)<\/script>/s);
        
        if (jsonMatch) {
            try {
                const data = JSON.parse(jsonMatch[1]);
                // Navigate through Airbnb's data structure (varies by page structure)
                // This is a simplified version - may need adjustment based on actual structure
                const rating = data?.bootstrapData?.presentation?.pdpSections?.rating;
                if (rating) return parseFloat(rating);
            } catch (e) {
                // JSON parse failed, try regex
            }
        }
        
        // Try regex fallback
        const ratingMatch = html.match(/"rating":\s*([0-9.]+)/i) ||
                           html.match(/_rating["\s]*:\s*([0-9.]+)/i);
        
        if (ratingMatch && ratingMatch[1]) {
            return parseFloat(ratingMatch[1]);
        }
        
        if (process.env.AIRBNB_RATING) {
            return parseFloat(process.env.AIRBNB_RATING);
        }
        
        return null;
    } catch (error) {
        console.error('Airbnb fetch error:', error);
        if (process.env.AIRBNB_RATING) {
            return parseFloat(process.env.AIRBNB_RATING);
        }
        return null;
    }
}

/**
 * Fetch rating from Hotels.com
 */
async function fetchHotelsRating() {
    const url = 'https://be.hotels.com/ho2987315648/domaine-de-priesmont-vielsalm-belgie/';
    
    try {
        const response = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
        });
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        const html = await response.text();
        
        // Hotels.com rating extraction
        const ratingMatch = html.match(/"ratingValue":\s*([0-9.]+)/i) ||
                           html.match(/data-rating="([0-9.]+)"/i) ||
                           html.match(/class="[^"]*rating[^"]*">([0-9.]+)/i);
        
        if (ratingMatch && ratingMatch[1]) {
            return parseFloat(ratingMatch[1]);
        }
        
        if (process.env.HOTELS_RATING) {
            return parseFloat(process.env.HOTELS_RATING);
        }
        
        return null;
    } catch (error) {
        console.error('Hotels.com fetch error:', error);
        if (process.env.HOTELS_RATING) {
            return parseFloat(process.env.HOTELS_RATING);
        }
        return null;
    }
}

/**
 * Fetch rating from Expedia
 */
async function fetchExpediaRating() {
    const url = 'https://www.expedia.be/fr/Vielsalm-Hotel-Domaine-De-Priesmont.h93322364.Description-Hotel';
    
    try {
        const response = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                'Accept-Language': 'fr-FR,fr;q=0.9,en;q=0.8'
            }
        });
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        const html = await response.text();
        
        // Expedia rating extraction
        const ratingMatch = html.match(/"ratingValue":\s*([0-9.]+)/i) ||
                           html.match(/data-rating="([0-9.]+)"/i) ||
                           html.match(/class="[^"]*rating[^"]*">([0-9.]+)/i);
        
        if (ratingMatch && ratingMatch[1]) {
            return parseFloat(ratingMatch[1]);
        }
        
        if (process.env.EXPEDIA_RATING) {
            return parseFloat(process.env.EXPEDIA_RATING);
        }
        
        return null;
    } catch (error) {
        console.error('Expedia fetch error:', error);
        if (process.env.EXPEDIA_RATING) {
            return parseFloat(process.env.EXPEDIA_RATING);
        }
        return null;
    }
}