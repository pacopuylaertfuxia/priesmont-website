/**
 * Priesmont — enquiry mailer (Google Apps Script web app)
 *
 * api/contact.js POSTs each website enquiry here; this sends it from the owner's
 * Gmail to the fixed RECIPIENTS (reply goes straight to the guest) and sends the
 * guest a short confirmation. A mistyped guest address bounces back to this Gmail.
 *
 * Recipients are fixed here, never taken from the request, so a leaked URL cannot
 * be used to mail arbitrary people beyond the one confirmation.
 *
 * Set up (once):
 *   script.google.com -> New project -> paste this file -> fill SECRET
 *   Deploy -> New deployment -> type: Web app -> Execute as: Me -> Who has access: Anyone
 *   -> Deploy -> Authorise -> copy the Web app URL
 *   Vercel (priesmont): ENQUIRY_WEBHOOK_URL = that URL, ENQUIRY_WEBHOOK_SECRET = SECRET
 */

var SECRET = 'PASTE_SECRET_HERE';
var RECIPIENTS = 'carlpuylaert@hotmail.com,paco.puy.pp@gmail.com';
var CONFIRM_REPLY_TO = 'carlpuylaert@hotmail.com';

function doPost(e) {
  try {
    var d = JSON.parse(e.postData.contents);
    if (d.secret !== SECRET) return json({ ok: false, error: 'unauthorized' });

    MailApp.sendEmail({
      to: RECIPIENTS,
      replyTo: d.guestEmail,
      name: 'Priesmont website',
      subject: d.subject,
      body: d.text,
      htmlBody: d.html
    });

    if (d.confirmSubject && d.confirmText) {
      MailApp.sendEmail({
        to: d.guestEmail,
        replyTo: CONFIRM_REPLY_TO,
        name: 'Domaine de Priesmont',
        subject: d.confirmSubject,
        body: d.confirmText
      });
    }
    return json({ ok: true, quotaLeft: MailApp.getRemainingDailyQuota() });
  } catch (err) {
    console.error(err);
    return json({ ok: false, error: String(err) });
  }
}

function json(o) {
  return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
}
