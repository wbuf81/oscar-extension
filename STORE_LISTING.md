# Chrome Web Store Listing Information

Use this information when submitting OSCAR to the Chrome Web Store.

---

## Basic Information

### Extension Name
```
OSCAR - Website Compliance Scanner
```

### Short Description (132 characters max)
```
Scan websites for privacy policies, cookie banners, terms of service & more. 26 compliance checks. Free & privacy-focused.
```

### Detailed Description (16,000 characters max)
```
OSCAR (Obligation Scanning & Compliance Analysis Reporter) is your friendly compliance companion that sniffs out legal and regulatory elements on any website.

WHAT OSCAR DOES
Oscar is a Bernese Mountain Dog who loves checking websites for compliance. With one click, he scans any page and reports what legal protections and policies he finds—or doesn't find.

26 COMPLIANCE CHECKS ACROSS 8 CATEGORIES

Privacy & Data Protection
- Privacy Policy (GDPR, CCPA)
- Do Not Sell / Share (CCPA/CPRA)
- Data Subject Access Request forms

Cookie Compliance
- Cookie Banners & Consent Management
- Cookie Policy pages
- Cookie Preference Settings

Legal Disclosures
- Terms of Service / Terms of Use
- Legal Notice / Impressum
- Dispute Resolution (ODR)
- Contact Information

Consumer Protection
- Refund & Return Policies
- Shipping Information
- Age Verification (COPPA)

Accessibility
- Accessibility Statements (WCAG, ADA)
- HTML Sitemaps

Content & IP
- DMCA / Copyright policies
- Report Abuse mechanisms
- Affiliate Disclosures (FTC)
- Ad Choices / Interest-Based Ads

Corporate Responsibility
- Modern Slavery Statements
- Environmental / ESG policies
- Security & Vulnerability Disclosure

ICANN & Registry Compliance
- WHOIS / RDAP information
- Domain Abuse contacts
- UDRP dispute information
- Registrar details
- Transfer policies

KEY FEATURES

One-Click Scanning
Click the Oscar icon and scan any page instantly. Oscar checks the entire page including footers, lazy-loaded content, and dynamically generated elements.

Multi-Language Support
Oscar understands compliance terminology in 6 languages: English, Spanish, French, German, Dutch, and Portuguese.

Compare Multiple Sites
Use "Compare Tabs" mode to scan multiple websites at once and see how they stack up side-by-side.

Customizable
Train Oscar to focus on what matters to you:
- Enable or disable specific checks
- Adjust importance weights
- Add your own custom search terms

Sniff-O-Meter Dashboard
See exactly how your configuration affects scoring with our visual dashboard. Watch Oscar's mood change based on your coverage level!

Scan History
Review past scans to track compliance across sites you've visited.

100% PRIVATE

Oscar is privacy-first by design:
- All scanning happens locally in YOUR browser
- No data is EVER sent to external servers
- No analytics, no tracking, no telemetry
- Scan history stored only on your device
- Open source - verify our code yourself

WHO IS OSCAR FOR?

- Privacy advocates checking website compliance
- Legal professionals auditing client websites
- Web developers ensuring their sites are compliant
- Business owners verifying their compliance posture
- Anyone curious about a website's legal transparency

PERMISSIONS EXPLAINED

- activeTab: Scan the page you're viewing
- tabs: List tabs for comparison feature
- storage: Save settings & history locally
- scripting: Run the compliance scanner
- all_urls: Scan any website

FREE FOREVER

Oscar is completely free with no premium tiers, no ads, and no data monetization. Just a good boy doing compliance work.

Questions or suggestions? Visit our GitHub page to report issues or contribute!
```

### Category
```
Productivity
```

### Language
```
English (United States)
```

---

## Graphics Requirements

### Store Icon (128x128 PNG)
Use: `icons/icon128.png`

### Screenshots (1280x800 or 640x400 PNG/JPEG)
You need 1-5 screenshots. Recommended screenshots:

1. **Main Popup** - Show the scan results with a good compliance score
2. **Compare Tabs** - Show the multi-tab comparison feature
3. **Train Oscar** - Show the options page with Sniff-O-Meter
4. **Scan History** - Show the history page
5. **About Page** - Show the compliance documentation

### Small Promo Tile (440x280 PNG/JPEG) - Optional
Create a promotional image featuring:
- Oscar the dog mascot
- "Website Compliance Scanner" text
- Key features highlighted

### Large Promo Tile (920x680 PNG/JPEG) - Optional
Larger version of the promo tile

### Marquee Promo Tile (1400x560 PNG/JPEG) - Optional
Wide banner for featured placement

---

## Privacy Practices

### Single Purpose Description
```
OSCAR scans websites to identify legal compliance elements such as privacy policies, cookie banners, terms of service, and other regulatory disclosures.
```

### Permission Justifications

**activeTab**
```
Required to scan the DOM of the currently active tab when the user clicks "Scan This Page". The extension only accesses the tab when the user explicitly initiates a scan.
```

**tabs**
```
Required for the "Compare Tabs" feature which allows users to select and scan multiple open tabs simultaneously for side-by-side compliance comparison.
```

**storage**
```
Required to save user preferences (enabled checks, custom weights, custom search terms) and scan history locally in the browser. No data is synced externally.
```

**contextMenus**
```
Required for the "Scan with OSCAR" right-click context menu option. This allows users to right-click on any page and trigger a compliance scan directly from the browser context menu, without needing to open the extension popup.
```

**scripting**
```
Required to inject the compliance scanning content script into web pages. The script analyzes the page DOM to find compliance-related links and elements.
```

**host_permissions (<all_urls>)**
```
Required to allow scanning of any website the user visits. The scanner only runs when explicitly triggered by the user clicking the scan button—it does not automatically scan pages.
```

### Data Usage Disclosure
- [ ] Does not collect user data
- [ ] Does not sell user data to third parties
- [ ] Does not use user data for purposes unrelated to the item's single purpose
- [ ] Does not transfer user data for creditworthiness/lending purposes

### Privacy Policy URL
```
https://github.com/wbuf81/oscar-extension/blob/main/PRIVACY_POLICY.md
```

---

## Distribution

### Visibility
```
Public
```

### Regions
```
All regions
```

### Pricing
```
Free
```

---

## Support

### Support URL (optional)
```
https://github.com/wbuf81/oscar-extension/issues
```

### Homepage URL (optional)
```
https://github.com/wbuf81/oscar-extension
```

---

## Checklist Before Submission

- [ ] All icons are present (16, 32, 48, 128 PNG)
- [ ] Screenshots prepared (1280x800 or 640x400)
- [ ] Privacy policy hosted at accessible URL
- [ ] Extension tested on multiple websites
- [ ] No console errors in background script
- [ ] No console errors in popup
- [ ] No console errors in options page
- [ ] manifest.json validates without errors
- [ ] All required fields completed in Developer Dashboard
- [ ] Paid the one-time $5 developer registration fee (if not already)

---

## Notes for Review

If Google requests additional information during review, here are helpful responses:

**Why do you need <all_urls>?**
"OSCAR is a website compliance scanner that users can run on any website to check for privacy policies, terms of service, and other legal disclosures. The broad host permission is required because users need to scan arbitrary websites—we cannot predict which sites users will want to analyze. The extension only accesses page content when the user explicitly clicks the scan button."

**Why do you need the tabs permission?**
"The tabs permission enables our 'Compare Tabs' feature, which allows users to select multiple open browser tabs and scan them simultaneously for side-by-side compliance comparison. This is a core feature for users who need to compare multiple websites' compliance postures."

**Do you collect any user data?**
"No. All processing happens locally in the browser. No data is transmitted to any external servers. Scan history and user settings are stored only in chrome.storage.local and never leave the user's device."
