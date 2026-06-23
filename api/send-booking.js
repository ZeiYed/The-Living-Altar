// Vercel serverless function — sends two emails via Resend:
//   1. Confirmation + PDF to the participant
//   2. Booking notification to the organiser
//
// Environment variables required (set in Vercel dashboard):
//   RESEND_API_KEY  — your Resend API key
//   FROM_EMAIL      — verified sender, e.g. "the Living Altar <bookings@thelivingaltar.com>"

module.exports = async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).end();

    const key  = process.env.RESEND_API_KEY;
    const from = process.env.FROM_EMAIL || 'the Living Altar <bookings@thelivingaltar.com>';

    if (!key) {
        console.error('RESEND_API_KEY is not set');
        return res.status(500).json({ success: false, error: 'Server misconfiguration' });
    }

    const {
        name, email, phone, whatsapp,
        country, residency, room, occupancy,
        bedConfig, price, dietary, health,
        signature, signedDate, pdfBase64,
    } = req.body || {};

    if (!email || !name || !pdfBase64) {
        return res.status(400).json({ success: false, error: 'Missing required fields' });
    }

    const sendEmail = (payload) =>
        fetch('https://api.resend.com/emails', {
            method:  'POST',
            headers: {
                'Authorization': `Bearer ${key}`,
                'Content-Type':  'application/json',
            },
            body: JSON.stringify(payload),
        });

    // ── 1. Participant confirmation email ─────────────────────────────
    const firstName = (name || '').split(' ')[0];
    const participantHtml = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#F3EDE4;font-family:Georgia,'Times New Roman',serif;">
  <div style="max-width:560px;margin:40px auto;">

    <div style="text-align:center;padding:32px 0 24px;">
      <img src="https://the-living-altar.vercel.app/images/logo.png" alt="The Living Altar" width="160" style="display:inline-block;max-width:160px;">
    </div>

    <div style="background:#ffffff;padding:52px 44px;border-radius:3px;">

    <h1 style="margin:0 0 20px;font-size:26px;font-weight:normal;color:#4A2B08;line-height:1.3;">Dear ${firstName},<br>welcome to the Living Altar, Portugal retreat.</h1>

    <p style="margin:0 0 20px;font-size:15px;color:#8a7060;line-height:1.9;">
      We are deeply glad to receive your request and to welcome you into the circle. The Living Altar is a five-day journey of sound, ritual, and presence — and we are honoured you are choosing to be part of it.
    </p>

    <p style="margin:0 0 32px;font-size:15px;color:#8a7060;line-height:1.9;">
      Your booking request for <span style="color:#4A2B08;font-style:italic;">${room || ''}</span> has been received and is attached to this email as a PDF for your records as well as your booking agreement.
    </p>

    <div style="border-top:1px solid #E7DDD0;border-bottom:1px solid #E7DDD0;padding:28px 0;margin:0 0 32px;">
      <table style="width:100%;border-collapse:collapse;font-family:Helvetica,Arial,sans-serif;">
        ${row('ROOM',              room || '—')}
        ${row('OCCUPANCY',         occupancy || '—')}
        ${bedConfig ? row('BED CONFIGURATION', bedConfig) : ''}
        ${row('INVESTMENT',        price || '—')}
        ${row('DATES',             'August 13–17, 2026')}
        ${row('LOCATION',          'Casa Prema, Portugal')}
        ${row('REQUEST SUBMITTED', signedDate || '—')}
      </table>
    </div>

    <p style="margin:0 0 20px;font-size:15px;color:#8a7060;line-height:1.9;">
      We will be in touch within 48 hours to confirm your place and share the payment link.
    </p>

    <p style="margin:0 0 40px;font-size:15px;color:#8a7060;line-height:1.9;">
      If you have any questions in the meantime, simply reply to this email — we are here and happy to support you in any way we can.
    </p>

    <p style="margin:0 0 8px;font-size:15px;color:#4A2B08;line-height:1.9;">With love and gratitude,</p>
    <p style="margin:0 0 40px;font-size:15px;color:#4A2B08;font-style:italic;">The Living Altar Family 🌿</p>

    <p style="margin:0;font-size:11px;color:#B4A28F;line-height:2;font-family:Helvetica,Arial,sans-serif;border-top:1px solid #E7DDD0;padding-top:24px;">
      August 13–17, 2026 &nbsp;·&nbsp; Casa Prema, Sintra, Portugal
    </p>

    </div>
  </div>
</body>
</html>`;

    // ── 2. Organiser notification email ───────────────────────────────
    const organizerHtml = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#F3EDE4;font-family:Helvetica,Arial,sans-serif;">
  <div style="max-width:620px;margin:40px auto;background:#ffffff;padding:44px;border-radius:3px;">

    <p style="margin:0 0 8px;font-size:10px;letter-spacing:2.5px;color:#B36D32;">NEW BOOKING REQUEST</p>
    <h2 style="margin:0 0 16px;font-size:20px;font-weight:normal;color:#4A2B08;font-family:Georgia,serif;">${name || ''} — ${room || ''}</h2>
    <p style="margin:0 0 32px;padding:12px 16px;background:#fff8f0;border-left:3px solid #B36D32;font-size:13px;color:#4A2B08;">Forward confirmation to: <a href="mailto:${email}" style="color:#B36D32;">${email}</a> — PDF attached</p>

    <table style="width:100%;border-collapse:collapse;font-size:14px;">
      ${orgRow('Full Name',            name)}
      ${orgRow('Email',                email)}
      ${orgRow('Phone',                phone)}
      ${orgRow('WhatsApp',             whatsapp || phone)}
      ${orgRow('Nationality',          country)}
      ${orgRow('Country of Residency', residency)}
      ${orgRow('Room',                 room)}
      ${orgRow('Occupancy',            occupancy)}
      ${bedConfig ? orgRow('Bed Configuration', bedConfig) : ''}
      ${orgRow('Price',                price)}
      ${orgRow('Dietary Requirements', dietary || 'None stated')}
      ${orgRow('Health Notes',         health  || 'None stated')}
      ${orgRow('Signature',            signature)}
      ${orgRow('Submitted',            signedDate)}
    </table>

  </div>
</body>
</html>`;

    try {
        const [r1, r2] = await Promise.all([
            // Participant confirmation — forward this to the participant
            sendEmail({
                from,
                to:          ['uxumusica@gmail.com'],
                reply_to:    email,
                subject:     `FORWARD TO ${email} — Booking Confirmation — ${firstName}`,
                html:        participantHtml,
                attachments: [{ filename: 'Living-Altar-Booking-Request.pdf', content: pdfBase64 }],
            }),
            // Organiser notification
            sendEmail({
                from,
                to:      ['uxumusica@gmail.com'],
                subject: `New Booking Request — ${room} — ${name}`,
                html:    organizerHtml,
            }),
        ]);

        if (!r1.ok || !r2.ok) {
            const e1 = !r1.ok ? await r1.text() : null;
            const e2 = !r2.ok ? await r2.text() : null;
            console.error('Resend error (confirmation):', e1);
            console.error('Resend error (organiser):',   e2);
            return res.status(500).json({ success: false });
        }

        return res.status(200).json({ success: true });

    } catch (err) {
        console.error('send-booking error:', err.message);
        return res.status(500).json({ success: false, error: err.message });
    }
};

// ── Email template helpers ────────────────────────────────────────────
function row(label, value) {
    return `
      <tr>
        <td style="padding:8px 0;font-size:10px;letter-spacing:1.5px;color:#B4A28F;vertical-align:top;">${label}</td>
        <td style="padding:8px 0;font-size:14px;color:#4A2B08;text-align:right;font-family:Georgia,serif;">${value || '—'}</td>
      </tr>`;
}

function orgRow(label, value) {
    return `
      <tr style="border-bottom:1px solid #F3EDE4;">
        <td style="padding:10px 12px 10px 0;color:#B4A28F;white-space:nowrap;font-size:12px;vertical-align:top;">${label}</td>
        <td style="padding:10px 0;color:#4A2B08;font-size:14px;">${value || '—'}</td>
      </tr>`;
}
