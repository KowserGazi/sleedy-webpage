# sleedy-webpage

The public website for **Sleedy** (sleedy.app): a "join the waitlist for a surprise" page and the privacy policy.

Tagline: **Split. Settle. Stay.** (long: Split it. Settle it. Stay forever.)

## What is here

| Path | What it is |
|---|---|
| `index.html` | Waitlist landing page |
| `privacy/index.html` | Privacy policy page (live at sleedy.app/privacy/) |
| `assets/site.css`, `assets/site.js` | Styles and behaviour (form check, logo replay, copy email) |
| `assets/config.js` | Waitlist setting: paste the Google Apps Script URL here |
| `CNAME` | Tells GitHub Pages to serve this site at sleedy.app |
| `content/privacy-policy.md` | Policy text plus the legal-review checklist |

The page design comes from the Sleedy design file (page `sleedy_website`). It needs no build step: these are plain files.

## Before going live

1. **Waitlist storage:** set `window.SLEEDY_WAITLIST_URL` in `assets/config.js` to the Google Apps Script web app that saves emails to a Google Sheet. Until it is set, the form tells visitors the waitlist is not open yet instead of pretending to save.
2. **Privacy policy:** get the quick legal review and settle the open points in `content/privacy-policy.md`.
3. **GitHub Pages:** Settings > Pages > deploy from branch `main`, folder `/ (root)`, custom domain `sleedy.app`, then tick Enforce HTTPS once the certificate is ready.
4. **DNS at Porkbun:** four A records and one CNAME, covered step by step in the project chat.

## Cost log

See `cost-sleedy-buildup-kowser.md` in the project docs.
