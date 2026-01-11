# How to Get Images from priesmont.com

## Quick Method (Recommended)

1. **Open priesmont.com** in your browser
2. **Open Developer Console**:
   - Press `F12` (Windows/Linux) or `Cmd+Option+I` (Mac)
   - Or right-click → Inspect → Console tab
3. **Copy and paste** the entire contents of `get-images.js` into the console
4. **Press Enter**
5. A popup will appear showing all images with copy buttons
6. **Copy the image URLs** and update them in `index.html`

## Manual Method

1. Visit https://priesmont.com
2. **Right-click on any image** you want to use
3. Select **"Copy image address"** or **"Copy image URL"**
4. Paste the URL into the appropriate place in `index.html`

## Where to Update Images in index.html

### Hero Background Image (Line ~40)
```html
<div class="hero-background" style="background-image: url('PASTE_URL_HERE');">
```

### About Section Image (Line ~88)
```html
<img src="PASTE_URL_HERE" alt="Priesmont Manor exterior view" class="about-img">
```

### Gallery Images (Lines ~100-130)
Replace each of the 6 gallery image URLs:
```html
<img src="PASTE_URL_HERE" alt="Description">
```

## Image Recommendations

- **Hero**: Wide landscape image of the manor exterior (1920x1080 or larger)
- **About**: Square or portrait image of the manor (800x800 or similar)
- **Gallery**: 
  1. Indoor pool
  2. Outdoor pool  
  3. Sauna
  4. Rooms/interior
  5. Piano
  6. Nature/Ardennes landscape

## Alternative: Use the Helper Tool

Open `extract-images.html` in your browser for a visual tool to help extract images.



