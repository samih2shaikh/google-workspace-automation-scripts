/**
 * Gmail → WhatsApp VIP Alerts
 * Sends a WhatsApp template message when matching emails arrive.
 */
const WA = {
  // === OPTIONAL FILTERS ===
  SENDER_EMAIL: '',          // e.g., 'ceo@company.com'
  SUBJECT_CONTAINS: '',      // e.g., 'urgent'
  GMAIL_LABEL: '',           // e.g., 'VIP'
  NEWER_THAN_DAYS: 3,        // limit to recent messages

  // === BEHAVIOR ===
  PROCESSED_LABEL: 'wa_notified',
  DRY_RUN: true,
  BATCH: 20,

  // === ADVANCED ===
  QUERY_OVERRIDE: '',        // full Gmail query if you want to skip the builder
};

function notifyWhatsAppOnNewEmail() {
  // Load secrets from Script Properties
  const props = PropertiesService.getScriptProperties();
  const token = props.getProperty('WHATSAPP_TOKEN');
  const phoneId = props.getProperty('PHONE_NUMBER_ID');
  const to = props.getProperty('WHATSAPP_TO');
  const templateName = props.getProperty('WA_TEMPLATE');

  if (!token || !phoneId || !to || !templateName) {
    throw new Error('Missing WhatsApp config in Script Properties: WHATSAPP_TOKEN, PHONE_NUMBER_ID, WHATSAPP_TO, WA_TEMPLATE');
  }

  const processed = GmailApp.getUserLabelByName(WA.PROCESSED_LABEL) || GmailApp.createLabel(WA.PROCESSED_LABEL);
  const query = WA.QUERY_OVERRIDE && WA.QUERY_OVERRIDE.trim()
    ? WA.QUERY_OVERRIDE.trim()
    : buildWAQuery_();

  const threads = GmailApp.search(query, 0, WA.BATCH);
  if (!threads.length) {
    console.log('No matching threads. Query:', query);
    return;
  }

  threads.forEach(thread => {
    // Skip if already notified
    if (thread.getLabels().some(l => l.getName() === WA.PROCESSED_LABEL)) return;

    const msg = thread.getMessages().pop();
    const payload = buildTemplatePayload_(to, templateName, [
      truncate_(msg.getFrom(), 60),
      truncate_(msg.getSubject(), 80)
    ]);

    if (WA.DRY_RUN) {
      console.log('DRY_RUN WhatsApp payload:', JSON.stringify(payload));
    } else {
      const url = `https://graph.facebook.com/v19.0/${phoneId}/messages`;
      const res = UrlFetchApp.fetch(url, {
        method: 'post',
        contentType: 'application/json',
        payload: JSON.stringify(payload),
        headers: { Authorization: `Bearer ${token}` },
        muteHttpExceptions: true
      });
      console.log('WA response', res.getResponseCode(), res.getContentText());
      thread.addLabel(processed);
    }
  });
}

function buildWAQuery_() {
  const parts = [];
  if (WA.SENDER_EMAIL) parts.push(`from:${sanitizeEmail_(WA.SENDER_EMAIL)}`);
  if (WA.SUBJECT_CONTAINS) parts.push(`subject:"${WA.SUBJECT_CONTAINS.replace(/"/g, '\\"')}"`);
  if (WA.GMAIL_LABEL) parts.push(`label:${quoteIfSpace_(WA.GMAIL_LABEL)}`);
  if (WA.NEWER_THAN_DAYS && Number(WA.NEWER_THAN_DAYS) > 0) {
    parts.push(`newer_than:${Number(WA.NEWER_THAN_DAYS)}d`);
  }
  // Always exclude already-notified threads
  parts.push(`-label:${WA.PROCESSED_LABEL}`);
  const q = parts.join(' ');
  console.log('Built query:', q);
  return q;
}

function buildTemplatePayload_(to, templateName, bodyParams) {
  return {
    messaging_product: 'whatsapp',
    to,
    type: 'template',
    template: {
      name: templateName,
      language: { code: 'en_US' },
      components: [{
        type: 'body',
        parameters: bodyParams.map(t => ({ type: 'text', text: t }))
      }]
    }
  };
}

function truncate_(s, n) { return (s || '').toString().substring(0, n); }
function sanitizeEmail_(s) { return (s || '').toString().trim(); }
function quoteIfSpace_(s) {
  const t = (s || '').toString().trim();
  return /\s/.test(t) ? `"${t.replace(/"/g, '\\"')}"` : t;
}

/** One-time: install scheduled trigger */
function installWhatsAppTrigger() {
  ScriptApp.newTrigger('notifyWhatsAppOnNewEmail')
    .timeBased()
    .everyMinutes(2)
    .create();
}
