# Netlify Deployment & Git Integration Guide

**Current Deployment:** [https://priesmont.netlify.app/](https://priesmont.netlify.app/)

---

## Step 1: Initialize Git Repository (If Not Done)

The repository has been initialized. Now you need to:

```bash
cd /Users/paco.puylaert/Desktop/Priesmont

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: Priesmont website"

# Check status
git status
```

---

## Step 2: Create GitHub Repository

1. **Go to GitHub:**
   - Visit [github.com](https://github.com)
   - Sign in to your account

2. **Create New Repository:**
   - Click the "+" icon → "New repository"
   - Repository name: `priesmont-website` (or your preferred name)
   - Description: "Priesmont luxury manor rental website"
   - Choose: **Public** or **Private**
   - **DO NOT** initialize with README, .gitignore, or license (we already have these)
   - Click "Create repository"

3. **Copy the repository URL** (you'll need it in the next step)

---

## Step 3: Connect Local Git to GitHub

```bash
cd /Users/paco.puylaert/Desktop/Priesmont

# Add GitHub as remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/priesmont-website.git

# Or if using SSH:
# git remote add origin git@github.com:YOUR_USERNAME/priesmont-website.git

# Push to GitHub
git branch -M main
git push -u origin main
```

---

## Step 4: Connect GitHub to Netlify

### Option A: Via Netlify Dashboard (Recommended)

1. **Log in to Netlify:**
   - Go to [app.netlify.com](https://app.netlify.com)
   - Sign in with your account

2. **Add New Site:**
   - Click "Add new site" → "Import an existing project"
   - Choose "GitHub" as your Git provider
   - Authorize Netlify to access your GitHub (if first time)
   - Select your repository: `priesmont-website`

3. **Configure Build Settings:**
   - **Build command:** Leave empty (static site, no build needed)
   - **Publish directory:** `.` (root directory)
   - Click "Deploy site"

4. **Site Settings:**
   - Netlify will automatically deploy your site
   - Your site URL will be: `https://priesmont.netlify.app/` (or similar)
   - You can change the site name in: Site settings → General → Site details

### Option B: Via Netlify CLI

```bash
# Install Netlify CLI (if not installed)
npm install -g netlify-cli

# Login to Netlify
netlify login

# Initialize Netlify in your project
cd /Users/paco.puylaert/Desktop/Priesmont
netlify init

# Follow the prompts:
# - Create & configure a new site
# - Choose your team
# - Site name: priesmont (or your preferred name)
# - Build command: (leave empty, press Enter)
# - Directory to deploy: . (press Enter)

# Deploy
netlify deploy --prod
```

---

## Step 5: Configure Continuous Deployment

Once connected, Netlify will automatically:

1. **Deploy on every push** to the main branch
2. **Create preview deployments** for pull requests
3. **Show deployment status** in GitHub

### To verify it's working:

1. Make a small change to a file
2. Commit and push:
   ```bash
   git add .
   git commit -m "Test deployment"
   git push
   ```
3. Check Netlify dashboard - you should see a new deployment starting

---

## Step 6: Custom Domain Setup (Optional)

If you want to use `priesmont.com` instead of `priesmont.netlify.app`:

1. **In Netlify Dashboard:**
   - Go to: Site settings → Domain management
   - Click "Add custom domain"
   - Enter: `priesmont.com`

2. **Configure DNS:**
   - Netlify will provide DNS records
   - Add these records to your domain registrar:
     - Type: `A` or `CNAME`
     - Value: Provided by Netlify

3. **SSL Certificate:**
   - Netlify automatically provisions SSL certificates
   - Wait for DNS propagation (can take up to 48 hours)

---

## Step 7: Environment Variables (If Needed)

If you need to add environment variables (e.g., API keys):

1. **In Netlify Dashboard:**
   - Go to: Site settings → Environment variables
   - Click "Add variable"
   - Add your variables (e.g., `META_PIXEL_ID`, `LODGIFY_API_KEY`)

2. **Update your code** to use environment variables:
   ```javascript
   // In meta-pixel-config.js
   const META_PIXEL_ID = process.env.META_PIXEL_ID || 'YOUR_PIXEL_ID_HERE';
   ```

**Note:** For static sites, environment variables are injected at build time. Since we're not building, you may need to keep config in files (but add them to `.gitignore`).

---

## Troubleshooting

### Git Not Connected
```bash
# Check if remote is set
git remote -v

# If not set, add it:
git remote add origin https://github.com/YOUR_USERNAME/priesmont-website.git
```

### Netlify Not Deploying
- Check Netlify dashboard → Deploys → Check for errors
- Verify build settings are correct (no build command needed)
- Check that publish directory is `.`

### Files Not Updating
- Make sure you've committed and pushed to GitHub
- Check Netlify dashboard for deployment status
- Clear browser cache

---

## Current Status

✅ **Git Repository:** Initialized  
✅ **Netlify Configuration:** `netlify.toml` created  
⏳ **GitHub Repository:** Needs to be created  
⏳ **Netlify Connection:** Needs to be connected  

---

## Quick Commands Reference

```bash
# Check Git status
git status

# Add all changes
git add .

# Commit changes
git commit -m "Your commit message"

# Push to GitHub
git push

# Check Netlify status (if CLI installed)
netlify status
```

---

## Next Steps

1. ✅ Git repository initialized
2. ⏳ Create GitHub repository
3. ⏳ Push code to GitHub
4. ⏳ Connect GitHub to Netlify
5. ⏳ Verify automatic deployments work
6. ⏳ (Optional) Set up custom domain

---

**Need Help?**
- [Netlify Documentation](https://docs.netlify.com/)
- [GitHub Documentation](https://docs.github.com/)
- [Netlify Support](https://www.netlify.com/support/)

