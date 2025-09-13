# 📂 Gmail → Auto-save Attachments to Drive
Save Gmail attachments straight into a Drive folder — no more download → rename → drag-drop.

---

## 🔍 What this solves
- Monthly invoices/statements busywork
- Lost attachments in “Downloads”
- Collecting resumes/submissions into one shared folder

---

## ⚙️ Setup (Apps Script in-built editor)
1) Open https://script.google.com → **New project**  
2) Paste `Code.gs` into the editor  
3) Edit the **AV** config at the top:
   - `DRIVE_FOLDER_ID`: target Drive folder ID (from the folder URL)
   - `SENDER_EMAIL` *(optional)*: only match from this address
   - `SUBJECT_CONTAINS` *(optional)*: keyword that must be in the subject
   - `GMAIL_LABEL` *(optional)*: only threads under this Gmail label
   - `NEWER_THAN_DAYS`: time window (e.g., 7)
   - `PROCESSED_LABEL`: label added after saving (prevents duplicates)
   - `DRY_RUN`: start with `true` to test safely
   - (Advanced) `QUERY_OVERRIDE`: provide a full Gmail query string and skip the builder
4) **Run** `saveAttachmentsToDrive()` once → authorize  
5) (Optional) Run `installAttachmentTrigger()` to schedule (e.g., hourly)

---

## 🧪 Test (2-minute checklist)
- Set `DRY_RUN = true`
- Send yourself a test email with an attachment that matches your filters
- Run the function → **View → Logs** should list filenames
- Set `DRY_RUN = false` and run again → files appear in Drive
- Gmail thread gets labeled with `PROCESSED_LABEL`

---

## 🧰 Tips
- Start narrow (e.g., set `SENDER_EMAIL`) then broaden
- Keep `NEWER_THAN_DAYS` reasonable (7–30) for speed & quotas
- One unique `PROCESSED_LABEL` per script (e.g., `av_processed`)

---

## 🔒 Permissions used
- Gmail (read)
- Drive (create files)
- Script runtime (Triggers)

