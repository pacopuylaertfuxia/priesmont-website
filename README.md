# Priesmont Website

A modern, responsive website redesign for Priesmont built from scratch with HTML, CSS, and JavaScript.

## Features

- **Modern Design**: Clean, professional design with smooth animations
- **Fully Responsive**: Works perfectly on desktop, tablet, and mobile devices
- **Smooth Scrolling**: Smooth navigation between sections
- **Interactive Elements**: Hover effects, animations, and interactive components
- **Mobile Menu**: Hamburger menu for mobile devices
- **Lodgify Integration**: Full integration with Lodgify's booking system and channel manager
- **Real-time Bookings**: Direct booking widget with calendar synchronization
- **Contact Form**: Functional contact form with validation
- **Performance Optimized**: Lightweight and fast-loading

## Structure

```
website/
├── index.html              # Main HTML file
├── styles.css              # All styles and responsive design
├── script.js               # JavaScript for interactivity
├── lodgify-config.js       # Lodgify API configuration (⚠️ contains API keys)
├── lodgify-integration.js  # Lodgify API integration logic
├── LODGIFY_SETUP.md        # Detailed Lodgify setup instructions
├── IMAGE_URLS.md           # Guide for updating image URLs
└── README.md               # This file
```

## Getting Started

1. Open `index.html` in a web browser
2. For local development, you can use a simple HTTP server:
   ```bash
   # Using Python 3
   python -m http.server 8000
   
   # Using Node.js (with http-server)
   npx http-server
   ```
3. Navigate to `http://localhost:8000` in your browser

## Customization

### Colors
Edit the CSS variables in `styles.css`:
```css
:root {
    --primary-color: #2563eb;
    --secondary-color: #64748b;
    --accent-color: #f59e0b;
    /* ... */
}
```

### Content
- Update text content directly in `index.html`
- Modify sections, services, and contact information as needed
- Replace placeholder images with your own

### Lodgify Integration
This website is fully integrated with Lodgify's booking system and channel manager. To set it up:

1. **Get your Lodgify credentials**:
   - API Key: Settings → Public API
   - Account ID: From your profile
   - Website URL: Settings → Website

2. **Configure the integration**:
   - Open `lodgify-config.js`
   - Replace placeholder values with your actual credentials
   - See `LODGIFY_SETUP.md` for detailed instructions

3. **Benefits**:
   - Real-time availability calendar
   - Direct bookings on your website
   - Automatic sync with Airbnb, Booking.com, VRBO, etc.
   - Secure payment processing
   - Centralized guest management

### Contact Form
The contact form currently shows a success message. To make it functional:
1. Set up a backend service (e.g., Formspree or your own API/edge function on Vercel)
2. Update the form action in `script.js` to point to your endpoint
3. Alternatively, integrate with Lodgify's API to create booking requests

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## License

This project is open source and available for use.

