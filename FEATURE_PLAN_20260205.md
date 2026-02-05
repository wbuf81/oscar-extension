# OSCAR Feature Plan - February 5, 2026

## Executive Summary

OSCAR v1.2.0 is a remarkably complete compliance scanner with strong detection, a charming personality, and thoughtful UI. The core loop works: scan, score, review. But the app stops short of the **action layer** — users discover compliance gaps but can't do anything with that discovery. The biggest opportunity right now is making OSCAR indispensable for professionals by closing the gap between "I found something" and "I communicated it to someone." Export, reports, and workflow features will transform OSCAR from a curiosity tool into a daily-use professional instrument.

## Current State

### What's Working
- **Core scanning is solid.** 26 checks, 6 languages, multi-method detection (DOM, URL paths, text, CMP globals, consent storage). Reliable and fast.
- **Deep Scan is a genuine differentiator.** Fetching and parsing linked documents (HTML + PDF) to find compliance mentions others miss. This is best-in-class.
- **Force Cookie Banner is clever.** Detecting 10+ CMP providers and triggering re-consent is a feature no competitor offers this cleanly.
- **Train Oscar / Sniff-O-Meter is surprisingly deep.** Custom weights, custom keywords, visual feedback — power-user customization wrapped in accessible UI.
- **History + Compare are functional.** Search, filter, compare up to 4 scans side-by-side with a proper modal.
- **Personality is consistent.** Oscar's mood, speech bubbles, animations, and error messages make compliance scanning feel approachable. This is a real moat.

### What's Almost There (80% done)
- **Compare from History** — users can compare scans from history, but there's no way to compare the *same site* scanned at different times to track compliance changes. The data is there; the view isn't.
- **Quick Stats in popup** — shows scans/avg/sites, but disappears if no history. Could do more (trending, recently scanned, quick rescan).
- **Deep Scan eligibility** — smart about which documents can be scanned, but the UX of "scan first, then maybe deep scan" is two-step when it could be one.

### What's Missing
- **No export or share capability whatsoever.** A compliance professional scans a site, sees the results... and then what? Screenshots? Manual transcription? This is the #1 gap.
- **No right-click context menu.** Power users expect "Scan this page with OSCAR" in the context menu.
- **No keyboard shortcut to scan.** No way to trigger a scan without clicking the popup.
- **No first-run onboarding.** New users see the popup cold with no guidance on what the checks mean or what a good score looks like.
- **No scan presets/profiles.** Train Oscar is powerful but there's only one configuration. EU auditors, US e-commerce, and general users all want different defaults.
- **No dark mode.** Warm brown theme is lovely but doesn't respect OS dark mode preference.
- **No guidance for failures.** "Not Found" items offer no suggestions — what is a privacy policy? Why does it matter? What should the user tell the site owner?

### What's at Risk
- **History is capped at 50.** Professionals scanning 10+ sites/day will hit this in a week. No export means lost data.
- **Popup height could become an issue.** Lots of content (header, stats, mode tabs, scan button, cookie button, deep scan, results, footer) in a 420px-wide popup. Results with many categories push scrolling.
- **No test automation.** Tests exist (tests/) but appear to be manual HTML-based runners. No CI, no automated regression protection before Chrome Web Store updates.

---

## Phase 1: Ship This Week
*High impact, low effort. The "how is this not already there?" features.*

### 1.1 Export Scan Results to Clipboard
**What it does:** Adds a "Copy Results" button to scan results (both single and compare). Copies a clean, formatted text summary to clipboard: site URL, score, date, and a checklist of found/not-found items.

**Why it matters now:** This is the single most-requested feature type for audit tools. Compliance pros need to paste results into emails, Slack, tickets, and reports. Zero export = zero workflow integration.

**What it builds on:** `scanResults` already contains everything needed. Just formatting and `navigator.clipboard.writeText()`.

**What it doesn't touch:** No new pages, no storage changes, no permissions changes.

**Implementation context:** Add a "Copy Results" button next to "Clear Results" in the footer area. Format as markdown-compatible text. Show a toast (reuse `showCookieToast`) confirming copy.

---

### 1.2 Context Menu: "Scan with OSCAR"
**What it does:** Right-click anywhere on a page and select "Scan this page with OSCAR." Triggers the same scan as clicking the popup button, shows the score in the badge.

**Why it matters now:** Reduces friction from 3 clicks (click icon, wait for popup, click scan) to 1 right-click + 1 click. Power users and keyboard-oriented users expect this.

**What it builds on:** `scanTab()` in service-worker.js already handles the full scan flow. Just needs a context menu trigger.

**What it doesn't touch:** No UI changes to popup. No new permissions needed (`contextMenus` may need to be added to manifest).

**Implementation context:** Use `chrome.contextMenus.create()` in service worker's `onInstalled`. On click, call existing `scanTab()`, update badge. Note: requires adding `"contextMenus"` to manifest permissions array.

---

### 1.3 Keyboard Shortcut to Scan
**What it does:** Pressing a configurable keyboard shortcut (default: `Ctrl+Shift+O` / `Cmd+Shift+O`) triggers a scan of the current tab without opening the popup.

**Why it matters now:** Professional users scanning dozens of sites per day need speed. Keyboard shortcuts are table-stakes for productivity tools.

**What it builds on:** Same `scanTab()` flow. Uses Chrome's `commands` API.

**What it doesn't touch:** No popup UI changes.

**Implementation context:** Add `commands` to manifest.json with `_execute_action` or a custom command. Handle in service worker. Show badge with score. Could optionally open popup with results.

---

### 1.4 Expand History Limit + Export History to CSV
**What it does:** Raises history cap from 50 to 200. Adds an "Export CSV" button on the history page that downloads all scan history as a CSV file (URL, score, date, found items).

**Why it matters now:** 50 scans is less than a week of professional use. Without export, data is trapped. CSV is the universal interchange format — opens in Excel, Google Sheets, Airtable, anything.

**What it builds on:** History data already contains everything needed. Just needs CSV formatting and `Blob` download.

**What it doesn't touch:** No new permissions. No popup changes.

**Implementation context:** Add export button to history page header (next to "Clear All History"). Generate CSV with columns: URL, Hostname, Score, Score Label, Date, then one column per compliance check (TRUE/FALSE). Use `URL.createObjectURL(new Blob(...))` with a download link.

---

### 1.5 "What's This?" Tooltips on Compliance Items
**What it does:** Adds a small info icon next to each compliance item name in results. Hovering/clicking shows a brief explanation: what the item is, why it matters, and what regulation requires it.

**Why it matters now:** Half the value of OSCAR's 26 checks is wasted if users don't understand what "UDRP" or "DSAR" means. Education converts casual users into power users who enable more checks.

**What it builds on:** Compliance items already have labels and categories. Just needs a tooltip layer with static content.

**What it doesn't touch:** No scanning logic changes. No permissions changes.

**Implementation context:** Create a `COMPLIANCE_INFO` constant mapping each key to a short description (1-2 sentences). Render as a `title` attribute or a CSS-only tooltip on the compliance item name. Keep it lightweight — no tooltip library needed.

---

## Phase 2: Ship This Sprint
*More effort, significant value. Features that make the app feel professional.*

### 2.1 Scan Presets: Quick Profiles
**What it does:** Adds 3-4 pre-built configurations to Train Oscar: "EU Compliance" (heavy on GDPR, cookie, impressum), "US E-Commerce" (CCPA, returns, shipping, FTC), "Registry/Domain" (WHOIS, UDRP, registrar), and "Quick Scan" (top 5 checks only). One-click to apply a preset without losing custom settings (saves current as "Custom" first).

**Why it matters now:** Train Oscar is powerful but requires expertise to configure well. Presets give instant value to new users and let professionals switch contexts quickly (auditing an EU site vs. a US site).

**What it builds on:** `trainingSettings` storage structure already supports arbitrary enable/disable and weights. Presets are just predefined setting objects.

**What it doesn't touch:** No scanning logic changes. No new permissions.

**Implementation context:** Add a "Presets" section at the top of options.html with preset cards. Each preset is a hardcoded settings object. "Apply Preset" saves current settings to a `previousSettings` key first (for undo), then overwrites `trainingSettings`. Show an undo toast.

---

### 2.2 Same-Site Trend View in History
**What it does:** When viewing a scan in history, shows previous scans of the same hostname with a simple sparkline or score progression. Answers: "Is this site getting more or less compliant over time?"

**Why it matters now:** Compliance monitoring is a recurring task. Professionals re-scan sites quarterly. This turns OSCAR from a point-in-time tool into a monitoring tool — a fundamentally different value proposition.

**What it builds on:** History already stores URL and hostname. Just needs grouping and a simple visualization.

**What it doesn't touch:** No scanning logic changes. No new permissions.

**Implementation context:** In the detail modal (`openDetailModal`), query `historyData` for same hostname, sort by date, render as a small list with score badges or a simple SVG sparkline. Show "First scan" or "Improved by X%" or "Declined by X%" summary.

---

### 2.3 PDF Report Generation
**What it does:** Adds a "Download Report" button to scan results. Generates a branded PDF with: OSCAR logo, site URL, scan date, overall score with gauge, category breakdown, and full compliance checklist with found/not-found status and linked URLs.

**Why it matters now:** This is what compliance professionals actually deliver: reports. A PDF they can attach to an email, save to a client folder, or present in a meeting. This is the feature that makes OSCAR worth recommending.

**What it builds on:** All data is already in `scanResults`. PDF generation can use a lightweight approach (HTML-to-canvas or a pure-JS PDF library).

**What it doesn't touch:** No scanning logic changes.

**Implementation context:** Consider using the already-bundled PDF.js (read-only) alongside a lightweight PDF creation approach: generate an HTML template, render to canvas with `html2canvas`, then convert to PDF. Alternatively, use `jsPDF` (small footprint). The report should match Oscar's visual language — warm browns, the dog mascot, score gauges.

---

### 2.4 Auto-Scan on Navigation (Opt-in)
**What it does:** Adds a toggle in settings: "Automatically scan pages as I browse." When enabled, OSCAR silently scans each page after load and updates the badge with the score. No popup, no interruption — just a persistent score indicator.

**Why it matters now:** Transforms OSCAR from an on-demand tool to a passive awareness layer. Users see compliance scores as they browse without any effort. This is the #1 retention mechanism — always-visible value.

**What it builds on:** `scanTab()` already works. Content script already runs at `document_idle`. Just needs a trigger from the service worker on tab update.

**What it doesn't touch:** No popup UI changes (except the settings toggle). Existing scan-on-demand still works.

**Implementation context:** Listen to `chrome.tabs.onUpdated` with `status === 'complete'`. Check if auto-scan is enabled in storage. If yes, run `scanTab()` silently (don't save to history on auto-scan — or save to a separate lightweight history). Update badge only. Add a setting toggle to options page.

---

### 2.5 Actionable "Not Found" Guidance
**What it does:** When a compliance item shows "Not Found," tapping it expands a brief explanation: what the item is, why it matters, and a suggested action (e.g., "Consider adding a privacy policy. Required by GDPR for EU visitors. Here's a template link.").

**Why it matters now:** "Not Found" is a dead end today. Making it actionable turns OSCAR from a diagnostic tool into an advisory tool. This is the difference between "your site is missing X" and "here's what you should do about X."

**What it builds on:** Same results rendering in popup.js. Adds expandable content below each compliance item.

**What it doesn't touch:** No scanning logic changes. No new permissions.

**Implementation context:** Create a `COMPLIANCE_GUIDANCE` constant with per-item recommendations. Make "Not Found" items clickable to expand a guidance card below them. Include: 1-sentence description, relevant regulation(s), and a suggested action. Keep it educational, not prescriptive.

---

## Phase 3: Ship This Quarter
*Strategic investment. Features that create moats.*

### 3.1 Scheduled Monitoring & Alerts
**What it does:** Users can "Watch" a site. OSCAR periodically re-scans watched sites (daily/weekly, configurable) and shows a notification if the compliance score changes significantly (drops by 10+ points, or a critical item disappears).

**Why it matters now:** This is the compliance monitoring use case that professionals will pay for. No other free extension does this. It's the feature that makes OSCAR irreplaceable once set up.

**What it builds on:** `scanTab()` works. History exists. Chrome alarms API for scheduling. Notifications API for alerts.

**What it doesn't touch:** Core scanning logic unchanged.

**Implementation context:** Use `chrome.alarms` to schedule periodic checks. Store a `watchedSites` list with URLs and check frequency. On alarm, create a temporary tab (or use `fetch` + content script injection for background scanning), scan, compare with last known score, send `chrome.notifications` if threshold is exceeded. Requires `alarms` and `notifications` permissions.

---

### 3.2 Team/Shared Configurations
**What it does:** Users can export their Train Oscar configuration as a shareable JSON file and import configurations from others. A compliance team lead configures OSCAR once, exports the config, and everyone on the team imports it.

**Why it matters now:** Once you have presets (Phase 2.1), the next question is "how do I share my config with my team?" This is a natural expansion that enables organizational adoption.

**What it builds on:** `trainingSettings` is already a JSON object in storage. Export = serialize. Import = validate + store.

**What it doesn't touch:** No scanning changes. No new permissions.

**Implementation context:** Add "Export Config" and "Import Config" buttons to options page. Export downloads a `.oscar-config.json` file. Import reads and validates the file structure before applying. Include a version field for forward compatibility.

---

### 3.3 Compliance Dashboard (New Tab Override or Dedicated Page)
**What it does:** A full-page dashboard showing: all watched sites with current scores, trend charts, category heatmap across sites, top compliance gaps across all scanned sites, and recently changed items. Think "compliance portfolio view."

**Why it matters now:** Once users have 50+ scans and watched sites, they need a bird's-eye view. This is the feature that turns OSCAR from a per-site tool into a portfolio management tool.

**What it builds on:** History data, watched sites (3.1), training settings. All data is local.

**What it doesn't touch:** Core scanning unchanged.

**Implementation context:** New full-page HTML (e.g., `dashboard/dashboard.html`). Accessible from popup header nav. Uses aggregated history data to render charts (CSS-only bar charts or lightweight canvas). No external charting library needed for v1 — keep it simple with CSS grid and calculated widths.

---

### 3.4 Firefox / Edge / Safari Port
**What it does:** Packages OSCAR for Firefox Add-ons, Edge Add-ons, and Safari Web Extensions.

**Why it matters now:** Chrome market share is dominant but not exclusive. Compliance professionals often use multiple browsers. Firefox is particularly popular in privacy-conscious communities — OSCAR's core audience.

**What it builds on:** Manifest V3 is mostly cross-browser. Safari requires Xcode wrapper.

**What it doesn't touch:** Core logic is browser-agnostic.

**Implementation context:** Firefox: convert manifest to Firefox-compatible V3 (minor differences in `background` declaration, `browser_specific_settings`). Edge: mostly works as-is. Safari: requires Xcode project with Web Extension wrapper. Consider `webextension-polyfill` for API normalization.

---

## Parking Lot
*Too early or too expensive right now. Don't forget them.*

- **API / CLI mode** — Let developers scan URLs programmatically from the command line or CI/CD pipelines. Huge value for DevOps compliance checks, but requires rearchitecting the scanning engine to work outside a browser context.
- **Compliance templates** — Pre-built checklists for specific regulations (GDPR Article 13, CCPA, DSA). Maps OSCAR checks to specific regulatory requirements. Needs legal review.
- **AI-powered analysis** — Use an LLM to read privacy policy text and summarize: is it actually compliant, or just present? (e.g., "Privacy policy found, but does not mention data retention periods"). Massively valuable but requires external API calls, breaking the privacy-first promise unless run locally.
- **Collaborative annotations** — Let team members add notes to scan results ("CEO approved this exception," "Filed ticket #123 for missing cookie policy"). Requires a sync layer.
- **Competitor benchmarking** — Enter your site + 3 competitors, get a comparison dashboard. Compelling for marketing/sales compliance teams. Feasible but needs the dashboard (3.3) first.
- **Internationalization of the UI itself** — OSCAR detects compliance in 6 languages but the UI is English-only. Localizing the extension UI would expand addressable market significantly.

---

## Rejected Ideas

### Browser Sidebar Panel
Considered making OSCAR a persistent sidebar that shows compliance status as you browse. Rejected because: (1) sidebar API has limited browser support, (2) a persistent panel is overkill for a scan-and-review workflow, (3) the popup + badge + auto-scan covers the same need with less screen real estate.

### Social/Community Features
Considered a "compliance leaderboard" or "share your score" social feature. Rejected because: (1) compliance is a professional/regulatory concern, not a social one, (2) gamification could trivialize serious compliance gaps, (3) any data sharing conflicts with the privacy-first brand promise.

### Built-in Remediation / Fix-It Mode
Considered adding "fix this for me" features that inject missing compliance elements. Rejected because: (1) injecting content into pages the user doesn't own is ethically and legally questionable, (2) compliance policy content requires legal expertise OSCAR can't provide, (3) liability risk is extreme.

### Monetization via Premium Tier
Considered gating advanced features (deep scan, presets, PDF export) behind a paid tier. Rejected for now because: (1) the extension is marketed as "Free Forever" in the store listing, (2) user trust is the primary growth lever at this stage, (3) better to build a large free user base first and monetize via team/enterprise features later (shared configs, scheduled monitoring, dashboard).

### Blockchain-Based Compliance Certificates
Considered issuing verifiable compliance scan certificates on-chain. Rejected because: (1) adds enormous complexity for negligible user value, (2) a scan is a point-in-time snapshot — a "certificate" implies ongoing validity it can't guarantee, (3) the target audience doesn't care about blockchain.

---

## Dependency Map

```
Phase 1 (independent, can ship in any order):
  1.1 Export to Clipboard
  1.2 Context Menu
  1.3 Keyboard Shortcut
  1.4 History Export + Limit Increase
  1.5 Tooltips

Phase 2 (mostly independent, one dependency):
  2.1 Scan Presets
  2.2 Same-Site Trends (needs history data — already exists)
  2.3 PDF Report (benefits from 1.5 tooltip content for descriptions)
  2.4 Auto-Scan
  2.5 Actionable Guidance (benefits from 1.5 tooltip content)

  2.3 ← soft dependency on 1.5 (reuse compliance descriptions)
  2.5 ← soft dependency on 1.5 (reuse compliance descriptions)

Phase 3 (sequential dependencies):
  3.1 Scheduled Monitoring ← requires 2.4 Auto-Scan patterns
  3.2 Team Configs ← requires 2.1 Presets
  3.3 Dashboard ← requires 3.1 Watched Sites + 2.2 Trends
  3.4 Browser Ports ← independent but should wait until feature-stable
```
