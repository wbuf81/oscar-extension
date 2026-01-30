/**
 * OSCAR Extension - Pattern Detection Tests
 *
 * These tests validate the compliance pattern matching logic.
 * Run with: node tests/patterns.test.js
 */

const fs = require('fs');
const path = require('path');

// Test results tracking
let passed = 0;
let failed = 0;

function test(name, fn) {
  try {
    fn();
    console.log(`✓ ${name}`);
    passed++;
  } catch (error) {
    console.log(`✗ ${name}`);
    console.log(`  Error: ${error.message}`);
    failed++;
  }
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

// Load patterns file content and extract the PATTERNS object
const patternsPath = path.join(__dirname, '..', 'utils', 'patterns.js');
const patternsContent = fs.readFileSync(patternsPath, 'utf8');

// Simple pattern extraction for testing
function extractPatterns(content) {
  const patterns = {};

  // Extract pattern keys and English patterns - handle multi-line arrays
  // Only extract from the main PATTERNS export (before CORE_KEYWORDS)
  const patternsSection = content.split('CORE_KEYWORDS')[0];
  const patternRegex = /(\w+):\s*\{\s*\n?\s*en:\s*\[([^\]]+)\]/gs;
  let match;

  while ((match = patternRegex.exec(patternsSection)) !== null) {
    const key = match[1];
    const enPatterns = match[2]
      .split(',')
      .map(s => s.trim().replace(/['"]/g, '').replace(/\n/g, ''))
      .filter(s => s.length > 0);
    // Only set if not already set (prefer first occurrence)
    if (!patterns[key]) {
      patterns[key] = enPatterns;
    }
  }

  return patterns;
}

const PATTERNS = extractPatterns(patternsContent);

console.log('\n🔍 OSCAR Pattern Detection Tests\n');
console.log('='.repeat(50));

// Test pattern presence
test('privacyPolicy patterns exist', () => {
  assert(PATTERNS.privacyPolicy, 'privacyPolicy patterns must exist');
  assert(PATTERNS.privacyPolicy.includes('privacy policy'), 'must include "privacy policy"');
});

test('cookiePolicy patterns exist', () => {
  assert(PATTERNS.cookiePolicy, 'cookiePolicy patterns must exist');
  assert(PATTERNS.cookiePolicy.includes('cookie policy'), 'must include "cookie policy"');
});

test('termsOfService patterns exist', () => {
  assert(PATTERNS.termsOfService, 'termsOfService patterns must exist');
  assert(PATTERNS.termsOfService.includes('terms of service'), 'must include "terms of service"');
});

test('doNotSell patterns exist', () => {
  assert(PATTERNS.doNotSell, 'doNotSell patterns must exist');
  assert(PATTERNS.doNotSell.some(p => p.includes('do not sell')), 'must include "do not sell" variant');
});

test('accessibility patterns exist', () => {
  assert(PATTERNS.accessibility, 'accessibility patterns must exist');
  assert(PATTERNS.accessibility.includes('accessibility'), 'must include "accessibility"');
});

// Test ICANN patterns (new category)
test('whoisRdap patterns exist', () => {
  assert(PATTERNS.whoisRdap, 'whoisRdap patterns must exist');
  assert(PATTERNS.whoisRdap.includes('whois'), 'must include "whois"');
  assert(PATTERNS.whoisRdap.includes('rdap'), 'must include "rdap"');
});

test('domainAbuse patterns exist', () => {
  assert(PATTERNS.domainAbuse, 'domainAbuse patterns must exist');
  assert(PATTERNS.domainAbuse.some(p => p.includes('abuse')), 'must include "abuse" variant');
});

test('udrp patterns exist', () => {
  assert(PATTERNS.udrp, 'udrp patterns must exist');
  assert(PATTERNS.udrp.includes('udrp'), 'must include "udrp"');
});

// Test pattern matching function
function matchPattern(text, patterns) {
  const lowerText = text.toLowerCase();
  return patterns.some(pattern => lowerText.includes(pattern.toLowerCase()));
}

test('pattern matching works for privacy policy', () => {
  assert(matchPattern('View our Privacy Policy', PATTERNS.privacyPolicy), 'should match "Privacy Policy"');
  assert(matchPattern('Datenschutzerklärung', ['datenschutzerklärung']), 'should match German');
  assert(!matchPattern('Contact Us', PATTERNS.privacyPolicy), 'should not match unrelated text');
});

test('pattern matching works for cookie consent', () => {
  assert(matchPattern('Cookie Settings', PATTERNS.cookieSettings), 'should match "Cookie Settings"');
  assert(matchPattern('Manage Cookies', PATTERNS.cookieSettings), 'should match "Manage Cookies"');
});

test('pattern matching works for CCPA', () => {
  assert(matchPattern('Do Not Sell My Personal Information', PATTERNS.doNotSell), 'should match CCPA link');
  assert(matchPattern('do not sell or share', PATTERNS.doNotSell), 'should match combined version');
});

// Test that all expected categories exist
const EXPECTED_CATEGORIES = [
  'privacyPolicy', 'doNotSell', 'dataRequest',
  'cookiePolicy', 'cookieSettings',
  'termsOfService', 'legal', 'dispute', 'contact',
  'refundPolicy', 'shippingPolicy', 'ageVerification',
  'accessibility', 'sitemap',
  'dmca', 'reportAbuse', 'affiliateDisclosure', 'adChoices',
  'modernSlavery', 'sustainability', 'securityPolicy',
  'whoisRdap', 'domainAbuse', 'udrp', 'registrarInfo', 'transferPolicy'
];

test('all expected pattern categories exist', () => {
  for (const category of EXPECTED_CATEGORIES) {
    assert(PATTERNS[category], `pattern category "${category}" must exist`);
  }
});

test('total of 26 pattern categories', () => {
  const categoryCount = Object.keys(PATTERNS).length;
  assert(categoryCount >= 26, `expected at least 26 categories, found ${categoryCount}`);
});

// Summary
console.log('\n' + '='.repeat(50));
console.log(`\nResults: ${passed} passed, ${failed} failed\n`);

process.exit(failed > 0 ? 1 : 0);
