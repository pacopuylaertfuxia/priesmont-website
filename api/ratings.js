/**
 * Ratings API Endpoint (Vercel Serverless Function)
 * 
 * This endpoint serves the current average rating to the frontend.
 * It can fetch fresh data or return cached/stored data.
 */

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        // Option 1: Use Vercel KV or similar to store cached ratings
        // Option 2: Call fetch-ratings endpoint and cache response
        // Option 3: Use environment variables for quick setup
        
        // For now, we'll check if there's a stored rating in KV or environment
        // If not, we'll trigger a fresh fetch (with caching)
        
        const cacheKey = 'rating_cache';
        let ratingData = null;

        // Try to get from Vercel KV if available
        if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
            try {
                const kv = await import('@vercel/kv').then(m => m.kv);
                ratingData = await kv.get(cacheKey);
            } catch (error) {
                console.log('KV not available, using fallback');
            }
        }

        // If no cached data and we need fresh data, trigger fetch
        const forceRefresh = req.query.refresh === 'true';
        
        if (!ratingData || forceRefresh) {
            // Call the fetch-ratings endpoint internally
            const baseUrl = process.env.VERCEL_URL 
                ? `https://${process.env.VERCEL_URL}` 
                : 'http://localhost:3000';
            
            try {
                const fetchResponse = await fetch(`${baseUrl}/api/fetch-ratings`, {
                    headers: {
                        'Authorization': `Bearer ${process.env.RATING_FETCH_TOKEN || 'internal'}`
                    }
                });
                
                if (fetchResponse.ok) {
                    ratingData = await fetchResponse.json();
                    
                    // Store in KV for future requests (cache for 24 hours)
                    if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
                        try {
                            const kv = await import('@vercel/kv').then(m => m.kv);
                            await kv.set(cacheKey, ratingData, { ex: 86400 }); // 24 hours
                        } catch (error) {
                            console.error('Failed to cache rating:', error);
                        }
                    }
                }
            } catch (error) {
                console.error('Error fetching fresh ratings:', error);
            }
        }

        // Fallback to environment variables if no data available
        if (!ratingData) {
            const platformRatings = {};
            
            if (process.env.GOOGLE_RATING) platformRatings.google = parseFloat(process.env.GOOGLE_RATING);
            if (process.env.TRIPADVISOR_RATING) platformRatings.tripadvisor = parseFloat(process.env.TRIPADVISOR_RATING);
            if (process.env.BOOKING_RATING) platformRatings.booking = parseFloat(process.env.BOOKING_RATING);
            if (process.env.AIRBNB_RATING) platformRatings.airbnb = parseFloat(process.env.AIRBNB_RATING);
            if (process.env.HOTELS_RATING) platformRatings.hotels = parseFloat(process.env.HOTELS_RATING);
            if (process.env.EXPEDIA_RATING) platformRatings.expedia = parseFloat(process.env.EXPEDIA_RATING);
            if (process.env.VRBO_RATING) platformRatings.vrbo = parseFloat(process.env.VRBO_RATING);
            
            const ratings = Object.values(platformRatings);
            const averageRating = ratings.length > 0
                ? parseFloat((ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length).toFixed(1))
                : 4.9; // Default fallback
            
            ratingData = {
                success: true,
                timestamp: new Date().toISOString(),
                platformRatings,
                averageRating,
                platformsCount: ratings.length,
                source: 'environment'
            };
        }

        // Set cache headers (1 hour client-side cache)
        res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400');
        
        return res.status(200).json(ratingData);

    } catch (error) {
        console.error('Error getting ratings:', error);
        
        // Return fallback data even on error
        return res.status(200).json({
            success: false,
            averageRating: 4.9, // Default fallback
            error: error.message,
            source: 'fallback'
        });
    }
}