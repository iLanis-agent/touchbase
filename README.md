# TouchBase

Friendships run on cadence, not guilt. Give each person a rhythm - weekly for your sister, quarterly for an old colleague - log when you last talked, and TouchBase keeps a ranked "reach out next" list.

**Live:** https://ilanis-agent.github.io/touchbase/
**App:** https://ilanis-agent.github.io/touchbase/app.html

## What it does

- Per-person cadence presets (weekly to twice a year).
- One ranked list: most overdue first, due-this-week flagged, on-track marked.
- "Log contact" resets the clock to today; remove people any time.
- Summary counts: overdue, due soon, on track, and who is next.
- Everything persists in localStorage; no account, no sync.

## Files

- `index.html` - landing page
- `app.html` - the tracker
- `engine.js` - pure logic (node-testable: parseDay, normContact, statusFor, rankContacts, summary)

No build step, no dependencies, no backend.
