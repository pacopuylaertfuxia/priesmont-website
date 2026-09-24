/**
 * Contact Form API Endpoint (Vercel Serverless Function)
 *
 * Receives booking enquiries from the contact form and hands them to the Gmail
 * mailer (apps-scripts/enquiry-mailer.gs), which emails Carl and Paco and sends
 * the guest a confirmation — a mistyped guest address bounces back to that Gmail.
 *
 * Required Vercel environment variables:
 *   ENQUIRY_WEBHOOK_URL    - the mailer's Web app URL
 *   ENQUIRY_WEBHOOK_SECRET - must match SECRET in the mailer
 *
 * Returns 503 when the mailer is not configured, so the front end can fall back
 * to mailto: rather than silently reporting success.
 */

import { forwardClick } from './_dashboard.js';

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
        const { name, email, phone, checkin, checkout, guests, hearAbout, cameFromFirst, cameFromLast, firstSource, lastSource, message, lang, website } = body;

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

        const WEBHOOK_URL = process.env.ENQUIRY_WEBHOOK_URL;
        const WEBHOOK_SECRET = process.env.ENQUIRY_WEBHOOK_SECRET;
        if (!WEBHOOK_URL || !WEBHOOK_SECRET) {
            console.error('Contact form: ENQUIRY_WEBHOOK_URL / ENQUIRY_WEBHOOK_SECRET not set');
            return res.status(503).json({ error: 'Mail service not configured' });
        }

        const rows = [
            ['Name', name],
            ['Email', email],
            ['Phone / WhatsApp', phone],
            ['Check-in', checkin],
            ['Check-out', checkout],
            ['Guests', guests],
            ['Heard about us via', hearAbout],
            ['Came from (first visit)', cameFromFirst],
            ['Came from (this visit)', cameFromLast],
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

        const confirm = confirmation(lang, name, checkin, checkout);
        // Apps Script answers a POST with a 302 to a one-time URL holding its output.
        // Follow it by hand with a plain GET: fetch's automatic redirect gets a 404 there.
        let response = await fetch(WEBHOOK_URL, {
            method: 'POST',
            redirect: 'manual',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                secret: WEBHOOK_SECRET,
                guestEmail: email,
                subject: 'Booking enquiry from ' + name + ' — Priesmont',
                text: text,
                html: html,
                confirmSubject: confirm.subject,
                confirmText: confirm.text
            })
        });

        const location = response.headers.get('location');
        if (response.status >= 300 && response.status < 400 && location) {
            response = await fetch(location);
        }

        const result = await response.json().catch(function () { return null; });
        if (!response.ok || !result || !result.ok) {
            console.error('Enquiry mailer error:', response.status, JSON.stringify(result));
            return res.status(502).json({ error: 'Failed to send enquiry' });
        }

        // Dates let the dashboard match this enquiry to the Lodgify booking Carl creates later.
        await forwardClick({ kind: 'enquiry', arrival: checkin, departure: checkout, adults: guests,
            answer: hearAbout, firstSource: firstSource, lastSource: lastSource, lang: lang });

        return res.status(200).json({ success: true });

    } catch (error) {
        console.error('Contact form error:', error);
        return res.status(500).json({ error: 'Failed to send message' });
    }
}

// Short confirmation in the visitor's site language (en/nl/fr).
function confirmation(lang, name, checkin, checkout) {
    const dates = checkin ? (checkin + (checkout ? ' → ' + checkout : '')) : '';
    const sign = '\n\nCarl & Paco Puylaert\nDomaine de Priesmont · +32 496 86 06 61';
    if (lang === 'nl') {
        return {
            subject: 'We hebben uw aanvraag ontvangen — Domaine de Priesmont',
            text: 'Beste ' + name + ',\n\nBedankt voor uw aanvraag' + (dates ? ' voor ' + dates : '') +
                '. We antwoorden meestal binnen enkele uren. Vragen? Beantwoord gewoon deze e-mail.' + sign
        };
    }
    if (lang === 'fr') {
        return {
            subject: 'Nous avons bien reçu votre demande — Domaine de Priesmont',
            text: 'Bonjour ' + name + ',\n\nMerci pour votre demande' + (dates ? ' pour le ' + dates : '') +
                '. Nous répondons généralement en quelques heures. Une question ? Répondez simplement à cet e-mail.' + sign
        };
    }
    return {
        subject: 'We received your request — Domaine de Priesmont',
        text: 'Dear ' + name + ',\n\nThank you for your request' + (dates ? ' for ' + dates : '') +
            '. We usually reply within a few hours. Any questions? Just reply to this email.' + sign
    };
}
