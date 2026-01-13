/**
 * Contact Form API Endpoint (Vercel Serverless Function)
 * Sends contact form submissions to paco.puy.pp@gmail.com
 */

export default async function handler(req, res) {
    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    // CORS headers for production
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    try {
        const { name, email, checkin, checkout, guests, message } = req.body;

        // Validate required fields
        if (!name || !email) {
            return res.status(400).json({ error: 'Name and email are required' });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: 'Invalid email format' });
        }

        // Prepare email content
        const emailSubject = `New Contact Form Submission from ${name}`;
        const emailBody = `
New contact form submission from Priesmont website:

Name: ${name}
Email: ${email}
${checkin ? `Preferred Check-in Date: ${checkin}` : ''}
${req.body.checkout ? `Preferred Check-out Date: ${req.body.checkout}` : ''}
${guests ? `Number of Guests: ${guests}` : ''}
${message ? `Message:\n${message}` : ''}

---
Submitted via: ${req.headers.referer || 'Priesmont Website'}
IP Address: ${req.headers['x-forwarded-for'] || req.connection.remoteAddress || 'Unknown'}
Timestamp: ${new Date().toISOString()}
        `.trim();

        // Use Resend to send email (recommended for Vercel)
        // You'll need to set RESEND_API_KEY in Vercel environment variables
        const RESEND_API_KEY = process.env.RESEND_API_KEY;
        const TO_EMAIL = 'paco.puy.pp@gmail.com';
        const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'noreply@priesmont.com';

        if (RESEND_API_KEY) {
            // Using Resend service
            const response = await fetch('https://api.resend.com/emails', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${RESEND_API_KEY}`
                },
                body: JSON.stringify({
                    from: FROM_EMAIL,
                    to: TO_EMAIL,
                    reply_to: email,
                    subject: emailSubject,
                    text: emailBody
                })
            });

            if (!response.ok) {
                const error = await response.text();
                console.error('Resend API error:', error);
                throw new Error('Failed to send email via Resend');
            }

            const data = await response.json();
            console.log('Email sent via Resend:', data.id);
            
            return res.status(200).json({ 
                success: true, 
                message: 'Email sent successfully',
                id: data.id
            });
        } else {
            // Fallback: Log to console (for development/testing)
            console.log('=== CONTACT FORM SUBMISSION ===');
            console.log(emailBody);
            console.log('================================');
            
            // In production without Resend, you'd want to set up the API key
            // For now, return success but log that email service isn't configured
            return res.status(200).json({ 
                success: true, 
                message: 'Form received (email service not configured - check server logs)',
                development: true
            });
        }

    } catch (error) {
        console.error('Contact form error:', error);
        return res.status(500).json({ 
            error: 'Failed to send message', 
            message: error.message 
        });
    }
}
