# Prime Rush Release Tester — Setup Guide

## Requirements
- Python 3.10 or newer

---

## One-time setup

Open a terminal in this folder and run:

```
pip install -r requirements.txt
```

---

## Every release

1. Download the **Content of Prime Rush (BRX).xlsx** file to your Downloads folder.

2. Run the script:

```
python tester.py
```

The script automatically looks for the file in your Downloads folder.
If it's somewhere else, pass the path:

```
python tester.py "C:\Users\you\Desktop\Content of Prime Rush (BRX).xlsx"
```

3. Your browser opens automatically at `http://localhost:5000`.

4. Click **Start Test Session** and go through each item:
   - `Enter` or click **Pass** — item is fine, moves to next
   - `B` or click **Bug** — type a note about the issue, confirm
   - `S` or click **Skip** — skip the item
   - `← Arrow` — go back to the previous item
   - **Skip category** button — marks all remaining items in that category as skipped

5. When done, click **Save Results to Excel**.
   A file named `test-results-YYYY-MM-DD-HHMM.xlsx` is created in the folder where you ran the script.

6. Click **Copy Bug Summary** to copy all bugs to clipboard (for pasting into GitHub or Slack).

7. Press `Ctrl+C` in the terminal to stop the server.

---

## Output file

The saved Excel file contains:
- A summary block (total / passed / bugs / skipped)
- A color-coded table of all items (green = pass, red = bug, yellow = skip)
- Bug notes next to each flagged item
