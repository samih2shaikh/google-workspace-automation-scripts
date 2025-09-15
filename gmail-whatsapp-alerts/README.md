# 📱 Gmail → WhatsApp VIP Alerts
Instant WhatsApp notifications for high-priority emails. Stay on top of clients, professors, and deadlines without babysitting your inbox.

---

## 🔍 What this solves
- VIP emails getting lost under promos & newsletters
- Missing time-sensitive client messages after hours
- Manually copy-pasting “FYI” updates into WhatsApp groups

---

## ⚙️ Setup (Apps Script in-built editor)
1) Open https://script.google.com → **New project**  
2) Paste `Code.gs` into the editor  
3) **Add Script Properties** (Project Settings → Script properties):  
   - `WHATSAPP_TOKEN` → your WhatsApp Business Cloud API token  
   - `PHONE_NUMBER_ID` → your WhatsApp Business phone number ID  
   - `WHATSAPP_TO` → recipient in E.164 format (e.g., `+14155550123`)  
   - `WA_TEMPLATE` → approved template name (e.g., `new_email_alert`)  

4) Edit the **WA** config at the top of `Code.gs`:  
   - `SENDER_EMAIL`, `SUBJECT_CONTAINS`, `GMAIL_LABEL`, `NEWER_THAN_DAYS`  
   - `PROCESSED_LABEL` (e.g., `wa_notified`)  
   - `DRY_RUN` (start `true`)  
   - (Advanced) `QUERY_OVERRIDE` to use a full manual Gmail query

5) Run `notifyWhatsAppOnNewEmail()` once → authorize  
6) (Optional) Run `installWhatsAppTrigger()` to schedule (e.g., every 2 minutes)

---

## 🧪 Test (2-minute checklist)
- Set `DRY_RUN = true`  
- Send yourself a test email that matches your filters  
- Run the function → **View → Logs** should show the outbound payload  
- Set `DRY_RUN = false` → run again → WhatsApp message should arrive  
- Gmail thread should get label `PROCESSED_LABEL` to prevent duplicates

---

## 🧰 Notes
- Your WhatsApp template must be **approved** and can include parameters.  
- This script sends a **template message** with sender + subject.  
- Respect quotas: keep `BATCH` small and frequency reasonable.

---

## 🔒 Permissions used
- Gmail (read threads/messages)  
- URL Fetch (call WhatsApp API)  
- Script runtime (Triggers)
