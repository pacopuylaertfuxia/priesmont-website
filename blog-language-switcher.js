// Blog Post Language Switcher
// Maps blog post URLs to their language versions

const blogLanguageMap = {
    // English -> Dutch -> French
    'manor-vs-hotel-vs-airbnb-large-groups-belgium.html': {
        nl: 'landhuis-vs-hotel-vs-airbnb-grote-groepen-belgie.html',
        fr: 'manoir-vs-hotel-vs-airbnb-grands-groupes-belgique.html'
    },
    'how-much-cost-rent-manor-40-people-belgium.html': {
        nl: 'hoeveel-kost-landhuis-huren-40-mensen-belgie.html',
        fr: 'combien-coute-louer-manoir-40-personnes-belgique.html'
    },
    'large-group-accommodation-guide-40-guests-belgian-ardennes.html': {
        nl: 'grote-groep-accommodatie-40-gasten-belgische-ardennen.html',
        fr: 'guide-hebergement-grand-groupe-40-invites-ardennes-belges.html'
    },
    'private-bathrooms-guide-large-group-accommodation-belgium.html': {
        nl: 'eigen-badkamers-grote-groep-accommodatie-belgie.html',
        fr: 'salles-bain-privees-guide-hebergement-grand-groupe-belgique.html'
    },
    'eigen-badkamers-grote-groep-accommodatie-belgie.html': {
        en: 'private-bathrooms-guide-large-group-accommodation-belgium.html',
        fr: null
    },
    'planning-perfect-corporate-retreat-belgian-ardennes.html': {
        nl: 'bedrijfsuitje-planning-belgische-ardennen.html',
        fr: 'planning-retraite-entreprise-ardennes-belges.html'
    },
    'bedrijfsuitje-planning-belgische-ardennen.html': {
        en: 'planning-perfect-corporate-retreat-belgian-ardennes.html',
        fr: 'planning-retraite-entreprise-ardennes-belges.html'
    },
    'family-reunion-planning-guide-belgian-ardennes.html': {
        nl: null,
        fr: null
    },
    'team-building-venue-belgium-remote-work-retreats.html': {
        nl: null,
        fr: null
    },
    'strategic-planning-retreats-companies-belgian-ardennes.html': {
        nl: null,
        fr: null
    },
    'best-things-do-belgian-ardennes-complete-guide.html': {
        nl: null,
        fr: null
    },
    'why-belgian-ardennes-corporate-retreats-companies.html': {
        nl: null,
        fr: null
    },
    'wedding-venue-belgian-ardennes-40-guests.html': {
        nl: null,
        fr: null
    },
    'vielsalm-area-guide-attractions-restaurants-activities.html': {
        nl: null,
        fr: null
    },
    'corporate-offsite-venue-belgium-focused-work-retreats.html': {
        nl: null,
        fr: null
    },
    'indoor-outdoor-pool-accommodation-belgium-large-groups.html': {
        nl: null,
        fr: null
    },
    'best-time-visit-belgian-ardennes-seasonal-guide.html': {
        nl: null,
        fr: null
    },
    // Dutch -> English -> French
    'landhuis-vs-hotel-vs-airbnb-grote-groepen-belgie.html': {
        en: 'manor-vs-hotel-vs-airbnb-large-groups-belgium.html',
        fr: null
    },
    'hoeveel-kost-landhuis-huren-40-mensen-belgie.html': {
        en: 'how-much-cost-rent-manor-40-people-belgium.html',
        fr: null
    },
    'grote-groep-accommodatie-40-gasten-belgische-ardennen.html': {
        en: 'large-group-accommodation-guide-40-guests-belgian-ardennes.html',
        fr: 'guide-hebergement-grand-groupe-40-invites-ardennes-belges.html'
    },
    // French -> English -> Dutch
    'planning-retraite-entreprise-ardennes-belges.html': {
        en: 'planning-perfect-corporate-retreat-belgian-ardennes.html',
        nl: 'bedrijfsuitje-planning-belgische-ardennen.html'
    },
    'guide-hebergement-grand-groupe-40-invites-ardennes-belges.html': {
        en: 'large-group-accommodation-guide-40-guests-belgian-ardennes.html',
        nl: 'grote-groep-accommodatie-40-gasten-belgische-ardennen.html'
    },
    'combien-coute-louer-manoir-40-personnes-belgique.html': {
        en: 'how-much-cost-rent-manor-40-people-belgium.html',
        nl: 'hoeveel-kost-landhuis-huren-40-mensen-belgie.html'
    },
    'salles-bain-privees-guide-hebergement-grand-groupe-belgique.html': {
        en: 'private-bathrooms-guide-large-group-accommodation-belgium.html',
        nl: 'eigen-badkamers-grote-groep-accommodatie-belgie.html'
    },
    'manoir-vs-hotel-vs-airbnb-grands-groupes-belgique.html': {
        en: 'manor-vs-hotel-vs-airbnb-large-groups-belgium.html',
        nl: 'landhuis-vs-hotel-vs-airbnb-grote-groepen-belgie.html'
    },
    'eigen-badkamers-grote-groep-accommodatie-belgie.html': {
        en: 'private-bathrooms-guide-large-group-accommodation-belgium.html',
        fr: 'salles-bain-privees-guide-hebergement-grand-groupe-belgique.html'
    },
    'hoeveel-kost-landhuis-huren-40-mensen-belgie.html': {
        en: 'how-much-cost-rent-manor-40-people-belgium.html',
        fr: 'combien-coute-louer-manoir-40-personnes-belgique.html'
    },
    'landhuis-vs-hotel-vs-airbnb-grote-groepen-belgie.html': {
        en: 'manor-vs-hotel-vs-airbnb-large-groups-belgium.html',
        fr: 'manoir-vs-hotel-vs-airbnb-grands-groupes-belgique.html'
    }
};

function getCurrentPostFilename() {
    const path = window.location.pathname;
    const filename = path.split('/').pop();
    return filename;
}

function getLanguageVersion(lang) {
    const currentFile = getCurrentPostFilename();
    const map = blogLanguageMap[currentFile];
    
    if (!map) return null;
    return map[lang] || null;
}

function switchBlogLanguage(lang) {
    const targetFile = getLanguageVersion(lang);
    
    if (!targetFile) {
        // If no translation exists, show message or redirect to blog index
        alert(`Deze post is nog niet beschikbaar in ${lang === 'nl' ? 'Nederlands' : lang === 'fr' ? 'Frans' : 'English'}.`);
        return;
    }
    
    // Redirect to the language version
    window.location.href = targetFile;
}

// Initialize language switcher
document.addEventListener('DOMContentLoaded', function() {
    const currentFile = getCurrentPostFilename();
    const langSwitcher = document.getElementById('blog-lang-switcher');
    
    if (!langSwitcher) return;
    
    // Determine current language from filename or HTML lang attribute
    const htmlLang = document.documentElement.lang || 'en';
    let currentLang = 'en';
    
    if (htmlLang === 'nl' || currentFile.includes('belgie') || currentFile.includes('belgische') || currentFile.includes('grote-groep') || currentFile.includes('hoeveel-kost') || currentFile.includes('landhuis')) {
        currentLang = 'nl';
    } else if (htmlLang === 'fr' || currentFile.includes('belgique') || currentFile.includes('manoir')) {
        currentLang = 'fr';
    }
    
    // Update active button
    const buttons = langSwitcher.querySelectorAll('.blog-lang-btn');
    buttons.forEach(btn => {
        if (btn.dataset.lang === currentLang) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
        
        // Add click handler
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const targetLang = this.dataset.lang;
            if (targetLang !== currentLang) {
                switchBlogLanguage(targetLang);
            }
        });
    });
});
