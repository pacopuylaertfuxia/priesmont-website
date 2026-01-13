# Contact Form Email Setup

The contact form is now configured to send emails to **paco.puy.pp@gmail.com** via a Vercel serverless function.

## Quick Setup (Using Resend - Recommended)

### Step 1: Create a Resend Account
1. Go to https://resend.com
2. Sign up for a free account (free tier: 3,000 emails/month)
3. Verify your email

### Step 2: Get Your API Key
1. In Resend dashboard, go to **API Keys**
2. Click **Create API Key**
3. Name it (e.g., "Priesmont Contact Form")
4. Copy the API key (starts with `re_...`)

### Step 3: Add Domain (Optional but Recommended)
1. In Resend dashboard, go to **Domains**
2. Add your domain (e.g., `priesmont.com` or your Vercel domain)
3. Follow the DNS setup instructions
4. Wait for verification (usually a few minutes)

**Note:** For testing, you can use Resend's default domain, but you'll need to add your domain for production.

### Step 4: Set Environment Variables in Vercel
1. Go to your Vercel project dashboard: https://vercel.com/dashboard
2. Select your Priesmont project
3. Click **Settings** → **Environment Variables**
4. Click **Add New**
5. Add the API key:

   **Variable Name:** `RESEND_API_KEY`  
   **Value:** `re_7QVM8CLp_N2DihqX1NhF8kv7S7rKLZTGh` (your Resend API key)  
   **Environment:** Select all three: Production, Preview, Development  
   Click **Save**

   **Optional - Variable Name:** `RESEND_FROM_EMAIL`  
   **Value:** `onboarding@resend.dev` (for testing) or your verified domain email  
   **Environment:** Select all three  
   Click **Save**

   **Note:** For testing, you can use `onboarding@resend.dev` as the FROM email. For production, you'll want to add and verify your own domain in Resend.

### Step 5: Redeploy
After adding environment variables:
1. Go to **Deployments** in Vercel
2. Click the **...** menu on the latest deployment
3. Click **Redeploy**

Or simply push a new commit to trigger a new deployment.

## Testing

1. Visit your website
2. Go to the Contact section
3. Fill out and submit the form
4. Check your email at **paco.puy.pp@gmail.com**
5. You should receive the contact form submission

## Email Format

You'll receive emails with:
- **Subject:** "New Contact Form Submission from [Name]"
- **From:** The email address you configured (or the form submitter's email as reply-to)
- **To:** paco.puy.pp@gmail.com
- **Content:** Name, email, check-in date (if provided), number of guests (if provided), message (if provided)

## Troubleshooting

### Emails not arriving?

1. **Check Vercel Function Logs:**
   - Go to Vercel dashboard → Your project → **Functions** tab
   - Check the `/api/contact` function logs
   - Look for any error messages

2. **Check Resend Dashboard:**
   - Go to Resend dashboard → **Emails**
   - Check if emails are being sent
   - Check for any bounces or failures

3. **Verify Environment Variables:**
   - Make sure `RESEND_API_KEY` is set correctly in Vercel
   - Make sure the API key is active in Resend

4. **Check Spam Folder:**
   - Emails might be in spam/junk folder

### Using a Different Email Service?

If you prefer a different service:

**Option A: SendGrid**
- Similar setup, uses `SENDGRID_API_KEY`
- Update `/api/contact.js` to use SendGrid API

**Option B: Nodemailer with Gmail SMTP**
- Requires Gmail App Password
- More complex setup

**Option C: AWS SES**
- Good for high volume
- Requires AWS account setup

## Development Mode

If you're testing locally without setting up Resend, the function will:
- Log the email content to the console
- Return success (so the form works)
- But won't actually send emails

This allows you to develop locally without needing email service credentials.

## Production

For production, make sure:
1. ✅ Resend API key is set in Vercel environment variables
2. ✅ Domain is verified in Resend (or use Resend's default domain for testing)
3. ✅ `RESEND_FROM_EMAIL` matches your verified domain
4. ✅ Test the form to ensure emails are being received
