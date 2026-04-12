// ─────────────────────────────────────────────────────────────
// Masjid Al-Wadood — Prayer Times
// Scriptable iOS Widget
//
// Installation:
//   1. Install the free "Scriptable" app from the App Store
//   2. Copy this file into the Scriptable folder in iCloud Drive
//      (Files app → iCloud Drive → Scriptable)
//   3. Open Scriptable, tap the script, and tap ▶ to test
//   4. Add a medium-size Scriptable widget to your home screen
//      and choose this script
//
// Data source: http://masjidalwadood.com/salaattimings.php
// ─────────────────────────────────────────────────────────────

// ── Palette (all Color() calls must be top-level constants) ──
const COLOR_BG    = new Color(`#0d0d0d`)
const COLOR_GOLD  = new Color(`#FFD700`)
const COLOR_WHITE = new Color(`#FFFFFF`)
const COLOR_DIM   = new Color(`#777777`)
const COLOR_SUB   = new Color(`#AAAAAA`)

// ─────────────────────────────────────────────────────────────
// HTML helpers — no regex, only string methods
// ─────────────────────────────────────────────────────────────

// Extract the raw text content from the tail of a split("<td") chunk.
// The chunk looks like:  [optional attrs]>TEXT</td>...more html...
// We find the first ">" then read until the next "<".
function getCellText(chunk) {
  let gt = chunk.indexOf(`>`)
  if (gt < 0) return ``
  let inner = chunk.substring(gt + 1)
  let lt = inner.indexOf(`<`)
  if (lt >= 0) inner = inner.substring(0, lt)
  return inner.trim()
}

// ─────────────────────────────────────────────────────────────
// Parse prayer times from raw HTML
// ─────────────────────────────────────────────────────────────
// The page contains a table whose rows look like:
//   <tr><td>PrayerName</td><td>AdhanTime</td><td>IqamahTime</td></tr>
// Times are 12-hour without AM/PM; Fajr & Sunrise are AM, rest are PM.

function parsePrayers(html) {
  // Split into rows, then split each row into cells
  let rows     = html.split(`<tr`)
  let wanted   = [`Fajr`, `Sunrise`, `Dhuhr`, `Asr`, `Asar`, `Maghrib`, `Isha`]
  let amNames  = [`Fajr`, `Sunrise`]
  let result   = []

  for (let i = 0; i < rows.length; i++) {
    let cells = rows[i].split(`<td`)
    // Need at least 4 chunks: [before first td], [name td], [adhan td], [iqamah td]
    if (cells.length < 4) continue

    let name = getCellText(cells[1])

    // Check if this row is a prayer we care about
    let isWanted = false
    for (let j = 0; j < wanted.length; j++) {
      if (name === wanted[j]) { isWanted = true; break }
    }
    if (!isWanted) continue

    let isAM = false
    for (let k = 0; k < amNames.length; k++) {
      if (name === amNames[k]) { isAM = true; break }
    }

    result.push({
      name:   name,
      adhan:  getCellText(cells[2]),
      iqamah: getCellText(cells[3]),
      isAM:   isAM
    })
  }

  return result
}

// ─────────────────────────────────────────────────────────────
// Time helpers
// ─────────────────────────────────────────────────────────────

// Convert "H:MM" + isAM flag to a Date object for today
function toDate(timeStr, isAM) {
  let ci = timeStr.indexOf(`:`)
  if (ci < 0) return null
  let h = parseInt(timeStr.substring(0, ci))
  let m = parseInt(timeStr.substring(ci + 1))
  if (isNaN(h) || isNaN(m)) return null

  // Apply AM/PM logic
  if (!isAM && h !== 12) h += 12   // PM: 1–11 → 13–23
  if (isAM  && h === 12) h = 0     // AM: 12:xx → 00:xx (midnight edge case)

  let now = new Date()
  return new Date(now.getFullYear(), now.getMonth(), now.getDate(), h, m, 0)
}

// Format a millisecond duration as "Xh Ym", "Ym Zs", or "Zs"
function fmtMs(ms) {
  let s  = Math.floor(ms / 1000)
  let h  = Math.floor(s / 3600)
  let mn = Math.floor((s % 3600) / 60)
  let sc = s % 60
  if (h  > 0) return h  + `h ` + mn + `m`
  if (mn > 0) return mn + `m ` + sc + `s`
  return sc + `s`
}

// ─────────────────────────────────────────────────────────────
// Widget builder
// ─────────────────────────────────────────────────────────────

async function buildWidget() {
  // ── Fetch HTML ──────────────────────────────────────────
  let req = new Request(`http://masjidalwadood.com/salaattimings.php`)
  req.allowInsecureRequest = true          // required for HTTP on iOS
  let html = await req.loadString()

  // ── Parse & filter to display prayers ───────────────────
  let allParsed  = parsePrayers(html)
  let showNames  = [`Fajr`, `Dhuhr`, `Asr`, `Asar`, `Maghrib`, `Isha`]
  let prayers    = []

  for (let i = 0; i < allParsed.length; i++) {
    let p = allParsed[i]
    for (let j = 0; j < showNames.length; j++) {
      if (p.name === showNames[j]) { prayers.push(p); break }
    }
  }

  // ── Find next upcoming prayer (by iqamah time) ──────────
  let now    = new Date()
  let next   = null
  let nextMs = Infinity

  for (let i = 0; i < prayers.length; i++) {
    let p  = prayers[i]
    let iq = toDate(p.iqamah, p.isAM)
    if (iq && iq > now) {
      let diff = iq - now
      if (diff < nextMs) { nextMs = diff; next = p }
    }
  }

  // ── Build widget ─────────────────────────────────────────
  let w = new ListWidget()
  w.backgroundColor = COLOR_BG
  w.setPadding(14, 16, 14, 16)
  // Refresh 2 min after iqamah of next prayer (or in 2 min if all done)
  let refreshAt = next
    ? new Date(toDate(next.iqamah, next.isAM).getTime() + 2 * 60 * 1000)
    : new Date(Date.now() + 2 * 60 * 1000)
  w.refreshAfterDate = refreshAt

  // ── Header row: prayer name ← → countdown ───────────────
  let hdr = w.addStack()
  hdr.layoutHorizontally()

  let hdrName = hdr.addText(next ? next.name : `All done`)
  hdrName.font      = Font.boldSystemFont(16)
  hdrName.textColor = COLOR_GOLD

  hdr.addSpacer()

  if (next) {
    let hdrCd = hdr.addText(`iqamah in ` + fmtMs(nextMs))
    hdrCd.font      = Font.systemFont(12)
    hdrCd.textColor = COLOR_DIM
  }

  w.addSpacer(10)

  // ── Column labels ────────────────────────────────────────
  let colRow = w.addStack()
  colRow.layoutHorizontally()

  let colName = colRow.addText(`Prayer`)
  colName.font      = Font.systemFont(10)
  colName.textColor = COLOR_DIM

  colRow.addSpacer()

  let colTimes = colRow.addText(`Adhan  /  Iqamah`)
  colTimes.font      = Font.systemFont(10)
  colTimes.textColor = COLOR_DIM

  w.addSpacer(5)

  // ── Prayer rows ──────────────────────────────────────────
  for (let i = 0; i < prayers.length; i++) {
    let p      = prayers[i]
    let isNext = next !== null && p.name === next.name

    let row = w.addStack()
    row.layoutHorizontally()

    // Name (left)
    let nameEl = row.addText(p.name)
    nameEl.font      = isNext ? Font.boldSystemFont(14) : Font.systemFont(13)
    nameEl.textColor = isNext ? COLOR_GOLD : COLOR_WHITE

    row.addSpacer()

    // Adhan / Iqamah (right) — monospaced so columns align
    let timeEl = row.addText(p.adhan + `  /  ` + p.iqamah)
    timeEl.font      = isNext
      ? Font.boldMonospacedSystemFont(13)
      : Font.regularMonospacedSystemFont(13)
    timeEl.textColor = isNext ? COLOR_GOLD : COLOR_SUB

    if (i < prayers.length - 1) w.addSpacer(5)
  }

  return w
}

// ─────────────────────────────────────────────────────────────
// Entry point
// ─────────────────────────────────────────────────────────────

let widget
try {
  widget = await buildWidget()
} catch (err) {
  widget = new ListWidget()
  widget.backgroundColor = COLOR_BG
  widget.setPadding(14, 16, 14, 16)
  let errEl = widget.addText(`Could not load prayer times.`)
  errEl.font      = Font.systemFont(13)
  errEl.textColor = COLOR_WHITE
  let detailEl = widget.addText(err.message || String(err))
  detailEl.font      = Font.systemFont(10)
  detailEl.textColor = COLOR_DIM
}

if (config.runsInWidget) {
  Script.setWidget(widget)
} else {
  await widget.presentMedium()
}

Script.complete()
