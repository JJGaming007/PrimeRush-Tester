// ============================================================
// PRIME RUSH RELEASE TESTER - Google Apps Script Backend
// ============================================================
// SETUP: Replace the two IDs below with your actual Sheet IDs.
// You find the ID in the Google Sheets URL:
//   https://docs.google.com/spreadsheets/d/SHEET_ID_HERE/edit
// ============================================================

const CONFIG = {
  CONTENT_SHEET_ID: 'REPLACE_WITH_CONTENT_SHEET_ID',   // Content of Prime Rush (BRX)
  CONTENT_TAB:      'Main',

  SOP_SHEET_ID:     'REPLACE_WITH_SOP_SHEET_ID',        // Product Testing SCP
  SOP_RESULTS_TAB:  'Master Sheet 2.0',                  // Tab where results are written
};

// ------------------------------------------------------------
// Entry point — serves the web app HTML
// ------------------------------------------------------------
function doGet() {
  return HtmlService.createHtmlOutputFromFile('index')
    .setTitle('Prime Rush Release Tester')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

// ------------------------------------------------------------
// Reads the content sheet and returns items grouped by Type.
// Filters: Status contains "on going" AND Visibility = "Visible"
// ------------------------------------------------------------
function getContentItems() {
  try {
    const ss    = SpreadsheetApp.openById(CONFIG.CONTENT_SHEET_ID);
    const sheet = ss.getSheetByName(CONFIG.CONTENT_TAB);

    if (!sheet) {
      return { success: false, error: 'Tab "' + CONFIG.CONTENT_TAB + '" not found in Content sheet.' };
    }

    const data = sheet.getDataRange().getValues();
    if (data.length < 2) {
      return { success: false, error: 'Content sheet appears to be empty.' };
    }

    // Auto-detect header row (search first 5 rows)
    let headerRowIdx = 0;
    for (let i = 0; i < Math.min(5, data.length); i++) {
      if (data[i].some(c => String(c).trim().toLowerCase() === 'type')) {
        headerRowIdx = i;
        break;
      }
    }

    const headers = data[headerRowIdx].map(h => String(h).trim());

    function col(name) {
      const idx = headers.findIndex(h => h.toLowerCase() === name.toLowerCase());
      if (idx === -1) throw new Error('Column "' + name + '" not found. Found: ' + headers.filter(Boolean).join(', '));
      return idx;
    }

    const typeIdx        = col('Type');
    const nameIdx        = col('Name');
    const rarityIdx      = col('Rarity');
    const skinIdIdx      = col('Skin ID');
    const statusIdx      = col('Status');
    const visibilityIdx  = col('Prime Rush Visibility');
    const acquisitionIdx = col('Prime Rush Current Acquisitions');

    const grouped = {};

    for (let i = headerRowIdx + 1; i < data.length; i++) {
      const row = data[i];
      if (row.every(c => !c)) continue; // skip blank rows

      const status     = String(row[statusIdx]     || '').trim().toLowerCase();
      const visibility = String(row[visibilityIdx] || '').trim().toLowerCase();

      const isActive  = status === 'on going' || status === 'ongoing';
      const isVisible = visibility === 'visible';

      if (!isActive || !isVisible) continue;

      const type = String(row[typeIdx] || 'Unknown').trim() || 'Unknown';
      const name = String(row[nameIdx] || '').trim();

      if (!name) continue;

      const item = {
        name:        name,
        rarity:      String(row[rarityIdx]      || '').trim(),
        skinId:      String(row[skinIdIdx]       || '').trim(),
        acquisition: String(row[acquisitionIdx]  || '').trim(),
        type:        type,
      };

      if (!grouped[type]) grouped[type] = [];
      grouped[type].push(item);
    }

    const totalItems = Object.values(grouped).reduce((s, arr) => s + arr.length, 0);

    return { success: true, data: grouped, totalItems: totalItems };

  } catch (e) {
    return { success: false, error: e.message };
  }
}

// ------------------------------------------------------------
// Saves the completed test session results to the SOP sheet.
// Creates a new dated tab. Returns the tab name on success.
// ------------------------------------------------------------
function saveSessionResults(flatResults, summary) {
  try {
    const ss        = SpreadsheetApp.openById(CONFIG.SOP_SHEET_ID);
    const timestamp = new Date();
    const tz        = Session.getScriptTimeZone();
    const tabName   = 'Release Test ' + Utilities.formatDate(timestamp, tz, 'MM-dd-yyyy HH:mm');

    // Remove tab if it already exists (re-run scenario)
    const existing = ss.getSheetByName(tabName);
    if (existing) ss.deleteSheet(existing);

    const sheet = ss.insertSheet(tabName);

    // ---- Summary block ----
    sheet.appendRow(['PRIME RUSH RELEASE TEST SUMMARY']);
    sheet.appendRow(['Date',        Utilities.formatDate(timestamp, tz, 'MM/dd/yyyy HH:mm')]);
    sheet.appendRow(['Total Items', summary.total]);
    sheet.appendRow(['Passed',      summary.passed]);
    sheet.appendRow(['Bugs Found',  summary.bugs]);
    sheet.appendRow(['Skipped',     summary.skipped]);
    sheet.appendRow([]); // spacer

    // ---- Results table header ----
    sheet.appendRow(['Category', 'Item Name', 'Rarity', 'Acquisition', 'Result', 'Bug Notes']);

    const headerRange = sheet.getRange(8, 1, 1, 6);
    headerRange.setFontWeight('bold')
               .setBackground('#1a1a2e')
               .setFontColor('#ffffff');

    // ---- Item rows ----
    const COLORS = { PASS: '#b7e1cd', BUG: '#f4c7c3', SKIP: '#fce8b2' };

    flatResults.forEach((r, idx) => {
      sheet.appendRow([r.type, r.name, r.rarity, r.acquisition, r.status, r.bugNotes || '']);
      const resultCell = sheet.getRange(9 + idx, 5);
      resultCell.setBackground(COLORS[r.status] || '#ffffff');
    });

    // ---- Title formatting ----
    sheet.getRange(1, 1).setFontWeight('bold').setFontSize(13);
    sheet.autoResizeColumns(1, 6);

    return { success: true, tabName: tabName };

  } catch (e) {
    return { success: false, error: e.message };
  }
}
