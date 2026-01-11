// Image URL Extractor for priesmont.com
// Run this script in the browser console on priesmont.com

(function() {
    console.log('🔍 Extracting images from priesmont.com...\n');
    
    const images = new Set();
    const results = {
        hero: [],
        gallery: [],
        about: [],
        all: []
    };
    
    // Get all img elements
    document.querySelectorAll('img').forEach(img => {
        if (img.src && img.src.startsWith('http') && !img.src.includes('data:')) {
            images.add(img.src);
            results.all.push(img.src);
            
            // Categorize by size/context
            const width = img.naturalWidth || img.width || 0;
            if (width > 1000) {
                results.hero.push(img.src);
            } else if (width > 400) {
                results.gallery.push(img.src);
            } else {
                results.about.push(img.src);
            }
        }
    });
    
    // Get background images
    document.querySelectorAll('*').forEach(el => {
        const bgImage = window.getComputedStyle(el).backgroundImage;
        if (bgImage && bgImage !== 'none') {
            const match = bgImage.match(/url\(['"]?([^'"]+)['"]?\)/);
            if (match && match[1] && match[1].startsWith('http') && !match[1].includes('data:')) {
                images.add(match[1]);
                results.all.push(match[1]);
                if (el.offsetWidth > 800) {
                    results.hero.push(match[1]);
                }
            }
        }
    });
    
    // Get inline style background images
    document.querySelectorAll('[style*="background"]').forEach(el => {
        const style = el.getAttribute('style');
        const matches = style.match(/url\(['"]?([^'"]+)['"]?\)/g);
        if (matches) {
            matches.forEach(match => {
                const url = match.match(/url\(['"]?([^'"]+)['"]?\)/)[1];
                if (url && url.startsWith('http') && !url.includes('data:')) {
                    images.add(url);
                    results.all.push(url);
                }
            });
        }
    });
    
    // Remove duplicates and filter
    const uniqueImages = Array.from(images).filter(url => 
        !url.includes('logo') && 
        !url.includes('icon') &&
        !url.includes('avatar') &&
        (url.includes('.jpg') || url.includes('.jpeg') || url.includes('.png') || url.includes('.webp'))
    );
    
    // Display results
    console.log('✅ Found', uniqueImages.length, 'images\n');
    console.log('📋 COPY THESE URLS:\n');
    console.log('=== HERO IMAGE (use first large image) ===');
    if (results.hero.length > 0) {
        console.log(results.hero[0]);
    } else if (uniqueImages.length > 0) {
        console.log(uniqueImages[0]);
    }
    
    console.log('\n=== ABOUT SECTION IMAGE ===');
    if (results.about.length > 0) {
        console.log(results.about[0]);
    } else if (uniqueImages.length > 1) {
        console.log(uniqueImages[1]);
    }
    
    console.log('\n=== GALLERY IMAGES (use 6 of these) ===');
    const galleryImages = results.gallery.length > 0 ? results.gallery : uniqueImages.slice(2, 8);
    galleryImages.slice(0, 6).forEach((url, i) => {
        console.log(`${i + 1}. ${url}`);
    });
    
    // Create visual popup
    const popup = document.createElement('div');
    popup.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0,0,0,0.95);
        z-index: 999999;
        overflow-y: auto;
        padding: 20px;
        font-family: Arial, sans-serif;
    `;
    
    popup.innerHTML = `
        <div style="max-width: 1200px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px;">
            <h1 style="margin-top: 0;">🎯 Found ${uniqueImages.length} Images</h1>
            <button onclick="this.closest('div[style*=\"position: fixed\"]').remove()" 
                    style="background: #dc2626; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; margin-bottom: 20px;">
                Close
            </button>
            
            <h2>Hero Image (Background)</h2>
            ${results.hero.length > 0 ? `
                <img src="${results.hero[0]}" style="max-width: 100%; height: auto; border-radius: 5px; margin: 10px 0;">
                <div style="background: #f0f0f0; padding: 10px; border-radius: 5px; margin: 10px 0; word-break: break-all; font-family: monospace; font-size: 12px;">
                    ${results.hero[0]}
                </div>
                <button onclick="navigator.clipboard.writeText('${results.hero[0]}')" 
                        style="background: #2563eb; color: white; border: none; padding: 8px 16px; border-radius: 5px; cursor: pointer;">
                    Copy URL
                </button>
            ` : uniqueImages.length > 0 ? `
                <img src="${uniqueImages[0]}" style="max-width: 100%; height: auto; border-radius: 5px; margin: 10px 0;">
                <div style="background: #f0f0f0; padding: 10px; border-radius: 5px; margin: 10px 0; word-break: break-all; font-family: monospace; font-size: 12px;">
                    ${uniqueImages[0]}
                </div>
                <button onclick="navigator.clipboard.writeText('${uniqueImages[0]}')" 
                        style="background: #2563eb; color: white; border: none; padding: 8px 16px; border-radius: 5px; cursor: pointer;">
                    Copy URL
                </button>
            ` : '<p>No hero image found</p>'}
            
            <h2 style="margin-top: 30px;">Gallery Images</h2>
            ${galleryImages.slice(0, 6).map((url, i) => `
                <div style="margin: 20px 0; padding: 15px; border: 1px solid #ddd; border-radius: 5px;">
                    <h3>Image ${i + 1}</h3>
                    <img src="${url}" style="max-width: 300px; height: auto; border-radius: 5px; margin: 10px 0;" 
                         onerror="this.style.display='none'">
                    <div style="background: #f0f0f0; padding: 10px; border-radius: 5px; margin: 10px 0; word-break: break-all; font-family: monospace; font-size: 11px;">
                        ${url}
                    </div>
                    <button onclick="navigator.clipboard.writeText('${url}')" 
                            style="background: #2563eb; color: white; border: none; padding: 5px 15px; border-radius: 5px; cursor: pointer; margin-top: 5px;">
                        Copy URL
                    </button>
                </div>
            `).join('')}
            
            <h2 style="margin-top: 30px;">All Images (${uniqueImages.length})</h2>
            <div style="max-height: 400px; overflow-y: auto; background: #f9f9f9; padding: 15px; border-radius: 5px;">
                ${uniqueImages.map((url, i) => `
                    <div style="margin: 5px 0; padding: 5px; background: white; border-radius: 3px;">
                        <span style="font-family: monospace; font-size: 11px; word-break: break-all;">${i + 1}. ${url}</span>
                        <button onclick="navigator.clipboard.writeText('${url}')" 
                                style="background: #10b981; color: white; border: none; padding: 3px 10px; border-radius: 3px; cursor: pointer; margin-left: 10px; font-size: 11px;">
                            Copy
                        </button>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
    
    document.body.appendChild(popup);
    
    return {
        hero: results.hero[0] || uniqueImages[0],
        gallery: galleryImages.slice(0, 6),
        all: uniqueImages
    };
})();



