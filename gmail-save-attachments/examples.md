# 📘 Example Configurations for AV

Here are some ready-to-use setups for the `AV` config block in `Code.gs`.  
Just copy the parameters you need and paste them into your script.

---

### 1) Vendor invoices (one sender, subject keyword)
- `SENDER_EMAIL = 'billing@acme.com'`  
- `SUBJECT_CONTAINS = 'invoice'`  
- `GMAIL_LABEL = ''`  
- `NEWER_THAN_DAYS = 30`  

**Resulting query:**  
`has:attachment from:billing@acme.com subject:"invoice" newer_than:30d -label:av_processed`

---

### 2) All attachments under a Gmail label
- `SENDER_EMAIL = ''`  
- `SUBJECT_CONTAINS = ''`  
- `GMAIL_LABEL = 'Invoices'`  
- `NEWER_THAN_DAYS = 60`  

**Resulting query:**  
`has:attachment label:Invoices newer_than:60d -label:av_processed`

---

### 3) Job applications (subject contains “resume”)
- `SENDER_EMAIL = ''`  
- `SUBJECT_CONTAINS = 'resume'`  
- `GMAIL_LABEL = ''`  
- `NEWER_THAN_DAYS = 14`  

**Resulting query:**  
`has:attachment subject:"resume" newer_than:14d -label:av_processed`

---

### 4) Advanced override (custom query string)
If you want full control, skip the filters and set:  
- `QUERY_OVERRIDE = 'label:Finance has:attachment subject:"statement" newer_than:45d -label:av_processed'`

This string will be used as-is, bypassing the builder.

---

### 🧪 Quick test recipe
1. Set `AV.DRY_RUN = true`  
2. Pick one example config from above  
3. Send yourself a matching email with an attachment  
4. Run `saveAttachmentsToDrive()` → check **Logs**  
5. Set `AV.DRY_RUN = false` and run again → file should appear in Drive + email thread gets the processed label
