# 📨 Gmail → Auto-forward Emails
Automatically forward Gmail messages that match your rules to teammates, your other inbox, or anyone else you choose. No more late-night manual forwarding.

---

## 🔍 What this solves
- Forwarding the same client emails to your team over and over  
- Sending invoices manually to finance every month  
- Forwarding job offers or college emails to a personal account  
- Making sure your team doesn’t miss critical messages

---

## ⚙️ Setup (Apps Script in-built editor)
1. Open [Google Apps Script](https://script.google.com/) → **New Project**  
2. Copy-paste `Code.gs` into the editor  
3. Edit the **FW** config block at the top:  
   - `FORWARD_TO`: list of email addresses to forward to  
   - `SENDER_EMAIL` *(optional)*: only match from this address  
   - `SUBJECT_CONTAINS` *(optional)*: keyword that must be in subject  
   - `GMAIL_LABEL` *(optional)*: only threads under this Gmail label  
   - `NEWER_THAN_DAYS`: only forward recent emails (e.g., last 7 days)  
   - `PROCESSED_LABEL`: label added after forwarding (avoids duplicates)  
   - `DRY_RUN`: set `true` to test safely  
   - (Advanced) `QUERY_OVERRIDE`: provide a full Gmail query string directly  
4. Run `forwardMatchingEmails()` once → approve permissions  
5. (Optional) Run `installForwardTrigger()` to auto-run every 5 minutes

---

## 🧪 How to Test
- Set `DRY_RUN = true`  
- Send yourself a test email that matches your filters  
- Run the function → check **View → Logs**  
- Switch `DRY_RUN = false` and run again → email should forward + thread gets labeled  

---

## 🔒 Permissions used
- Gmail (read + forward messages)  
- Script runtime (Triggers)  
