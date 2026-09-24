/**
 * Forward a Book Now click or an enquiry to the Priesmont Live dashboard, which matches
 * them to Lodgify bookings by date. Underscore prefix: Vercel does not expose this as a route.
 *
 * Env (Vercel project "priesmont"): DASHBOARD_INGEST_URL, DASHBOARD_INGEST_TOKEN.
 * Best effort: never throws, so it can't break the booking or enquiry it rides along with.
 */
const DATE = /^\d{4}-\d{2}-\d{2}$/;
const clip = (v, n) => String(v == null ? '' : v).slice(0, n);

export async function forwardClick(raw) {
    const url = process.env.DASHBOARD_INGEST_URL;
    const token = process.env.DASHBOARD_INGEST_TOKEN;
    if (!url || !token) return false;

    const click = {
        kind: raw.kind === 'enquiry' ? 'enquiry' : 'book_now',
        at: new Date().toISOString(),
        arrival: DATE.test(raw.arrival) ? raw.arrival : '',
        departure: DATE.test(raw.departure) ? raw.departure : '',
        adults: Math.max(0, Math.min(99, Number(raw.adults) || 0)),
        answer: clip(raw.answer, 60),
        firstSource: clip(raw.firstSource, 80),
        lastSource: clip(raw.lastSource, 80),
        lang: clip(raw.lang, 5)
    };
    try {
        const res = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token },
            body: JSON.stringify(click)
        });
        return res.ok;
    } catch (e) {
        console.error('Dashboard forward failed:', e.message);
        return false;
    }
}
