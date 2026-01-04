# Booking Funnel & Meta Pixel Events Mapping

This document maps the user journey through the booking funnel and the corresponding Meta Pixel events.

## Booking Funnel Stages

### 1. Awareness Stage
**User Action:** Lands on homepage, views property
- **Meta Pixel Event:** `PageView` ✅
- **Meta Pixel Event:** `ViewContent` ✅
  - Parameters: `content_name: "Priesmont Manor"`, `content_category: "Property"`

### 2. Interest Stage
**User Action:** Scrolls through gallery, views features
- **Meta Pixel Event:** `ViewContent` ✅
  - Parameters: `content_name: "Priesmont Manor Gallery"`, `content_category: "Gallery"`
- **Meta Pixel Event:** `ViewContent` ✅
  - Parameters: `content_name: "Priesmont Manor Features"`, `content_category: "Features"`

### 3. Consideration Stage
**User Action:** Views location, checks distances
- **Meta Pixel Event:** `ViewContent` ✅
  - Parameters: `content_name: "Priesmont Manor Location"`, `content_category: "Location"`

### 4. Intent Stage
**User Action:** Clicks "Book Now" or navigates to booking section
- **Meta Pixel Event:** `InitiateCheckout` ✅
  - Parameters: `content_name: "Priesmont Manor Booking"`, `content_category: "Booking"`

### 5. Engagement Stage (Lodgify Widget)
**User Action:** Interacts with Lodgify booking calendar
- **Meta Pixel Event:** `ViewContent` ✅
  - Parameters: `content_name: "Lodgify Booking Widget"`, `content_category: "Booking"`
- **Meta Pixel Event:** `Search` (when user searches for dates)
  - Parameters: `search_string: "Date Search"`, `content_category: "Booking"`

### 6. Lead Stage
**User Action:** Submits contact form or inquiry
- **Meta Pixel Event:** `Lead` ✅
  - Parameters: `content_name: "Priesmont Manor Inquiry"`, `content_category: "Contact Form"`

### 7. Conversion Stage (Lodgify)
**User Action:** Completes booking through Lodgify
- **Meta Pixel Event:** `CompleteRegistration` ✅
  - Parameters: `content_name: "Priesmont Manor Booking"`, `status: true`, `method: "Lodgify"`

## Recommended Event Additions

### Add These Events for Better Tracking:

1. **Search Event** - When user selects dates in Lodgify widget
2. **AddToWishlist** - When user saves/bookmarks property
3. **Schedule** - When user requests a viewing
4. **Custom Event: "BookingStarted"** - When user starts filling booking form
5. **Custom Event: "PaymentStarted"** - When user reaches payment step

## Lodgify Integration Points

Since bookings happen through Lodgify's widget, we need to track:

1. **Widget Load** - Track when booking widget is visible
2. **Date Selection** - Track when user selects check-in/check-out dates
3. **Guest Selection** - Track when user selects number of guests
4. **Form Start** - Track when user starts filling booking form
5. **Payment Start** - Track when user reaches payment page
6. **Booking Complete** - Track when booking is confirmed

## Next Steps

1. ✅ Set up Lodgify widget (simplified iframe method)
2. ⏳ Add event listeners for Lodgify widget interactions
3. ⏳ Map Lodgify booking steps to Meta Pixel events
4. ⏳ Test complete booking funnel
5. ⏳ Set up custom conversions in Facebook Ads Manager

## Event Priority

**High Priority Events:**
- `InitiateCheckout` - Most important for retargeting
- `Lead` - For lead generation campaigns
- `CompleteRegistration` - For conversion tracking

**Medium Priority Events:**
- `ViewContent` (various) - For awareness campaigns
- `Search` - For intent-based targeting

**Low Priority Events:**
- `AddToWishlist` - Nice to have
- `Schedule` - If you offer viewings


