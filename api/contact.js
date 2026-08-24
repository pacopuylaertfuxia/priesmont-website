/**
 * Contact Form API Endpoint (Vercel Serverless Function)
 *
 * Receives booking enquiries from the contact form and emails them via Resend.
 *
 * Required Vercel environment variables:
 *   RESEND_API_KEY    - API key from resend.com
 *   RESEND_FROM_EMAIL - verified sender, e.g. "Priesmont <enquiries@priesmont.com>"
 *                       (falls back to onboarding@resend.dev for testing)
 *
 * Returns 503 when the mail service is not configured, so the front end can
 * fall back to mailto: rather than silently reporting success.
 */

const TO_EMAILS = ['carlpuylaert@hotmail.com', 'paco.puy.pp@gmail.com'];
const ALLOWED_ORIGINS = [
    'https://www.priesmont.com',
    'https://priesmont.com'
];

function escapeHtml(value) {
    return String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

export default async function handler(req, res) {
    const origin = req.headers.origin;
    if (ALLOWED_ORIGINS.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    }
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(204).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
        const { name, email, checkin, checkout, guests, hearAbout, message, website } = body;

        // Honeypot: real users never fill a hidden field. Report success so bots
        // do not learn they were rejected.
        if (website) {
            return res.status(200).json({ success: true });
        }

        if (!name || !email) {
            return res.status(400).json({ error: 'Name and email are required' });
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return res.status(400).json({ error: 'Invalid email format' });
        }

        const RESEND_API_KEY = process.env.RESEND_API_KEY;
        if (!RESEND_API_KEY) {
            console.error('Contact form: RESEND_API_KEY is not set');
            return res.status(503).json({ error: 'Mail service not configured' });
        }

        const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'Priesmont <onboarding@resend.dev>';

        const rows = [
            ['Name', name],
            ['Email', email],
            ['Check-in', checkin],
            ['Check-out', checkout],
            ['Guests', guests],
            ['Heard about us via', hearAbout],
            ['Message', message]
        ].filter(function (row) { return row[1]; });

        const text = rows.map(function (row) { return row[0] + ': ' + row[1]; }).join('\n') +
            '\n\n---\nSubmitted from: ' + (req.headers.referer || 'priesmont.com') +
            '\nTimestamp: ' + new Date().toISOString();

        const html = '<h2>New booking enquiry</h2><table cellpadding="6">' +
            rows.map(function (row) {
                return '<tr><td><strong>' + escapeHtml(row[0]) + '</strong></td><td>' +
                    escapeHtml(row[1]).replace(/\n/g, '<br>') + '</td></tr>';
            }).join('') +
            '</table>';

        const response = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + RESEND_API_KEY
            },
            body: JSON.stringify({
                from: FROM_EMAIL,
                to: TO_EMAILS,
                reply_to: email,
                subject: 'Booking enquiry from ' + name + ' — Priesmont',
                text: text,
                html: html
            })
        });

        if (!response.ok) {
            const detail = await response.text();
            console.error('Resend API error:', response.status, detail);
            return res.status(502).json({ error: 'Failed to send enquiry' });
        }

        const data = await response.json();
        return res.status(200).json({ success: true, id: data.id });

    } catch (error) {
        console.error('Contact form error:', error);
        return res.status(500).json({ error: 'Failed to send message' });
    }
}
