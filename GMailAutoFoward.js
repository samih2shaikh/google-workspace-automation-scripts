/**
 * CONFIG — edit these
 */
const CFG = {
  GMAIL_QUERY: 'from:someone@example.com newer_than:2d -label:fw_processed',
  FORWARD_TO: ['teammate1@example.com', 'teammate2@example.com'],
  PROCESSED_LABEL: 'fw_processed',
  DRY_RUN: false, // true = log only
};


function forwardMatchingEmails() {
  const processedLabel = getOrCreateLabel_(CFG.PROCESSED_LABEL);
  const threads = GmailApp.search(CFG.GMAIL_QUERY, 0, 50); // returns GmailThread[]

  threads.forEach(thread => {
    // guard: skip if already processed
    if (hasLabel_(thread, CFG.PROCESSED_LABEL)) return;

    const msg = thread.getMessages().pop(); // latest message in thread

    if (CFG.DRY_RUN) {
      console.log('DRY_RUN would forward:', msg.getSubject());
      return;
    }

    CFG.FORWARD_TO.forEach(addr => {
      msg.forward(addr, { htmlBody: msg.getBody() });
    });

    thread.addLabel(processedLabel); // mark processed
    console.log('Forwarded + labeled:', msg.getSubject());
  });
}

function hasLabel_(thread, labelName) {
  return thread.getLabels().some(l => l.getName() === labelName);
}

function getOrCreateLabel_(name) {
  return GmailApp.getUserLabelByName(name) || GmailApp.createLabel(name);
}

function installTrigger() {
  ScriptApp.newTrigger('forwardMatchingEmails')
    .timeBased()
    .everyMinutes(5)
    .create();
}