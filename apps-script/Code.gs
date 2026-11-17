/**
 * Sleedy waitlist: saves sign-ups from sleedy.app into the "Sleedy waitlist" Google Sheet.
 *
 * Setup: open the sheet > Extensions > Apps Script > paste this file > Deploy > New deployment >
 * Web app > Execute as: Me, Who has access: Anyone. Copy the /exec URL into assets/config.js.
 * After any change to this file, use Deploy > Manage deployments > Edit > New version.
 */
var SHEET_NAME = 'Sheet1';
var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function doPost(e) {
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000);
    var email = String((e && e.parameter && e.parameter.email) || '').trim().toLowerCase();
    var source = String((e && e.parameter && e.parameter.source) || 'sleedy.app').slice(0, 60);
    if (!EMAIL_RE.test(email) || email.length > 254) return json_({ ok: false, error: 'invalid_email' });

    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
    var last = sheet.getLastRow();
    if (last > 1) {
      var existing = sheet.getRange(2, 2, last - 1, 1).getValues();
      for (var i = 0; i < existing.length; i++) {
        if (String(existing[i][0]).toLowerCase() === email) return json_({ ok: true, duplicate: true });
      }
    }
    // A leading apostrophe-free write: guard against spreadsheet formula injection.
    var safe = /^[=+\-@]/.test(email) ? "'" + email : email;
    sheet.appendRow([new Date().toISOString(), safe, source, 'subscribed']);
    return json_({ ok: true });
  } catch (err) {
    return json_({ ok: false, error: 'server_error' });
  } finally {
    try { lock.releaseLock(); } catch (x) {}
  }
}

function doGet() {
  return json_({ ok: true, service: 'sleedy-waitlist' });
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
