# 📘 Example Configurations for WA

Copy these parameter values into the `WA` config in `Code.gs`.

---

### 1) Ping me when the professor emails
- `SENDER_EMAIL = 'professor@university.edu'`
- `SUBJECT_CONTAINS = ''`
- `GMAIL_LABEL = ''`
- `NEWER_THAN_DAYS = 7`

**Query built:**  
`from:professor@university.edu newer_than:7d -label:wa_notified`

---

### 2) Client priority: subject contains “urgent”
- `SENDER_EMAIL = ''`
- `SUBJECT_CONTAINS = 'urgent'`
- `GMAIL_LABEL = 'Clients'`   *(optional, if you label client threads)*
- `NEWER_THAN_DAYS = 3`

**Query built:**  
`subject:"urgent" label:Clients newer_than:3d -label:wa_notified`

---

### 3) VIP list via Gmail label “VIP”
- `SENDER_EMAIL = ''`
- `SUBJECT_CONTAINS = ''`
- `GMAIL_LABEL = 'VIP'`
- `NEWER_THAN_DAYS = 14`

**Query built:**  
`label:VIP newer_than:14d -label:wa_notified`

---

### 4) Advanced (custom override)
Skip filters and use a full query:
- `QUERY_OVERRIDE = 'from:ceo@company.com OR subject:"PO#" newer_than:10d -label:wa_notified'`

---

### 🧪 Quick test recipe
1. Set `WA.DRY_RUN = true`
2. Choose one config above and send a matching test email
3. Run `notifyWhatsAppOnNewEmail()` → check Logs (payload)
4. Set `DRY_RUN = false` → run again → WhatsApp message should arrive
5. Confirm Gmail thread labeled `wa_notified`
