/**
 * OSCAR Extension - File Structure Tests
 *
 * These tests validate that all required files exist and are properly structured.
 * Run with: node tests/files.test.js
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');

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

function fileExists(relativePath) {
  return fs.existsSync(path.join(ROOT, relativePath));
}

function fileContains(relativePath, searchString) {
  const content = fs.readFileSync(path.join(ROOT, relativePath), 'utf8');
  return content.includes(searchString);
}

console.log('\n📁 OSCAR File Structure Tests\n');
console.log('='.repeat(50));

// Core files
test('manifest.json exists', () => {
  assert(fileExists('manifest.json'), 'manifest.json must exist');
});

test('README.md exists', () => {
  assert(fileExists('README.md'), 'README.md must exist');
});

test('LICENSE exists', () => {
  assert(fileExists('LICENSE'), 'LICENSE must exist');
});

test('PRIVACY_POLICY.md exists', () => {
  assert(fileExists('PRIVACY_POLICY.md'), 'PRIVACY_POLICY.md must exist');
});

// Popup files
test('popup/popup.html exists', () => {
  assert(fileExists('popup/popup.html'), 'popup/popup.html must exist');
});

test('popup/popup.js exists', () => {
  assert(fileExists('popup/popup.js'), 'popup/popup.js must exist');
});

test('popup/popup.css exists', () => {
  assert(fileExists('popup/popup.css'), 'popup/popup.css must exist');
});

// Options files
test('options/options.html exists', () => {
  assert(fileExists('options/options.html'), 'options/options.html must exist');
});

test('options/options.js exists', () => {
  assert(fileExists('options/options.js'), 'options/options.js must exist');
});

test('options/options.css exists', () => {
  assert(fileExists('options/options.css'), 'options/options.css must exist');
});

// About files
test('about/about.html exists', () => {
  assert(fileExists('about/about.html'), 'about/about.html must exist');
});

test('about/about.js exists', () => {
  assert(fileExists('about/about.js'), 'about/about.js must exist');
});

test('about/about.css exists', () => {
  assert(fileExists('about/about.css'), 'about/about.css must exist');
});

// History files
test('history/history.html exists', () => {
  assert(fileExists('history/history.html'), 'history/history.html must exist');
});

test('history/history.js exists', () => {
  assert(fileExists('history/history.js'), 'history/history.js must exist');
});

test('history/history.css exists', () => {
  assert(fileExists('history/history.css'), 'history/history.css must exist');
});

// Background and content scripts
test('background/service-worker.js exists', () => {
  assert(fileExists('background/service-worker.js'), 'background/service-worker.js must exist');
});

test('content/scanner.js exists', () => {
  assert(fileExists('content/scanner.js'), 'content/scanner.js must exist');
});

// Utility files
test('utils/patterns.js exists', () => {
  assert(fileExists('utils/patterns.js'), 'utils/patterns.js must exist');
});

test('utils/scoring.js exists', () => {
  assert(fileExists('utils/scoring.js'), 'utils/scoring.js must exist');
});

// Icon files
test('icons/icon16.png exists', () => {
  assert(fileExists('icons/icon16.png'), 'icons/icon16.png must exist');
});

test('icons/icon32.png exists', () => {
  assert(fileExists('icons/icon32.png'), 'icons/icon32.png must exist');
});

test('icons/icon48.png exists', () => {
  assert(fileExists('icons/icon48.png'), 'icons/icon48.png must exist');
});

test('icons/icon128.png exists', () => {
  assert(fileExists('icons/icon128.png'), 'icons/icon128.png must exist');
});

// Content checks
test('README mentions 26 compliance checks', () => {
  assert(fileContains('README.md', '26'), 'README should mention 26 compliance checks');
});

test('README mentions 8 categories', () => {
  assert(fileContains('README.md', '8 categories'), 'README should mention 8 categories');
});

test('PRIVACY_POLICY mentions local processing', () => {
  assert(fileContains('PRIVACY_POLICY.md', 'local'), 'Privacy policy should mention local processing');
});

test('manifest version is 1.2.0', () => {
  const manifest = JSON.parse(fs.readFileSync(path.join(ROOT, 'manifest.json'), 'utf8'));
  assert(manifest.version === '1.2.0', 'manifest version should be 1.2.0');
});

// No debug code in production
test('service-worker.js has no console.log', () => {
  const content = fs.readFileSync(path.join(ROOT, 'background/service-worker.js'), 'utf8');
  const hasConsoleLog = /console\.log\(/.test(content);
  assert(!hasConsoleLog, 'service-worker.js should not have console.log statements');
});

// Summary
console.log('\n' + '='.repeat(50));
console.log(`\nResults: ${passed} passed, ${failed} failed\n`);

process.exit(failed > 0 ? 1 : 0);
