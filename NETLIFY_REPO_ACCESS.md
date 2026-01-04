# Netlify Repository Access - Troubleshooting

Netlify is installed, but the repository might not be visible. Here's how to fix it:

## Option 1: Configure Repository Access in GitHub

1. **On the Netlify installation page you're viewing:**
   - Look for a "Configure" or "Repository access" button
   - Click it to manage which repositories Netlify can access

2. **Select repositories:**
   - Choose "Only select repositories"
   - Add `priesmont-website` to the list
   - Or choose "All repositories" (if you're comfortable with that)

3. **Save the changes**

4. **Go back to Netlify** and search again

## Option 2: Try Direct Link

Go directly to:
```
https://app.netlify.com/start/repos/pacopuylaertfuxia/priesmont-website
```

## Option 3: Manual Import in Netlify

1. In Netlify dashboard, click "Add new site"
2. Choose "Deploy manually" (instead of "Import from Git")
3. Drag and drop your project folder
4. This will deploy without Git connection (but won't auto-update)

## Option 4: Check Repository Visibility

Make sure the repository is:
- Visible to you (not private to another user)
- Actually exists at: https://github.com/pacopuylaertfuxia/priesmont-website

---

**Quick Check:** Can you see the repository at https://github.com/pacopuylaertfuxia/priesmont-website in your browser?

