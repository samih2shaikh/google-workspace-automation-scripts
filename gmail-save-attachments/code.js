/**
 * Gmail → Save Attachments to Drive
 * Saves attachments from matching Gmail messages into a Drive folder.
 * Query is built from config for consistency with README/examples.
 */
const AV = {
  // === REQUIRED ===
  DRIVE_FOLDER_ID: 'YOUR_FOLDER_ID_HERE',

  // === OPTIONAL FILTERS (set to '' to ignore) ===
  SENDER_EMAIL: '',          // e.g., 'billing@acme.com'
  SUBJECT_CONTAINS: '',      // e.g., 'invoice'
  GMAIL_LABEL: '',           // e.g., 'Invoices' (label name, not ID)
  NEWER_THAN_DAYS: 30,       // e.g., 7, 14, 30

  // === BEHAVIOR ===
  PROCESSED_LABEL: 'av_processed',
  DRY_RUN: true,
  BATCH: 20,
  EXCLUDE_INLINE: true,      // ignore inline images like logos

  // === ADVANCED ===
  // If provided, this full Gmail query is used as-is (builder is skipped).
  QUERY_OVERRIDE: '',        // e.g., 'label:Invoices has:attachment newer_than:14d -label:av_processed'
};

function saveAttachmentsToDrive() {
  // Validate folder
  const folder = DriveApp.getFolderById(AV.DRIVE_FOLDER_ID);
  const processed = GmailApp.getUserLabelByName(AV.PROCESSED_LABEL) || GmailApp.createLabel(AV.PROCESSED_LABEL);

  // Build or use override query
  const query = AV.QUERY_OVERRIDE && AV.QUERY_OVERRIDE.trim()
    ? AV.QUERY_OVERRIDE.trim()
    : buildQuery_();

  const threads = GmailApp.search(query, 0, AV.BATCH);
  if (!threads.length) {
    console.log('No matching threads. Query:', query);
    return;
  }

  threads.forEach(thread => {
    // Idempotency guard
    if (thread.getLabels().some(l => l.getName() === AV.PROCESSED_LABEL)) return;

    thread.getMessages().forEach(msg => {
      const attachments = msg.getAttachments({
        includeInlineImages: !AV.EXCLUDE_INLINE,
        includeAttachments: true
      });

      attachments.forEach(att => {
        if (AV.DRY_RUN) {
          console.log('DRY_RUN would save:', att.getName());
        } else {
          const file = folder.createFile(att.copyBlob());
          file.setDescription(`From: ${msg.getFrom()} | Subject: ${msg.getSubject()}`);
          console.log('Saved:', file.getName());
        }
      });
    });

    if (!AV.DRY_RUN) thread.addLabel(processed);
  });
}

function buildQuery_() {
  const parts = ['has:attachment'];

  if (AV.SENDER_EMAIL) parts.push(`from:${sanitizeEmail_(AV.SENDER_EMAIL)}`);
  if (AV.SUBJECT_CONTAINS) parts.push(`subject:"${AV.SUBJECT_CONTAINS.replace(/"/g, '\\"')}"`);
  if (AV.GMAIL_LABEL) parts.push(`label:${quoteIfSpace_(AV.GMAIL_LABEL)}`);
  if (AV.NEWER_THAN_DAYS && Number(AV.NEWER_THAN_DAYS) > 0) {
    parts.push(`newer_than:${Number(AV.NEWER_THAN_DAYS)}d`);
  }

  // Always exclude already-processed
  parts.push(`-label:${AV.PROCESSED_LABEL}`);

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

/** One-time: install scheduled trigger */
function installAttachmentTrigger() {
  ScriptApp.newTrigger('saveAttachmentsToDrive')
    .timeBased()
    .everyHours(1)
    .create();
}
