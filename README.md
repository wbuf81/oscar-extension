# OSCAR - Website Compliance Scanner

**OSCAR** (Obligation Scanning & Compliance Analysis Reporter) is a free, privacy-focused browser extension that automatically scans websites to identify privacy policies, cookie banners, terms of service, and other legal compliance elements—even when they're hidden in footers, lazy-loaded, or presented in multiple languages.

## Features

- **One-Click Scan**: Instantly scan the current page for compliance elements
- **Multi-Tab Compare**: Select multiple tabs and compare their compliance side-by-side
- **26 Compliance Checks**: Comprehensive scanning across 8 categories
- **Multi-Language Support**: Detects compliance links in English, Spanish, French, German, Dutch, and Portuguese
- **Smart Detection**: Finds legal links even when hidden in footers, lazy-loaded content, or using non-standard naming
- **Compliance Scoring**: Get a weighted score (0-100%) based on found compliance elements
- **Customizable**: Enable/disable checks, adjust weights, add custom searches
- **Sniff-O-Meter**: Visual dashboard showing your scan configuration
- **Scan History**: View past scan results stored locally
- **Privacy-First**: All scanning happens client-side—no data sent to servers

## What OSCAR Detects

### Privacy & Data Protection
| Element | Default | Description |
|---------|---------|-------------|
| Privacy Policy | Enabled | Privacy policy, privacy notice, data protection |
| Do Not Sell (CCPA) | Enabled | CCPA/CPRA opt-out links |
| Data Subject Request | Optional | DSAR forms, data access portals |

### Cookie Compliance
| Element | Default | Description |
|---------|---------|-------------|
| Cookie Banner | Enabled | Cookie consent dialogs and CMPs (OneTrust, Cookiebot, etc.) |
| Cookie Policy | Enabled | Dedicated cookie policy pages |
| Cookie Settings | Enabled | Cookie preference centers |

### Legal Disclosures
| Element | Default | Description |
|---------|---------|-------------|
| Terms of Service | Enabled | Terms of use, user agreements |
| Legal Notice / Impressum | Enabled | Legal information, imprint (required in EU) |
| Dispute Resolution | Optional | Arbitration, ODR links |
| Contact Information | Optional | Contact details |

### Consumer Protection
| Element | Default | Description |
|---------|---------|-------------|
| Refund / Return Policy | Optional | Return and refund policies |
| Shipping Policy | Optional | Shipping and delivery information |
| Age Verification | Optional | Age gates, COPPA compliance |

### Accessibility & Inclusion
| Element | Default | Description |
|---------|---------|-------------|
| Accessibility Statement | Optional | WCAG, ADA, EAA compliance |
| Sitemap | Optional | HTML sitemaps |

### Content & Intellectual Property
| Element | Default | Description |
|---------|---------|-------------|
| DMCA / Copyright | Optional | Copyright policies |
| Report Abuse | Optional | Abuse reporting mechanisms (DSA) |
| Affiliate Disclosure | Optional | FTC disclosure requirements |
| Ad Choices | Optional | Interest-based advertising opt-out |

### Corporate Responsibility
| Element | Default | Description |
|---------|---------|-------------|
| Modern Slavery Statement | Optional | UK/Australia Modern Slavery Act |
| Environmental / Sustainability | Optional | ESG, CSRD disclosures |
| Security / Vulnerability Disclosure | Optional | Bug bounty, security.txt |

### ICANN & Registry Compliance
| Element | Default | Description |
|---------|---------|-------------|
| WHOIS / RDAP Lookup | Optional | Domain registration data services |
| Domain Abuse Contact | Optional | RAA Section 3.18 abuse reporting |
| UDRP / Domain Disputes | Optional | Domain dispute resolution |
| Registrar Information | Optional | ICANN-accredited registrar details |
| Domain Transfer Policy | Optional | Transfer authorization and policies |

## Installation

### From Chrome Web Store
1. Visit the [OSCAR extension page](#) on the Chrome Web Store
2. Click "Add to Chrome"
3. The OSCAR icon will appear in your toolbar

### From Source (Developer Mode)
1. Clone or download this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" in the top right corner
4. Click "Load unpacked"
5. Select the `oscar-extension` folder
6. The OSCAR icon will appear in your toolbar

## Usage

1. **Scan Current Page**: Click the OSCAR icon, then click "Scan This Page"
2. **Compare Tabs**: Switch to "Compare Tabs" mode, select tabs, and click "Scan Selected"
3. **Train Oscar**: Customize which compliance elements to check and their weights
4. **View History**: Access your scan history to track compliance across sites

## Privacy

OSCAR is designed with privacy as a core principle:

- **100% Local Processing**: All scanning happens in your browser
- **No External Servers**: No data is ever sent to external servers
- **No Tracking**: No analytics, no telemetry, no user tracking
- **Local Storage Only**: Scan history stored only in your browser
- **You Control Your Data**: Clear history at any time

## Permissions Explained

| Permission | Why It's Needed |
|------------|-----------------|
| `activeTab` | To scan the current page when you click "Scan" |
| `tabs` | To list and compare multiple open tabs |
| `storage` | To save your settings and scan history locally |
| `scripting` | To inject the scanner into web pages |
| `<all_urls>` | To scan any website you visit |

## Project Structure

```
oscar-extension/
├── manifest.json          # Extension manifest (v3)
├── popup/                  # Main popup UI
├── options/               # Settings page ("Train Oscar")
├── about/                 # About page with compliance documentation
├── history/               # Scan history viewer
├── content/               # Content scripts for DOM scanning
├── background/            # Service worker
├── utils/                 # Shared utilities and patterns
└── icons/                 # Extension icons
```

## Why "OSCAR"?

OSCAR is named after a wise Bernese Mountain Dog who carefully reviews every document that crosses his desk. Like his namesake, this extension is:

- **Thorough**: Checks every corner of the page
- **Multi-lingual**: Understands legal terms in 6 languages
- **Trustworthy**: All processing happens locally
- **Well-trained**: Customizable to your needs

## Contributing

Contributions are welcome! Please feel free to submit issues or pull requests.

## License

MIT License - see LICENSE file for details.

## Support

If you encounter issues or have suggestions, please [open an issue](https://github.com/anthropics/oscar-extension/issues) on GitHub.

---

Made with care for compliance professionals, privacy advocates, and anyone who wants to understand what legal protections websites offer.
