# Fix Netlify Not Seeing Repository

If Netlify can't see your `priesmont-website` repository, it's a permissions issue. Here's how to fix it:

## Step 1: Configure Netlify GitHub App Permissions

1. **Go to GitHub App Settings:**
   - Visit: https://github.com/settings/installations
   - Find "Netlify" in the list
   - Click "Configure" next to it

2. **Check Repository Access:**
   - Look for "Repository access" section
   - It might say "Only select repositories" or "All repositories"
   - Click "Configure" or "Edit" to change it

3. **Add Your Repository:**
   - Select "Only select repositories"
   - Click "Select repositories"
   - Search for `priesmont-website`
   - Check the box next to it
   - Click "Save" or "Update"

## Step 2: Re-authorize Netlify (If Needed)

1. **In Netlify:**
   - Go to: https://app.netlify.com/user/applications
   - Find GitHub integration
   - Click "Edit" or "Reconnect"

2. **Or disconnect and reconnect:**
   - Click "Disconnect" from GitHub
   - Then reconnect and make sure to authorize access to `priesmont-website`

## Step 3: Alternative - Manual Deploy First

If permissions are still an issue, you can deploy manually first:

1. **In Netlify:**
   - Click "Add new site"
   - Choose "Deploy manually" (drag and drop)
   - Drag your project folder
   - This will deploy without Git

2. **Then connect Git later:**
   - After manual deploy, go to Site settings → Build & deploy → Continuous Deployment
   - Click "Link to Git"
   - This might work better than the initial import

## Step 4: Check Repository Visibility

Make sure the repository is actually accessible:
- Visit: https://github.com/pacopuylaertfuxia/priesmont-website
- It should be visible (Public or you can see it)
- If it's private, make sure Netlify has access to private repos

## Step 5: Try Netlify CLI (Alternative Method)

If web interface doesn't work, use CLI:

```bash
# Install Netlify CLI (if not installed)
npm install -g netlify-cli

# Login
netlify login

# Initialize and deploy
cd /Users/paco.puylaert/Desktop/Priesmont
netlify init

# Follow prompts:
# - Create & configure a new site
# - Choose your team
# - Site name: priesmont
# - Build command: (press Enter, leave empty)
# - Directory: . (press Enter)

# Deploy
netlify deploy --prod
```

---

**Most likely fix:** Step 1 - Configure repository access in GitHub App settings.

