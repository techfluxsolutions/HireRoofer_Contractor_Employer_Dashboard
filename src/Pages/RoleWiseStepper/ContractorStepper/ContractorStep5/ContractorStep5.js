

import React, { useEffect, useState } from "react";

const WEEK_DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function startOfMonth(date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}
function endOfMonth(date) {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0);
}
function daysInMonth(date) {
  return endOfMonth(date).getDate();
}
function pad(n) {
  return n < 10 ? `0${n}` : `${n}`;
}

// --- dd-mm-yyyy format functions ---
function formatDate(d) {
  return `${pad(d.getDate())}-${pad(d.getMonth() + 1)}-${d.getFullYear()}`;
}

function parseDate(s) {
  const [d, m, y] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
}

function iterateDatesBetween(aStr, bStr) {
  const a = parseDate(aStr);
  const b = parseDate(bStr);
  const start = a < b ? a : b;
  const end = a < b ? b : a;
  const days = [];
  const cur = new Date(start.getFullYear(), start.getMonth(), start.getDate());
  while (cur <= end) {
    days.push(formatDate(cur));
    cur.setDate(cur.getDate() + 1);
  }
  return days;
}

const defaultWeeklySchedule = () => {
  const schedule = {};
  for (let i = 0; i < 7; i += 1) schedule[i] = { enabled: false, start: "09:00", end: "17:00" };
  return schedule;
};

const ContractorStep5 = ({ formData = {}, onChange }) => {
  const [month, setMonth] = useState(startOfMonth(new Date()));
  const [selectedMap, setSelectedMap] = useState({});
  const [weeklySchedule, setWeeklySchedule] = useState(defaultWeeklySchedule());
  const [selectMode, setSelectMode] = useState("dates");
  const [anchor, setAnchor] = useState(null);
  const [openEditor, setOpenEditor] = useState(null);

  function mapAvailabilityCalendar(apiCalendar = []) {
  const map = {};

  apiCalendar.forEach((item) => {
    if (!item.available) return;
    if (!Array.isArray(item.slots) || item.slots.length === 0) return;

    const [start, end] = item.slots[0].split("-");
    const key = formatDate(new Date(item.date)); // yyyy-mm-dd → dd-mm-yyyy

    map[key] = { start, end };
  });

  return map;
}
useEffect(() => {
  const avail = formData.availability || {};
  let initMap = {};

  // 🔹 NEW: load API availabilityCalendar
  if (Array.isArray(avail.availabilityCalendar)) {
    initMap = mapAvailabilityCalendar(avail.availabilityCalendar);
  }

  // 🔹 existing logic kept (merge selectedDates)
  if (Array.isArray(avail.selectedDates)) {
    for (const d of avail.selectedDates) {
      if (d?.date) {
        initMap[d.date] = {
          start: d.start || "09:00",
          end: d.end || "17:00",
        };
      }
    }
  }

  setSelectedMap(initMap);
}, []);


  const today = new Date();
  today.setHours(0, 0, 0, 0); // Normalize to midnight

  const isPast = (dateObj) => {
    const d = new Date(dateObj.getFullYear(), dateObj.getMonth(), dateObj.getDate());
    return d < today;
  };

  useEffect(() => {
    const avail = formData.availability || {};
    const initMap = {};
    if (Array.isArray(avail.selectedDates)) {
      for (const d of avail.selectedDates) {
        if (typeof d === "string") initMap[d] = { start: "09:00", end: "17:00" };
        else if (d && d.date) initMap[d.date] = { start: d.start || "09:00", end: d.end || "17:00" };
      }
    }
    setSelectedMap(initMap);
    if (avail.weeklySchedule) setWeeklySchedule({ ...defaultWeeklySchedule(), ...avail.weeklySchedule });
  }, []);

  useEffect(() => {
    const selectedDates = Object.keys(selectedMap)
      .sort((a, b) => parseDate(a) - parseDate(b))
      .map((d) => ({ date: d, start: selectedMap[d].start, end: selectedMap[d].end }));
    if (onChange) {
      onChange({
        selectedDates,
        weeklySchedule,
        hourlyRate: formData.hourlyRate ?? undefined,
        travelRadius: formData.travelRadius ?? undefined,
      });
    }
  }, [selectedMap, weeklySchedule]);

  const toggleDateClick = (dateObj) => {
    if (isPast(dateObj)) return; // Ignore past dates
    const key = formatDate(dateObj);
    if (!anchor) {
      if (selectedMap[key]) {
        setOpenEditor(openEditor === key ? null : key);
        return;
      }
      setAnchor(key);
      setSelectedMap((prev) => (prev[key] ? prev : { ...prev, [key]: { start: "09:00", end: "17:00" } }));
      setOpenEditor(key);
      return;
    }
    const range = iterateDatesBetween(anchor, key).filter((d) => parseDate(d) >= today);
    setSelectedMap((prev) => {
      const next = { ...prev };
      for (const d of range) if (!next[d]) next[d] = { start: "09:00", end: "17:00" };
      return next;
    });
    setAnchor(null);
    setOpenEditor(key);
  };

  const removeDate = (dateStr) => {
    setSelectedMap((prev) => {
      const next = { ...prev };
      delete next[dateStr];
      return next;
    });
    if (openEditor === dateStr) setOpenEditor(null);
  };

  const setDateTime = (dateStr, { start, end }) => {
    setSelectedMap((prev) => {
      if (!prev[dateStr]) return prev;
      return { ...prev, [dateStr]: { start: start || prev[dateStr].start, end: end || prev[dateStr].end } };
    });
  };

  const prevMonth = () => setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1));
  const nextMonth = () => setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1));

  const buildMonthGrid = () => {
    const first = startOfMonth(month);
    const totalDays = daysInMonth(month);
    const leadBlanks = first.getDay();
    const cells = [];
    for (let i = 0; i < leadBlanks; i += 1) cells.push(null);
    for (let day = 1; day <= totalDays; day += 1) cells.push(new Date(month.getFullYear(), month.getMonth(), day));
    return cells;
  };

  const handleWeekdayToggle = (dayIndex) =>
    setWeeklySchedule((prev) => ({ ...prev, [dayIndex]: { ...prev[dayIndex], enabled: !prev[dayIndex].enabled } }));
  const handleWeektimeChange = (dayIndex, field, value) =>
    setWeeklySchedule((prev) => ({ ...prev, [dayIndex]: { ...prev[dayIndex], [field]: value } }));

  const selectedSorted = Object.keys(selectedMap).sort((a, b) => parseDate(a) - parseDate(b));
  const isSelected = (dateStr) => !!selectedMap[dateStr];
  const isPrevSelected = (dateStr) => {
    const d = parseDate(dateStr);
    d.setDate(d.getDate() - 1);
    return isSelected(formatDate(d));
  };
  const isNextSelected = (dateStr) => {
    const d = parseDate(dateStr);
    d.setDate(d.getDate() + 1);
    return isSelected(formatDate(d));
  };

  const styles = `
    .cal-wrap { background: var(--bs-white); border-radius:12px; padding:12px; box-shadow:0 6px 18px rgba(17,24,39,0.06); }
    .cal-header { display:flex; align-items:center; gap:12px; justify-content:space-between; margin-bottom:8px; }
    .cal-nav button { border: none; background: transparent; padding:6px 8px; border-radius:8px; }
    .cal-nav button:hover { background:#f4f6fb; }
    .cal-grid { display:grid; grid-template-columns: repeat(7, 1fr); gap:8px; }
    .cal-day { width:100%; aspect-ratio:1/1; display:flex; align-items:center; justify-content:center; border-radius:10px; transition: transform .12s ease, box-shadow .12s ease, background .12s ease; font-weight:600; border: 0.5px solid gray; }
    .cal-day:hover { transform: translateY(-6%); box-shadow:0 8px 18px rgba(13,110,253,0.12); }
    .cal-day.today { background:#eef6ff; color:#0b5cff; }
    .cal-day.selected { background:linear-gradient(90deg,#0d6efd,#3aa0ff); color:white; box-shadow:none; transform:none; }
    .cal-day.anchor { background:#ffd54d; color:#4b2b00; border:2px solid #b07a00; box-shadow:none; transform:none; }
    .cal-day.range-left { border-top-left-radius:18px; border-bottom-left-radius:18px; border-top-right-radius:4px; border-bottom-right-radius:4px; }
    .cal-day.range-mid { border-radius:2px; }
    .cal-day.range-right { border-top-right-radius:18px; border-bottom-right-radius:18px; border-top-left-radius:4px; border-bottom-left-radius:4px; }
    .cal-day.disabled { pointer-events: none; opacity: 0.5; }
    .cal-weeklabels { display:grid; grid-template-columns: repeat(7, 1fr); gap:8px; margin-bottom:6px; }
    .cal-weeklabels div { text-align:center; font-size:12px; color:#6b7280; }
    .selected-list { margin-top:12px; }
    @media (max-width:520px) { .cal-grid { gap:6px; } .cal-day { font-size:0.95rem; } }
  `;

  return (
    <div>
      <style>{styles}</style>
      <div className="cal-wrap">
        <div className="cal-header">
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div className="cal-nav">
              <button type="button" onClick={prevMonth} aria-label="Previous month">◀</button>
              <button type="button" onClick={nextMonth} aria-label="Next month">▶</button>
            </div>
            <div style={{ fontWeight: 700 }}>
              {month.toLocaleString(undefined, { month: "long" })} {month.getFullYear()}
            </div>
          </div>

          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <div style={{ fontSize: 13, color: "#6b7280" }}>Mode</div>
            <div style={{ display: "flex", gap: 6 }}>
              <button
                type="button"
                className={`btn btn-sm ${selectMode === "dates" ? "btn-primary" : "btn-outline-secondary"}`}
                onClick={() => setSelectMode("dates")}
              >
                Dates
              </button>
              <button
                type="button"
                className={`btn btn-sm ${selectMode === "weekly" ? "btn-primary" : "btn-outline-secondary"}`}
                onClick={() => setSelectMode("weekly")}
              >
                Weekly
              </button>
            </div>
          </div>
        </div>

        <div className="cal-weeklabels" aria-hidden>
          {WEEK_DAYS.map((d) => (<div key={d}>{d}</div>))}
        </div>

        {selectMode === "dates" && (
          <>
            <div className="cal-grid" role="grid" aria-label="Calendar">
              {buildMonthGrid().map((cell, idx) => {
                if (!cell) return <div key={idx} style={{ visibility: "hidden" }} />;
                const key = formatDate(cell);
                const selected = isSelected(key);
                const prev = isPrevSelected(key);
                const next = isNextSelected(key);
                const isAnchor = anchor === key;
                const past = isPast(cell);
                const isToday = key === formatDate(new Date());

                let cls = "cal-day";
                if (isAnchor) cls += " anchor";
                else if (selected) cls += " selected";
                if (selected && !prev && next) cls += " range-left";
                if (selected && prev && next) cls += " range-mid";
                if (selected && prev && !next) cls += " range-right";
                if (selected && !prev && !next) cls += " range-left range-right";
                if (past) cls += " disabled";

                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => toggleDateClick(cell)}
                    aria-pressed={selected}
                    title={past ? "Past date — cannot select" : selected ? "Available — click to edit time" : "Click to start/select range"}
                    className={cls}
                    style={{
                      border: isToday && !selected && !isAnchor ? "1px solid rgba(13,110,253,0.12)" : undefined,
                      padding: 6,
                      cursor: past ? "not-allowed" : "pointer",
                    }}
                    disabled={past}
                  >
                    <span>{cell.getDate()}</span>
                  </button>
                );
              })}
            </div>

            <div style={{ marginTop: 10, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <small className="text-muted">
                Click one date to start (anchor in yellow). Click another to select the inclusive range. Click a selected date to edit time.
              </small>
              <div>
                <button
                  type="button"
                  className="btn btn-sm btn-outline-danger"
                  onClick={() => {
                    setSelectedMap({});
                    setWeeklySchedule(defaultWeeklySchedule());
                    setAnchor(null);
                    setOpenEditor(null);
                    if (onChange) onChange({ selectedDates: [], weeklySchedule: defaultWeeklySchedule() });
                  }}
                >
                  Clear All
                </button>
              </div>
            </div>

            <div className="selected-list">
              {selectedSorted.length === 0 ? (
                <div className="text-muted" style={{ marginTop: 8 }}>No dates selected</div>
              ) : (
                selectedSorted.map((d) => {
                  const t = selectedMap[d];
                  const opened = openEditor === d;
                  return (
                    <div key={d} style={{ display: "flex", gap: 8, alignItems: "center", marginTop: 8 }}>
                      <div style={{ minWidth: 110, fontWeight: 700 }}>{d}</div>
                      {!opened ? (
                        <>
                          <div style={{ color: "#6b7280" }}>{t.start} — {t.end}</div>
                          <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
                            <button type="button" className="btn btn-sm btn-outline-primary" onClick={() => setOpenEditor(d)}>Edit</button>
                            <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => removeDate(d)}>Remove</button>
                          </div>
                        </>
                      ) : (
                        <div style={{ marginLeft: "auto", display: "flex", gap: 8, alignItems: "center" }}>
                          <input type="time" className="form-control form-control-sm" style={{ width: 120 }} value={t.start} onChange={(e) => setDateTime(d, { start: e.target.value })} />
                          <span style={{ color: "#6b7280" }}>to</span>
                          <input type="time" className="form-control form-control-sm" style={{ width: 120 }} value={t.end} onChange={(e) => setDateTime(d, { end: e.target.value })} />
                          <button type="button" className="btn btn-sm btn-success" onClick={() => setOpenEditor(null)}>Done</button>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </>
        )}

        {selectMode === "weekly" && (
          <div style={{ marginTop: 8 }}>
            <small className="text-muted">Set recurring availability for weekdays (applies to every week).</small>
            <div style={{ marginTop: 10 }}>
              {WEEK_DAYS.map((label, idx) => {
                const s = weeklySchedule[idx] || { enabled: false, start: "09:00", end: "17:00" };
                return (
                  <div key={label} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
                    <div style={{ width: 56, fontWeight: 700 }}>{label}</div>
                    <div className="form-check form-switch">
                      <input type="checkbox" id={`ws-${idx}`} className="form-check-input" checked={s.enabled} onChange={() => handleWeekdayToggle(idx)} />
                      <label className="form-check-label" htmlFor={`ws-${idx}`}>{s.enabled ? "Enabled" : "Disabled"}</label>
                    </div>
                    <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
                      <input type="time" className="form-control form-control-sm" style={{ width: 110 }} value={s.start} disabled={!s.enabled} onChange={(e) => handleWeektimeChange(idx, "start", e.target.value)} />
                      <span style={{ alignSelf: "center", color: "#6b7280" }}>to</span>
                      <input type="time" className="form-control form-control-sm" style={{ width: 110 }} value={s.end} disabled={!s.enabled} onChange={(e) => handleWeektimeChange(idx, "end", e.target.value)} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContractorStep5;



