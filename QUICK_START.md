# Quick Start Guide - Priesmont Website

**Current Status:**
- ✅ Website ready for Vercel (static export with `vercel.json`)
- ✅ Git repository initialized
- ⏳ Connect GitHub to Vercel for auto-deploy
- ⏳ Set Vercel project + production domain

---

## 📋 What We've Done

1. ✅ **Created comparison report** - See `COMPARISON_REPORT.md`
2. ✅ **Initialized Git repository**
3. ✅ **Created Vercel configuration** (`vercel.json`)
4. ✅ **Created setup guides**

---

## 🚀 Next Steps (In Order)

### 1. Connect Git to GitHub & Vercel

Quick version:
```bash
# 1. Create GitHub repository (via github.com)
# 2. Connect local repo to GitHub:
git remote add origin https://github.com/YOUR_USERNAME/priesmont-website.git
git branch -M main
git push -u origin main
```

Then in Vercel:
- Create/import a project from GitHub
- Framework: “Other” (static)
- Build command: none
- Output directory: `.`
- Production branch: `main`

Optional:
- Add custom domain (e.g., domainedepriesmont.com) in Vercel
- Set `index.html` as the entry (handled by `vercel.json` rewrite)

---

## 📊 Comparison: Old vs New Site

**See full report:** `COMPARISON_REPORT.md`

### Missing Sections (from priesmont.com):
1. **The Region** - Ardennes region information
2. **Surroundings** - Nearby attractions & activities
3. **Interior** - Interior photos & details
4. **Bedrooms** - Bedroom details
5. **Rates** - Pricing information
6. **Map** - As separate section (we have it in About)

### What We Have (Better):
- ✅ Modern Apple-inspired design
- ✅ Use Cases section (NEW)
- ✅ Embedded Lodgify booking widget
- ✅ Meta Pixel tracking (needs Pixel ID)
- ✅ 50+ gallery images with lightbox
- ✅ Multi-language support (EN, NL, FR)

---

## ⚙️ Configuration Needed

### 1. Meta Pixel (Critical)
- **File:** `meta-pixel-config.js`
- **Action:** Replace `YOUR_PIXEL_ID_HERE` with your actual Pixel ID
- **Guide:** See `META_PIXEL_SETUP.md`

### 2. Lodgify (Needs Testing)
- **Status:** Widget embedded, but needs end-to-end testing
- **Action:** Test booking flow on live site
- **Guide:** See `LODGIFY_SETUP.md`

---

## 📁 Important Files

- `COMPARISON_REPORT.md` - What's missing from old site
- `STATUS_REPORT.md` - Overall status of website, bookings, pixel
- `META_PIXEL_SETUP.md` - Meta Pixel configuration
- `LODGIFY_SETUP.md` - Lodgify integration guide

---

## 🎯 Priority Actions

1. **Connect GitHub to Vercel** (15 min)
   - Import repo in Vercel, set branch to `main`
   - Enables automatic deployments

2. **Configure Meta Pixel** (5 min)
   - Get Pixel ID from Facebook Events Manager
   - Update `meta-pixel-config.js`
   - Test with Pixel Helper extension

3. **Test Lodgify Bookings** (30 min)
   - Test booking flow on live site
   - Verify bookings appear in Lodgify dashboard
   - Test payment processing

4. **Add Missing Sections** (As needed)
   - Review `COMPARISON_REPORT.md`
   - Prioritize which sections to add
   - Gather content and implement

---

## 🔗 Quick Links

- **Live Site:** (add your Vercel or custom domain)
- **Old Site:** [https://priesmont.com/](https://priesmont.com/)
- **Vercel Dashboard:** [https://vercel.com/dashboard](https://vercel.com/dashboard)
- **Facebook Events Manager:** [https://business.facebook.com/events_manager2](https://business.facebook.com/events_manager2)

---

## 📝 Git Commands

```bash
# Check status
git status

# Add all changes
git add .

# Commit
git commit -m "Your message"

# Push to GitHub
git push

# Check remotes
git remote -v
```

---

**Ready to proceed?** Connect GitHub to Vercel and deploy from `main`.





