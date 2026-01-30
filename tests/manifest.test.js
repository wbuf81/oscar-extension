/**
 * OSCAR Extension - Manifest Validation Tests
 *
 * These tests validate the manifest.json file for Chrome Web Store requirements.
 * Run with: node tests/manifest.test.js
 */

const fs = require('fs');
const path = require('path');

const MANIFEST_PATH = path.join(__dirname, '..', 'manifest.json');

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

// Load manifest
let manifest;
try {
  const content = fs.readFileSync(MANIFEST_PATH, 'utf8');
  manifest = JSON.parse(content);
} catch (error) {
  console.error('Failed to load manifest.json:', error.message);
  process.exit(1);
}

console.log('\n📋 OSCAR Manifest Validation Tests\n');
console.log('='.repeat(50));

// Required fields
test('manifest_version is 3', () => {
  assert(manifest.manifest_version === 3, 'manifest_version must be 3');
});

test('name is present and valid', () => {
  assert(manifest.name, 'name is required');
  assert(manifest.name.length <= 45, 'name must be 45 characters or less');
});

test('version is valid semver format', () => {
  assert(manifest.version, 'version is required');
  assert(/^\d+\.\d+\.\d+$/.test(manifest.version), 'version must be in X.Y.Z format');
});

test('description is present and within limits', () => {
  assert(manifest.description, 'description is required');
  assert(manifest.description.length <= 132, 'description must be 132 characters or less');
});

// Icons
test('all required icon sizes are present', () => {
  const requiredSizes = ['16', '32', '48', '128'];
  for (const size of requiredSizes) {
    assert(manifest.icons[size], `icon size ${size} is required`);
  }
});

test('icon files exist', () => {
  const iconDir = path.join(__dirname, '..', 'icons');
  for (const [size, iconPath] of Object.entries(manifest.icons)) {
    const fullPath = path.join(__dirname, '..', iconPath);
    assert(fs.existsSync(fullPath), `icon file ${iconPath} must exist`);
  }
});

// Action (popup)
test('action popup is configured', () => {
  assert(manifest.action, 'action is required');
  assert(manifest.action.default_popup, 'default_popup is required');
});

test('popup file exists', () => {
  const popupPath = path.join(__dirname, '..', manifest.action.default_popup);
  assert(fs.existsSync(popupPath), 'popup HTML file must exist');
});

// Background service worker
test('background service worker is configured', () => {
  assert(manifest.background, 'background is required');
  assert(manifest.background.service_worker, 'service_worker is required');
  assert(manifest.background.type === 'module', 'service worker type should be module');
});

test('service worker file exists', () => {
  const swPath = path.join(__dirname, '..', manifest.background.service_worker);
  assert(fs.existsSync(swPath), 'service worker file must exist');
});

// Content scripts
test('content scripts are configured', () => {
  assert(Array.isArray(manifest.content_scripts), 'content_scripts must be an array');
  assert(manifest.content_scripts.length > 0, 'at least one content script is required');
});

test('content script files exist', () => {
  for (const cs of manifest.content_scripts) {
    for (const jsFile of cs.js) {
      const jsPath = path.join(__dirname, '..', jsFile);
      assert(fs.existsSync(jsPath), `content script ${jsFile} must exist`);
    }
  }
});

// Permissions
test('permissions are declared', () => {
  assert(Array.isArray(manifest.permissions), 'permissions must be an array');
});

test('host_permissions are declared', () => {
  assert(Array.isArray(manifest.host_permissions), 'host_permissions must be an array');
});

// Options page
test('options page is configured', () => {
  assert(manifest.options_page || manifest.options_ui, 'options page should be configured');
});

test('options page file exists', () => {
  const optionsPath = manifest.options_page || manifest.options_ui?.page;
  if (optionsPath) {
    const fullPath = path.join(__dirname, '..', optionsPath);
    assert(fs.existsSync(fullPath), 'options page file must exist');
  }
});

// CSP
test('content_security_policy is defined', () => {
  assert(manifest.content_security_policy, 'content_security_policy should be defined');
});

// Summary
console.log('\n' + '='.repeat(50));
console.log(`\nResults: ${passed} passed, ${failed} failed\n`);

process.exit(failed > 0 ? 1 : 0);
