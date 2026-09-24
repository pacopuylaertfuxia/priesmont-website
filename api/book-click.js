/**
 * Book Now click beacon (tracking/bookClick.js) -> dashboard. See api/_dashboard.js.
 */
import { forwardClick } from './_dashboard.js';

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
    let body = req.body;
    try { if (typeof body === 'string') body = JSON.parse(body); } catch (e) { body = null; }
    // Only Book Now clicks come through here; enquiries are forwarded by api/contact.js
    if (!body || typeof body !== 'object' || body.kind !== 'book_now') return res.status(400).json({ error: 'Bad body' });
    await forwardClick(body);
    return res.status(204).end();
}
