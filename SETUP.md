# Prime Rush Release Tester — Setup Guide

## What you need
- A Google account (the one that owns both spreadsheets)
- 10 minutes

---

## Step 1 — Get your Sheet IDs

Open each spreadsheet in your browser. The ID is in the URL:

```
https://docs.google.com/spreadsheets/d/  THIS_PART_HERE  /edit
```

Copy the ID for:
- **Content of Prime Rush (BRX)** sheet
- **Product Testing SCP** sheet

---

## Step 2 — Create a new Google Apps Script project

1. Go to: https://script.google.com
2. Click **New project**
3. Rename it to: `Prime Rush Release Tester`

---

## Step 3 — Add the files

### Code.gs
1. You'll see a default `Code.gs` file — delete everything in it
2. Open `Code.gs` from this folder and paste the entire contents

3. At the top of the file, replace the two placeholder IDs:
```javascript
CONTENT_SHEET_ID: 'REPLACE_WITH_CONTENT_SHEET_ID',
SOP_SHEET_ID:     'REPLACE_WITH_SOP_SHEET_ID',
```
with your actual IDs from Step 1.

4. Also check these match your actual tab names:
```javascript
CONTENT_TAB:     'Main',
SOP_RESULTS_TAB: 'Master Sheet 2.0',
```

### index.html
1. In the Apps Script editor, click the **+** next to Files
2. Choose **HTML**
3. Name it exactly: `index` (no .html extension needed — Apps Script adds it)
4. Delete everything in it, then paste the full contents of `index.html` from this folder

---

## Step 4 — Deploy as Web App

1. Click **Deploy** (top right) → **New deployment**
2. Click the gear icon next to **Select type** → choose **Web app**
3. Set:
   - **Description**: Release Tester v1
   - **Execute as**: Me
   - **Who has access**: Only myself  *(or your team if others need it)*
4. Click **Deploy**
5. It will ask you to authorize — click through the Google permission screens
6. Copy the **Web app URL** — this is your tester link

---

## Step 5 — Use it

1. Open the Web app URL in your browser
2. It loads all "On Going + Visible" items from the content sheet automatically
3. Click **Start Test Session**
4. For each item:
   - Press **Enter** or click **Pass** if it looks good
   - Press **B** or click **Bug** to log a bug (type a note, then confirm)
   - Press **S** or click **Skip** to skip an item
   - Press **← Arrow** to go back to the previous item
5. When done, click **Save to Google Sheet** — results are written to a new tab in your SOP sheet
6. Click **Copy Bug Summary** to copy all bugs to clipboard for pasting into GitHub or Slack

---

## Notes

- Re-deploying after changes: go to **Deploy** → **Manage deployments** → edit and create a new version
- The content sheet is re-read every time you open the tool, so new items added between releases are picked up automatically
- Tab names in the SOP sheet will look like: `Release Test 03-23-2026 14:30`
