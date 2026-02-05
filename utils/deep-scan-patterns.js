// Deep Scan Patterns for finding compliance content in document bodies
// These patterns are used to search for compliance language in Terms of Service,
// Privacy Policy, and Legal pages when the main page scan doesn't find dedicated links

export const DEEP_SCAN_PATTERNS = {
  dmca: {
    label: 'DMCA / Copyright',
    patterns: [
      // Explicit DMCA mentions
      'digital millennium copyright act',
      'dmca agent',
      'dmca notice',
      'dmca policy',
      'dmca takedown',
      'dmca designated agent',
      // Copyright infringement reporting
      'copyright infringement',
      'report copyright',
      'copyright complaint',
      'copyright notice',
      'copyright agent',
      'designated agent for copyright',
      'notice of infringement',
      'infringing material',
      'counter-notification',
      'counter notification',
      // Specific language often found in DMCA sections
      'we respond to notices of alleged copyright infringement',
      'repeat infringer policy',
      '17 u.s.c. 512',
      'section 512'
    ],
    minMatches: 2 // Require at least 2 pattern matches for confidence
  },

  dispute: {
    label: 'Dispute Resolution',
    patterns: [
      // Arbitration
      'binding arbitration',
      'arbitration agreement',
      'arbitration provision',
      'arbitration clause',
      'arbitration proceedings',
      'american arbitration association',
      'aaa arbitration',
      'jams arbitration',
      // Class action waiver
      'class action waiver',
      'waive class action',
      'waiver of class',
      'no class actions',
      'class arbitration waiver',
      'class-wide arbitration',
      // Dispute resolution
      'dispute resolution',
      'resolving disputes',
      'informal dispute resolution',
      'mandatory arbitration',
      'opt-out of arbitration',
      // Jurisdiction
      'exclusive jurisdiction',
      'governing law',
      'choice of law',
      'venue for disputes'
    ],
    minMatches: 2
  },

  reportAbuse: {
    label: 'Report Abuse',
    patterns: [
      'report abuse',
      'report abusive',
      'abuse report',
      'content removal request',
      'report violation',
      'report inappropriate',
      'flag content',
      'report content',
      'report user',
      'trust and safety',
      'community guidelines violation',
      'report a problem',
      'report illegal content',
      'report harmful content'
    ],
    minMatches: 1
  },

  doNotSell: {
    label: 'Do Not Sell (CCPA)',
    patterns: [
      'do not sell my personal information',
      'do not sell or share',
      'opt out of sale',
      'ccpa rights',
      'california consumer privacy act',
      'california privacy rights',
      'right to opt out',
      'opt-out of the sale',
      'shine the light',
      'california residents',
      'ccpa opt-out',
      'sale of personal information',
      'sharing of personal information',
      'we do not sell your personal information'
    ],
    minMatches: 1
  },

  privacyPolicy: {
    label: 'Privacy Policy',
    patterns: [
      'privacy policy',
      'privacy notice',
      'privacy statement',
      'data protection policy',
      'how we collect your information',
      'information we collect',
      'personal data we process',
      'data controller',
      'data processor',
      'gdpr compliance',
      'data protection rights'
    ],
    minMatches: 2
  },

  cookiePolicy: {
    label: 'Cookie Policy',
    patterns: [
      'cookie policy',
      'use of cookies',
      'cookies we use',
      'types of cookies',
      'first-party cookies',
      'third-party cookies',
      'session cookies',
      'persistent cookies',
      'cookie consent',
      'manage cookies',
      'cookie settings'
    ],
    minMatches: 2
  },

  dataRequest: {
    label: 'Data Request',
    patterns: [
      'data subject request',
      'access your data',
      'request your data',
      'right to access',
      'right to rectification',
      'right to erasure',
      'right to be forgotten',
      'data portability',
      'download your data',
      'export your data',
      'request data deletion',
      'delete my account',
      'data subject rights'
    ],
    minMatches: 1
  },

  accessibility: {
    label: 'Accessibility',
    patterns: [
      'accessibility statement',
      'accessibility policy',
      'wcag compliance',
      'ada compliance',
      'screen reader',
      'assistive technology',
      'accessibility features',
      'accessible to all users',
      'section 508',
      'web accessibility'
    ],
    minMatches: 2
  },

  refundPolicy: {
    label: 'Refund Policy',
    patterns: [
      'refund policy',
      'refund request',
      'money back guarantee',
      'return policy',
      'cancellation policy',
      'how to request a refund',
      'refund eligibility',
      'full refund',
      'partial refund',
      'refund within'
    ],
    minMatches: 2
  },

  contact: {
    label: 'Contact Information',
    patterns: [
      'contact us',
      'contact information',
      'customer support',
      'customer service',
      'support email',
      'support phone',
      'reach us at',
      'get in touch',
      'send us a message'
    ],
    minMatches: 2
  }
};

// Document type labels for attribution
export const DOCUMENT_LABELS = {
  // Privacy & Data Protection
  privacyPolicy: 'Privacy Policy',
  doNotSell: 'Do Not Sell (CCPA)',
  dataRequest: 'Data Request',
  // Cookie Compliance
  cookiePolicy: 'Cookie Policy',
  cookieSettings: 'Cookie Settings',
  // Legal Disclosures
  termsOfService: 'Terms of Service',
  legal: 'Legal Page',
  dispute: 'Dispute Resolution',
  contact: 'Contact',
  // Consumer Protection
  refundPolicy: 'Refund Policy',
  shippingPolicy: 'Shipping Policy',
  ageVerification: 'Age Verification',
  // Accessibility
  accessibility: 'Accessibility',
  sitemap: 'Sitemap',
  // Content & IP
  dmca: 'DMCA / Copyright',
  reportAbuse: 'Report Abuse',
  affiliateDisclosure: 'Affiliate Disclosure',
  adChoices: 'Ad Choices',
  // Corporate Responsibility
  modernSlavery: 'Modern Slavery',
  sustainability: 'Sustainability',
  securityPolicy: 'Security Policy',
  // ICANN & Registry
  whoisRdap: 'WHOIS / RDAP',
  domainAbuse: 'Domain Abuse',
  udrp: 'UDRP / Disputes',
  registrarInfo: 'Registrar Info',
  transferPolicy: 'Transfer Policy'
};

// Maximum constraints for deep scan
export const DEEP_SCAN_LIMITS = {
  maxDocuments: 10, // Allow up to 10 documents to be scanned
  fetchTimeout: 5000, // 5 seconds per document
  maxTextLength: 200000, // 200KB text limit per document
  maxPdfPages: 50
};
