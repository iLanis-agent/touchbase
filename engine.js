/* TouchBase engine - keep-in-touch cadence tracking. */
const TouchEngine = (() => {
  'use strict';

  const DAY_MS = 86400000;

  function parseDay(s) {
    if (typeof s !== 'string') throw new Error('date must be a string');
    const m = s.trim().match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (!m) throw new Error('bad date format, want YYYY-MM-DD');
    const y = +m[1], mo = +m[2], d = +m[3];
    if (mo < 1 || mo > 12 || d < 1 || d > 31) throw new Error('date out of range');
    const ms = Date.UTC(y, mo - 1, d);
    const dt = new Date(ms);
    if (dt.getUTCMonth() !== mo - 1 || dt.getUTCDate() !== d) throw new Error('impossible date');
    return Math.floor(ms / DAY_MS);
  }

  function fmtDay(dayNum) {
    const dt = new Date(dayNum * DAY_MS);
    return dt.getUTCFullYear() + '-' + String(dt.getUTCMonth() + 1).padStart(2, '0') + '-' + String(dt.getUTCDate()).padStart(2, '0');
  }

  function todayDay(nowMs) {
    return Math.floor((nowMs === undefined ? Date.now() : nowMs) / DAY_MS);
  }

  function normContact(c) {
    if (!c || typeof c.name !== 'string' || !c.name.trim()) throw new Error('contact needs a name');
    const cad = Math.round(Number(c.cadenceDays));
    if (!Number.isFinite(cad) || cad < 1 || cad > 365) throw new Error('cadence must be 1-365 days');
    const last = parseDay(c.lastContact);
    return { name: c.name.trim(), cadenceDays: cad, lastContact: fmtDay(last), note: (c.note || '').slice(0, 200) };
  }

  // dueIn < 0 means overdue by -dueIn days. state: overdue | soon (<=3 days) | ok
  function statusFor(c, today) {
    const t = (today === undefined) ? todayDay() : today;
    const daysSince = t - parseDay(c.lastContact);
    const dueIn = c.cadenceDays - daysSince;
    const state = dueIn < 0 ? 'overdue' : (dueIn <= 3 ? 'soon' : 'ok');
    return { daysSince: daysSince, dueIn: dueIn, state: state };
  }

  function rankContacts(list, today) {
    return list.map(c => {
      const s = statusFor(c, today);
      return { name: c.name, cadenceDays: c.cadenceDays, lastContact: c.lastContact, note: c.note || '',
        daysSince: s.daysSince, dueIn: s.dueIn, state: s.state };
    }).sort((a, b) => a.dueIn - b.dueIn || a.name.localeCompare(b.name));
  }

  function summary(list, today) {
    const ranked = rankContacts(list, today);
    return {
      total: ranked.length,
      overdue: ranked.filter(r => r.state === 'overdue').length,
      dueSoon: ranked.filter(r => r.state === 'soon').length,
      ok: ranked.filter(r => r.state === 'ok').length,
      next: ranked.length ? ranked[0].name : null
    };
  }

  const CADENCES = [
    { label: 'Weekly', days: 7 },
    { label: 'Every 2 weeks', days: 14 },
    { label: 'Monthly', days: 30 },
    { label: 'Every 2 months', days: 60 },
    { label: 'Quarterly', days: 90 },
    { label: 'Twice a year', days: 180 }
  ];

  return { parseDay, fmtDay, todayDay, normContact, statusFor, rankContacts, summary, CADENCES };
})();
if (typeof module !== 'undefined') module.exports = TouchEngine;
