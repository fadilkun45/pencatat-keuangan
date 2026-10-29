// Tempel di Google Sheet: Extensions → Apps Script. Deploy sebagai Web app (lihat README).
// Menerima array op dari app: { op: "add", uid, tanggal, kategori, nama, nominal } atau { op: "delete", uid }.
// Idempoten: uid yang sudah ada dilewati, jadi kirim ulang (retry / sinkron semua) tidak bikin baris dobel.
const SHEET = 'Transaksi'
const HEADER = ['uid', 'tanggal', 'kategori', 'nama', 'nominal']

function doPost(e) {
  const lock = LockService.getScriptLock()
  lock.waitLock(20000)
  try {
    const ops = JSON.parse(e.postData.contents)
    const ss = SpreadsheetApp.getActiveSpreadsheet()
    const sh = ss.getSheetByName(SHEET) || ss.insertSheet(SHEET)
    if (sh.getLastRow() === 0) sh.appendRow(HEADER)

    const uids = sh.getRange(1, 1, sh.getLastRow(), 1).getValues().map((r) => String(r[0]))
    const existing = new Map(uids.map((u, i) => [u, i + 1])) // uid -> row number
    const pending = new Map()
    const toDelete = new Set()

    for (const op of ops) {
      if (op.op === 'add' && !existing.has(op.uid)) {
        pending.set(op.uid, [op.uid, new Date(op.tanggal), op.kategori, op.nama, Number(op.nominal)])
      } else if (op.op === 'delete') {
        if (!pending.delete(op.uid) && existing.has(op.uid)) toDelete.add(existing.get(op.uid))
      }
    }

    // bottom-up so earlier row numbers stay valid
    ;[...toDelete].sort((a, b) => b - a).forEach((row) => sh.deleteRow(row))
    if (pending.size) sh.getRange(sh.getLastRow() + 1, 1, pending.size, HEADER.length).setValues([...pending.values()])

    return json({ ok: true, added: pending.size, deleted: toDelete.size })
  } catch (err) {
    return json({ ok: false, error: String(err) })
  } finally {
    lock.releaseLock()
  }
}

function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON)
}
