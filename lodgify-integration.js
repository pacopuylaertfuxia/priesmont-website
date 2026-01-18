// Lodgify API Integration
// This file handles all interactions with Lodgify's API

class LodgifyIntegration {
    constructor(config) {
        this.apiKey = config.apiKey;
        this.accountId = config.accountId;
        this.propertyId = config.propertyId;
        this.apiBaseUrl = config.apiBaseUrl;
    }

    // Get API headers with authentication
    getHeaders() {
        return {
            'X-ApiKey': this.apiKey,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        };
    }

    // Check availability for a date range
    async checkAvailability(checkIn, checkOut, propertyId = null) {
        const property = propertyId || this.propertyId;
        const url = `${this.apiBaseUrl}/availability/calendar?checkIn=${checkIn}&checkOut=${checkOut}${property ? `&propertyId=${property}` : ''}`;
        
        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: this.getHeaders()
            });
            
            if (!response.ok) {
                throw new Error(`Availability check failed: ${response.statusText}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('Error checking availability:', error);
            throw error;
        }
    }

    // Get property details
    async getPropertyDetails(propertyId = null) {
        const property = propertyId || this.propertyId;
        const url = `${this.apiBaseUrl}/properties${property ? `/${property}` : ''}`;
        
        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: this.getHeaders()
            });
            
            if (!response.ok) {
                throw new Error(`Failed to fetch property: ${response.statusText}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('Error fetching property details:', error);
            throw error;
        }
    }

    // Get rates for a date range
    async getRates(checkIn, checkOut, propertyId = null) {
        const property = propertyId || this.propertyId;
        const url = `${this.apiBaseUrl}/rates?checkIn=${checkIn}&checkOut=${checkOut}${property ? `&propertyId=${property}` : ''}`;
        
        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: this.getHeaders()
            });
            
            if (!response.ok) {
                throw new Error(`Failed to fetch rates: ${response.statusText}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('Error fetching rates:', error);
            throw error;
        }
    }

    // Create a booking (if API supports it)
    async createBooking(bookingData) {
        const url = `${this.apiBaseUrl}/bookings`;
        
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: this.getHeaders(),
                body: JSON.stringify(bookingData)
            });
            
            if (!response.ok) {
                throw new Error(`Booking creation failed: ${response.statusText}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('Error creating booking:', error);
            throw error;
        }
    }

    // Load Lodgify booking widget using official embed method
    loadBookingWidget(containerId) {
        const container = document.getElementById(containerId);
        if (!container) {
            console.error(`Container with ID "${containerId}" not found`);
            return;
        }

        const websiteUrl = LODGIFY_CONFIG.widgetSettings.websiteUrl;
        console.log('Lodgify websiteUrl:', websiteUrl);
        
        if (!websiteUrl || websiteUrl === 'https://yourproperty.lodgify.com') {
            console.warn('Lodgify websiteUrl not configured or using placeholder');
            container.innerHTML = `
                <div class="booking-setup-instructions">
                    <h3>Lodgify Setup Required</h3>
                    <p>Please configure your Lodgify website URL in <code>lodgify-config.js</code></p>
                    <p>Get your URL from: Lodgify → Settings → Website</p>
                </div>
            `;
            return;
        }

        // Clean the URL (remove trailing slash)
        const cleanUrl = websiteUrl.replace(/\/$/, '');
        
        // Use Lodgify's official widget embed method
        // This loads the widget script and initializes it
        if (!window.Lodgify) {
            // Load Lodgify widget script if not already loaded
            const script = document.createElement('script');
            script.id = 'lodgify-widget-script';
            script.src = 'https://widget.lodgify.com/lodgify-widget.js';
            script.async = true;
            script.onload = () => {
                this.initializeWidget(container, cleanUrl);
            };
            script.onerror = () => {
                console.error('Failed to load Lodgify widget script');
                container.innerHTML = `
                    <div class="booking-setup-instructions">
                        <h3>Unable to Load Booking Widget</h3>
                        <p>Please check your internet connection and try again.</p>
                        <p>If the problem persists, contact Lodgify support.</p>
                    </div>
                `;
            };
            document.head.appendChild(script);
        } else {
            // Widget script already loaded, initialize directly
            this.initializeWidget(container, cleanUrl);
        }
    }

    // Initialize the Lodgify widget
    initializeWidget(container, websiteUrl) {
        // Clear container
        const widgetDiv = document.createElement('div');
        widgetDiv.id = 'lodgify-booking-widget';
        container.innerHTML = '';
        container.appendChild(widgetDiv);
        
        // Initialize Lodgify widget
        try {
            if (typeof window.lodgify === 'function') {
                window.lodgify('init', {
                    websiteUrl: websiteUrl,
                    widgetId: 'lodgify-booking-widget'
                });
                
                // ViewContent tracking is now handled in index.html for user-initiated interactions only
                // This ensures ViewContent fires only when user clicks/interacts with widget, not on load
            } else if (window.Lodgify) {
                // Alternative initialization method
                window.Lodgify.init({
                    websiteUrl: websiteUrl,
                    widgetId: 'lodgify-booking-widget'
                });
            } else {
                // Fallback: Show direct booking link
                console.warn('Lodgify widget not available, showing direct booking link');
                container.innerHTML = `
                    <div class="booking-direct-link" style="text-align: center; padding: 3rem;">
                        <h3 style="margin-bottom: 1.5rem;">Book Your Stay</h3>
                        <p style="margin-bottom: 2rem; color: var(--text-light);">Click below to check availability and make a reservation:</p>
                        <a href="${websiteUrl}" target="_blank" class="btn btn-primary" style="display: inline-block; padding: 1rem 2.5rem; background: var(--primary-color); color: white; text-decoration: none; border-radius: 0; font-weight: 500; transition: all 0.3s ease;">
                            Book Now on Lodgify
                        </a>
                    </div>
                `;
            }
        } catch (error) {
            console.error('Error initializing Lodgify widget:', error);
            // Fallback: Show direct booking link
            container.innerHTML = `
                <div class="booking-direct-link" style="text-align: center; padding: 3rem;">
                    <h3 style="margin-bottom: 1.5rem;">Book Your Stay</h3>
                    <p style="margin-bottom: 2rem; color: var(--text-light);">Click below to check availability and make a reservation:</p>
                    <a href="${websiteUrl}" target="_blank" class="btn btn-primary" style="display: inline-block; padding: 1rem 2.5rem; background: var(--primary-color); color: white; text-decoration: none; border-radius: 0; font-weight: 500; transition: all 0.3s ease;">
                        Book Now on Lodgify
                    </a>
                </div>
            `;
        }
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Initialize integration (works with just website URL, API key optional)
    if (LODGIFY_CONFIG && LODGIFY_CONFIG.widgetSettings) {
        window.lodgifyIntegration = new LodgifyIntegration(LODGIFY_CONFIG);
        console.log('Lodgify integration initialized');
    } else {
        console.warn('Lodgify configuration not found');
    }
});


