# Vercel Setup Guide for domainedepriesmont.com

This guide will help you connect your custom domain `domainedepriesmont.com` to your existing Vercel project.

## Prerequisites

- ✅ You already have a Vercel project deployed
- Your domain `domainedepriesmont.com` purchased and ready to configure

## Step 1: Update Your Project (Optional)

If you haven't already, make sure your `vercel.json` configuration file is committed to your repository. This ensures proper routing and security headers.

## Step 2: Connect Your Custom Domain

### In Vercel Dashboard:

1. **Go to Your Existing Project**
   - Visit [vercel.com](https://vercel.com) and sign in
   - Click on your existing Priesmont project in the dashboard

2. **Navigate to Settings → Domains**
   - Click "Settings" in the top navigation
   - Click "Domains" in the left sidebar

3. **Add Your Domain**
   - Enter `domainedepriesmont.com` in the domain input field
   - Click "Add"
   - Vercel will also automatically add `www.domainedepriesmont.com` (you can remove it if you don't want it)

4. **Configure DNS Records**
   Vercel will show you the DNS records you need to add. You have two options:

   **Option 1: Use Vercel Nameservers (Easiest)**
   - Vercel will provide nameservers (e.g., `ns1.vercel-dns.com`, `ns2.vercel-dns.com`)
   - Go to your domain registrar (where you bought the domain)
   - Update the nameservers to point to Vercel's nameservers
   - This gives Vercel full control over DNS

   **Option 2: Add DNS Records Manually (More Control)**
   - Keep your current nameservers
   - Add these DNS records at your domain registrar:
     
     **For Root Domain (domainedepriesmont.com):**
     - Type: `A`
     - Name: `@` (or leave blank)
     - Value: `76.76.21.21` (Vercel's IP - check Vercel dashboard for current IP)
     
     **OR use CNAME (if your registrar supports it for root domains):**
     - Type: `CNAME`
     - Name: `@` (or leave blank)
     - Value: `cname.vercel-dns.com.` (note the trailing dot)
     
     **For WWW Subdomain (www.domainedepriesmont.com):**
     - Type: `CNAME`
     - Name: `www`
     - Value: `cname.vercel-dns.com.` (note the trailing dot)

### Common Domain Registrars:

- **GoDaddy**: DNS Management → Add Record
- **Namecheap**: Advanced DNS → Add New Record
- **Google Domains**: DNS → Custom Records
- **Cloudflare**: DNS → Add Record
- **Name.com**: DNS Records → Add Record

## Step 3: Wait for DNS Propagation

- DNS changes can take anywhere from a few minutes to 48 hours to propagate
- Vercel will show the status in the Domains section:
  - ⏳ "Pending" - DNS is being verified
  - ✅ "Valid" - Domain is connected and working
  - ❌ "Invalid" - Check your DNS records

## Step 4: Verify SSL Certificate

- Vercel automatically provisions SSL certificates via Let's Encrypt
- Once DNS is configured, Vercel will automatically set up HTTPS
- This usually takes 5-10 minutes after DNS is valid

## Step 5: Test Your Domain

1. Visit `https://domainedepriesmont.com` in your browser
2. You should see your Priesmont website
3. Check that HTTPS is working (padlock icon in browser)

## Troubleshooting

### Domain Not Working?

1. **Check DNS Records**
   - Use a tool like [whatsmydns.net](https://www.whatsmydns.net) to verify DNS propagation
   - Make sure records match what Vercel shows

2. **Check Vercel Status**
   - Go to your project → Settings → Domains
   - Look for any error messages
   - Click "Refresh" to re-verify DNS

3. **Clear Browser Cache**
   - Try incognito/private browsing mode
   - Clear DNS cache: `sudo dscacheutil -flushcache` (Mac) or restart your router

4. **Wait Longer**
   - DNS can take up to 48 hours to fully propagate globally
   - Most changes happen within 1-2 hours

### SSL Certificate Issues?

- Wait 10-15 minutes after DNS is valid
- Vercel automatically retries SSL certificate generation
- Check Vercel dashboard for SSL status

## Additional Configuration

### Redirect www to non-www (or vice versa)

If you want to redirect `www.domainedepriesmont.com` to `domainedepriesmont.com`:

1. Go to Settings → Domains
2. Click the three dots next to the domain
3. Choose "Redirect" and configure as needed

### Environment Variables

If you need to add environment variables (for API keys, etc.):

1. Go to Settings → Environment Variables
2. Add your variables
3. Redeploy your project

## Next Steps

- ✅ Your site is now live at `domainedepriesmont.com`
- ✅ Automatic HTTPS is enabled
- ✅ Future Git pushes will automatically deploy
- ✅ You can set up custom redirects, headers, and more in `vercel.json`

## Support

- Vercel Documentation: [vercel.com/docs](https://vercel.com/docs)
- Vercel Support: [vercel.com/support](https://vercel.com/support)
