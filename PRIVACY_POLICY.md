# Privacy Policy for OSCAR - Website Compliance Scanner

**Last Updated:** January 30, 2025

## Overview

OSCAR (Obligation Scanning & Compliance Analysis Reporter) is a browser extension designed to help users identify legal compliance elements on websites. We are committed to protecting your privacy and being transparent about our practices.

## Data Collection

### What We DON'T Collect

OSCAR does NOT collect, transmit, or share:

- Personal information
- Browsing history
- Website content
- IP addresses
- Location data
- Device identifiers
- Analytics or telemetry data
- Any data to external servers

### What Is Stored Locally

The following data is stored **only in your browser's local storage** and never leaves your device:

1. **Scan History**: Results of compliance scans you perform, including:
   - Website URLs you scanned
   - Compliance elements found
   - Compliance scores
   - Timestamps

2. **User Settings**: Your customization preferences, including:
   - Which compliance checks are enabled/disabled
   - Custom weight configurations
   - Custom search terms you add
   - UI preferences (collapsed categories, etc.)

## Data Processing

All data processing occurs **entirely within your browser**:

- When you scan a website, OSCAR analyzes the page's DOM (Document Object Model) locally
- No website content is sent to external servers
- No network requests are made to any servers owned or operated by OSCAR
- The extension works completely offline after installation

## Data Storage

- All data is stored using Chrome's `chrome.storage.local` API
- Data remains on your device only
- You can clear all stored data at any time through the extension's History page
- Uninstalling the extension removes all stored data

## Permissions Explained

OSCAR requires certain browser permissions to function. Here's why each is needed:

| Permission | Purpose |
|------------|---------|
| `activeTab` | Allows scanning the currently active tab when you click "Scan" |
| `tabs` | Enables the "Compare Tabs" feature to list and scan multiple tabs |
| `storage` | Saves your settings and scan history locally in your browser |
| `scripting` | Injects the compliance scanner script into web pages |
| `<all_urls>` | Allows scanning any website (the scanner only runs when you initiate a scan) |

## Third-Party Services

OSCAR does not use any third-party services, including:

- No analytics services (Google Analytics, etc.)
- No advertising networks
- No crash reporting services
- No external APIs
- No cloud storage

## Children's Privacy

OSCAR does not collect any personal information from anyone, including children under 13.

## Changes to This Policy

We may update this privacy policy from time to time. Any changes will be reflected in the "Last Updated" date at the top of this policy. Continued use of the extension after changes constitutes acceptance of the updated policy.

## Your Rights

Since all data is stored locally on your device:

- You have complete control over your data
- You can view your scan history within the extension
- You can delete all data by clearing history or uninstalling the extension
- No data access requests are necessary since we don't have your data

## Open Source

OSCAR is open source. You can review our code to verify our privacy practices at:
https://github.com/anthropics/oscar-extension

## Contact

If you have questions about this privacy policy or the extension's privacy practices, please open an issue on our GitHub repository.

---

**Summary**: OSCAR processes everything locally in your browser. We don't collect, store, or transmit any of your data. Your privacy is protected by design.
