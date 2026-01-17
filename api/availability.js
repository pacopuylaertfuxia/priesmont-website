// API endpoint to fetch availability from Lodgify
// This is a serverless function that proxies requests to Lodgify API

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const LODGIFY_API_KEY = process.env.LODGIFY_API_KEY;
        const LODGIFY_ACCOUNT_ID = process.env.LODGIFY_ACCOUNT_ID;
        const RENTAL_ID = process.env.LODGIFY_RENTAL_ID || '279598';
        
        if (!LODGIFY_API_KEY || !LODGIFY_ACCOUNT_ID) {
            return res.status(500).json({ 
                error: 'Lodgify API credentials not configured',
                message: 'Please set LODGIFY_API_KEY and LODGIFY_ACCOUNT_ID in Vercel environment variables'
            });
        }

        // Get date range from query params or default to next 12 months
        const today = new Date();
        const checkIn = req.query.checkIn || today.toISOString().split('T')[0];
        const checkOut = req.query.checkOut || new Date(today.setMonth(today.getMonth() + 12)).toISOString().split('T')[0];

        // Lodgify API endpoint for availability
        // Note: You may need to adjust this based on Lodgify's actual API
        // Alternative: Use Lodgify's public widget/calendar if API is not available
        const lodgifyUrl = `https://api.lodgify.com/v1/availability/calendar?rentalId=${RENTAL_ID}&checkIn=${checkIn}&checkOut=${checkOut}`;
        
        const response = await fetch(lodgifyUrl, {
            method: 'GET',
            headers: {
                'X-ApiKey': LODGIFY_API_KEY,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });

        if (!response.ok) {
            // If API call fails, return structured error
            const errorText = await response.text();
            console.error('Lodgify API error:', response.status, errorText);
            
            // Return mock data structure for development if API fails
            return res.status(200).json({
                success: false,
                error: 'Failed to fetch availability from Lodgify',
                message: 'Using placeholder data. Please configure Lodgify API credentials.',
                bookedDates: [], // Empty array means all dates available
                availableDates: []
            });
        }

        const data = await response.json();
        
        // Process the data to extract booked dates
        // Lodgify API response format may vary, adjust as needed
        const bookedDates = data.bookedDates || data.unavailableDates || [];
        const availableDates = data.availableDates || [];

        res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400');
        return res.status(200).json({
            success: true,
            bookedDates: bookedDates,
            availableDates: availableDates,
            checkIn: checkIn,
            checkOut: checkOut
        });

    } catch (error) {
        console.error('Error fetching availability:', error);
        
        // Return mock data on error for graceful degradation
        return res.status(200).json({
            success: false,
            error: error.message,
            bookedDates: [],
            availableDates: [],
            message: 'Unable to fetch availability. Please try again later or contact us directly.'
        });
    }
}
