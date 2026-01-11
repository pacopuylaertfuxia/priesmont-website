// Lodgify API Configuration
// Get these values from your Lodgify account:
// 1. Log in to Lodgify
// 2. Go to Settings > Public API
// 3. Copy your API Key
// 4. Get your Account ID from your profile (top right corner)

const LODGIFY_CONFIG = {
    // Your Lodgify API Key (from Settings > Public API)
    apiKey: 'YOUR_LODGIFY_API_KEY',
    
    // Your Lodgify Account ID (from your profile)
    accountId: 'YOUR_LODGIFY_ACCOUNT_ID',
    
    // Your property ID (if you have multiple properties)
    propertyId: null, // Set to specific property ID if needed, or null for all properties
    
    // API Base URL
    apiBaseUrl: 'https://api.lodgify.com/v1',
    
    // Booking Widget Settings
    widgetSettings: {
        // Your Lodgify website URL (e.g., https://yourproperty.lodgify.com)
        websiteUrl: 'https://priesmont.com',
        
        // Widget theme (optional)
        theme: 'light', // 'light' or 'dark'
        
        // Language
        language: 'en',
        
        // Book Now Box Widget Settings
        rentalId: '279598',
        websiteId: '280045',
        slug: 'carl-puylaert'
    }
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = LODGIFY_CONFIG;
}


