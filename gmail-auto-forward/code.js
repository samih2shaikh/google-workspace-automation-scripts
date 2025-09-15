/**
 * Gmail → Auto-forward Emails
 * Forwards messages matching filters to configured recipients.
 */
const FW = {
  // === REQUIRED ===
  FORWARD_TO: ['recipient1@example.com', 'recipient2@example.com'],

  // === OPTIONAL FILTERS ===
  SENDER_EMAIL: '',          // e.g., 'boss@company.com'
  SUBJECT_CONTAINS: '',      // e.g., 'Invoice'
  GMAIL_LABEL: '',           // e.g., 'Finance'
  NEWER_THAN_DAYS: 7,        // e.g., only last 7 days

  // === BEHAVIOR ===
  PROCESSED_LABEL: 'fw_processed',
  DRY_RUN: true,
  BATCH: 20,

  // === ADVANCED ===
  QUERY_OVERRIDE: '',        // if set, skip builder and use this exact Gmail query
};

function forwardMatchingEmails() {
  const processed = GmailApp.getUserLabelByName(FW.PROCESSED_LABEL) || GmailApp.createLabel(FW.PROCESSED_LABEL);

  const query = FW.QUERY_OVERRIDE && FW.QUERY_OVERRIDE.trim()
    ? FW.QUERY_OVERRIDE.trim()
    : buildForwardQuery_();

  const threads = GmailApp.search(query, 0, FW.BATCH);
  if (!threads.length) {
    console.log('No matching threads. Query:', query);
    return;
  }

  threads.forEach(thread => {
    if (thread.getLabels().some(l => l.getName() === FW.PROCESSED_LABEL)) return;

    const msg = thread.getMessages().pop(); // forward latest message

    if (FW.DRY_RUN) {
      console.log('DRY_RUN would forward:', msg.getSubject());
    } else {
      FW.FORWARD_TO.forEach(addr => {
        msg.forward(addr, { htmlBody: msg.getBody() });
      });
      thread.addLabel(processed);
      console.log('Forwarded + labeled:', msg.getSubject());
    }
  });
}

function buildForwardQuery_() {
  const parts = [];

  if (FW.SENDER_EMAIL) parts.push(`from:${sanitizeEmail_(FW.SENDER_EMAIL)}`);
  if (FW.SUBJECT_CONTAINS) parts.push(`subject:"${FW.SUBJECT_CONTAINS.replace(/"/g, '\\"')}"`);
  if (FW.GMAIL_LABEL) parts.push(`label:${quoteIfSpace_(FW.GMAIL_LABEL)}`);
  if (FW.NEWER_THAN_DAYS && Number(FW.NEWER_THAN_DAYS) > 0) {
    parts.push(`newer_than:${Number(FW.NEWER_THAN_DAYS)}d`);
  }

  // Always exclude already processed
  parts.push(`-label:${FW.PROCESSED_LABEL}`);

  const q = parts.join(' ');
  console.log('Built query:', q);
  return q;
}

function sanitizeEmail_(s) {
  return (s || '').toString().trim();
}

function quoteIfSpace_(s) {
  const t = (s || '').toString().trim();
  return /\s/.test(t) ? `"${t.replace(/"/g, '\\"')}"` : t;
}

/** One-time: install trigger */
function installForwardTrigger() {
  ScriptApp.newTrigger('forwardMatchingEmails')
    .timeBased()
    .everyMinutes(5)
    .create();
}
