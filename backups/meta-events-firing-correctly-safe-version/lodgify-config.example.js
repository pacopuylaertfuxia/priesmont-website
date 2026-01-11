// Lodgify API Configuration - EXAMPLE FILE
// Copy this file to lodgify-config.js and fill in your actual credentials
// ⚠️ Never commit lodgify-config.js to version control!

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
        websiteUrl: 'https://yourproperty.lodgify.com',
        
        // Widget theme (optional)
        theme: 'light', // 'light' or 'dark'
        
        // Language
        language: 'en'
    }
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = LODGIFY_CONFIG;
}



