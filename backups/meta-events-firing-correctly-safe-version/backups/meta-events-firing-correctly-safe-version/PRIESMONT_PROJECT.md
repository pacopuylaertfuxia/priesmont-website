# Priesmont - Luxury Manor Rental Website

## Project Overview
A premium, custom-built website for Priesmont, a historic manor in the Belgian Ardennes available for exclusive rental. The property features 18 rooms, indoor & outdoor pools, sauna, classic piano, and accommodates up to 40 guests.

**Property Details:**
- Location: Rue Freddy Wampach, Vielsalm, Belgium
- Capacity: Up to 40 guests
- Rooms: 18 elegantly appointed rooms
- Premium Pricing: ~5000 EUR per weekend

## Technology Stack
- **Frontend:** HTML5, CSS3, JavaScript (Vanilla)
- **Booking System:** Lodgify Integration (Book Now Box Widget)
- **Analytics:** Meta Pixel (Facebook Pixel)
- **Design:** Apple-inspired minimalist design with glassmorphism effects
- **Responsive:** Fully responsive design for all devices

## Key Features

### 1. Navigation System
- **iOS-style floating navigation** with liquid glass effect
- **Smart collapse animation:** On scroll down, nav splits into logo (left) and hamburger menu (right)
- **Smooth transitions** with cubic-bezier easing
- **Language switcher:** EN, NL, FR translation buttons
- **Consistent width** maintained during collapse/expand

### 2. Hero Section
- Full-screen hero with background image
- Elegant typography and call-to-action buttons
- Smooth scroll indicator

### 3. About Section
- Two-column layout: text (left) + image + map (right)
- **Stats cards** with animated counters:
  - 18 Rooms
  - 40 Guests
  - 100+ Bookings
  - Movie Location
  - All Ages
  - Family Gatherings
  - Authentic Experience
  - 2 Hours from Airports
- Integrated Google Maps showing location
- Location context cards (train station, airports, cities)

### 4. Features & Amenities Section
- **Horizontally scrollable carousel** (desktop)
- Features include:
  - 18 Elegant Rooms
  - Indoor & Outdoor Pools
  - Private Sauna
  - Classic Piano
  - Solar Panels
  - Animals on Grounds
  - Parking
  - And more...

### 5. Gallery Section
- 50+ high-quality images
- **Fullscreen lightbox** with navigation
- Keyboard controls (arrow keys, Escape)
- Image counter
- Smooth transitions

### 6. Use Cases Section
- **Family Retreats:** Reunions, celebrations, weddings, birthdays
- **Business Retreats:** Focus groups, team events, corporate outings
- Strategic messaging for both scenarios

### 7. Testimonials Section
- 6 premium testimonials
- Star ratings
- Author avatars and locations
- 3-column grid layout (desktop)

### 8. Booking Section (Premium Design)
- **Two-column layout:** Benefits (left) + Lodgify Widget (right)
- **Premium copy and messaging:**
  - "Reserve Your Exclusive Stay"
  - Professional benefit descriptions
  - Trust badges (Verified Property, SSL Secured)
- **Enhanced feature cards:**
  - Icon containers with hover effects
  - Title + descriptive subtitle for each benefit
  - Premium styling with subtle animations
- **Lodgify Integration:**
  - Custom-styled booking widget
  - Clear unavailable date indicators (red background, X mark, strikethrough)
  - Apple-inspired design matching site aesthetic
  - Real-time availability calendar

### 9. Contact Section
- Two-column layout: Info cards (left) + Contact form (right)
- Optimized spacing and white space usage
- Form validation and Meta Pixel tracking

### 10. Language Support
- **Three languages:** English, Dutch (NL), French (FR)
- **Full translation system** with localStorage persistence
- All content sections translated
- Form labels and placeholders translated
- Lodgify widget language updates

## Design Philosophy

### Apple-Inspired Aesthetic
- Clean, minimalist design
- Generous white space
- System fonts (SF Pro, Helvetica Neue)
- Subtle shadows and borders
- Glassmorphism effects (backdrop blur)
- Smooth, fluid animations
- Premium color palette (dark grays, whites)

### Premium Standards
- Professional typography with proper letter-spacing
- Consistent spacing and alignment
- High-quality visual hierarchy
- Trust signals and security badges
- Sophisticated copywriting
- Industry-standard booking experience

## File Structure

```
website/
├── index.html              # Main HTML file
├── styles.css              # All styling (Apple-inspired, premium design)
├── script.js               # Interactive functionality, animations, tracking
├── translations.js         # Multi-language support (EN, NL, FR)
├── lodgify-config.js       # Lodgify API configuration
├── lodgify-integration.js  # Lodgify widget integration logic
├── meta-pixel-config.js    # Meta Pixel configuration
├── meta-pixel-events.js    # Meta Pixel event tracking
└── README.md               # Project documentation
```

## Key Integrations

### Lodgify Booking System
- **Widget Type:** Book Now Box (embedded)
- **Rental ID:** 279598
- **Website ID:** 280045
- **Custom Styling:** Apple-inspired design with custom CSS variables
- **Features:**
  - Real-time availability
  - Clear unavailable date indicators
  - Guest breakdown
  - Secure payment processing
  - Multi-language support

### Meta Pixel (Facebook Pixel)
- Base pixel code integrated
- Event tracking for:
  - ViewContent
  - InitiateCheckout
  - Lead
  - CompleteRegistration
  - Search
- Booking funnel optimization

## Responsive Design
- **Desktop:** Full-featured layout with multi-column grids
- **Tablet (968px):** Adjusted layouts, stacked columns
- **Mobile (640px):** Single column, optimized spacing, hamburger menu

## Browser Support
- Modern browsers (Chrome, Safari, Firefox, Edge)
- iOS Safari with backdrop-filter support
- Responsive images with fallbacks

## Performance Optimizations
- Smooth scroll animations with requestAnimationFrame
- Optimized CSS transitions
- Lazy loading for images
- Efficient event listeners

## Future Enhancements
- Additional language support
- Advanced booking analytics
- Guest review system integration
- Virtual tour integration
- Enhanced SEO optimization

## Notes
- All image URLs are from the original priesmont.com website
- Lodgify widget requires proper configuration in Lodgify dashboard
- Meta Pixel requires actual Pixel ID for production
- Translations are comprehensive but can be expanded

---

**Project Status:** Production Ready
**Last Updated:** Current
**Design:** Premium, Apple-inspired, Industry Standard


