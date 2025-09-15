# 📘 Example Configurations for FW

Here are ready-to-use setups for the `FW` config in `Code.gs`.  
Copy the lines you need into your config block.

---

### 1) Forward all emails from your boss
- `SENDER_EMAIL = 'boss@company.com'`  
- `SUBJECT_CONTAINS = ''`  
- `GMAIL_LABEL = ''`  
- `NEWER_THAN_DAYS = 7`  
- `FORWARD_TO = ['teamlead@example.com']`

**Query built:**  
`from:boss@company.com newer_than:7d -label:fw_processed`

---

### 2) Forward all invoices to finance
- `SENDER_EMAIL = 'billing@vendor.com'`  
- `SUBJECT_CONTAINS = 'invoice'`  
- `GMAIL_LABEL = ''`  
- `NEWER_THAN_DAYS = 30`  
- `FORWARD_TO = ['finance@example.com']`

**Query built:**  
`from:billing@vendor.com subject:"invoice" newer_than:30d -label:fw_processed`

---

### 3) Forward all emails under Gmail label “Jobs”
- `SENDER_EMAIL = ''`  
- `SUBJECT_CONTAINS = ''`  
- `GMAIL_LABEL = 'Jobs'`  
- `NEWER_THAN_DAYS = 14`  
- `FORWARD_TO = ['personal@example.com']`

**Query built:**  
`label:Jobs newer_than:14d -label:fw_processed`

---

### 4) Advanced (custom query override)
If you want full control, skip filters:  
- `QUERY_OVERRIDE = 'subject:"offer" has:attachment newer_than:10d -label:fw_processed'`  
- `FORWARD_TO = ['altinbox@example.com']`

---

### 🧪 Quick test recipe
1. Set `FW.DRY_RUN = true`  
2. Send yourself a test email matching one config above  
3. Run `forwardMatchingEmails()` → check logs  
4. Set `DRY_RUN = false` and run again → email forwards + label added
