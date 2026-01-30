/**
 * OSCAR Extension - Build Script
 *
 * Creates a production-ready ZIP file for Chrome Web Store submission.
 * Usage: node scripts/build.js
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = path.join(__dirname, '..');
const DIST_DIR = path.join(ROOT, 'dist');
const OUTPUT_FILE = path.join(DIST_DIR, 'oscar-extension.zip');

// Files and directories to include in the build
const INCLUDE = [
  'manifest.json',
  'popup/',
  'options/',
  'about/',
  'history/',
  'background/',
  'content/',
  'utils/',
  'icons/'
];

// Files to exclude (even if in included directories)
const EXCLUDE = [
  '.DS_Store',
  'Thumbs.db',
  '*.log',
  '*.tmp',
  'process-icon.py',
  'generate-icons.html'
];

console.log('\n🔨 OSCAR Extension - Build Script\n');
console.log('='.repeat(50));

// Create dist directory
if (!fs.existsSync(DIST_DIR)) {
  fs.mkdirSync(DIST_DIR, { recursive: true });
  console.log('✓ Created dist/ directory');
}

// Remove old build
if (fs.existsSync(OUTPUT_FILE)) {
  fs.unlinkSync(OUTPUT_FILE);
  console.log('✓ Removed old build');
}

// Build exclude pattern for zip
const excludePattern = EXCLUDE.map(e => `-x "${e}"`).join(' ');

// Create zip file
console.log('✓ Creating ZIP file...');

try {
  const includeFiles = INCLUDE.join(' ');
  const cmd = `cd "${ROOT}" && zip -r "${OUTPUT_FILE}" ${includeFiles} ${excludePattern}`;
  execSync(cmd, { stdio: 'pipe' });

  // Get file size
  const stats = fs.statSync(OUTPUT_FILE);
  const sizeKB = (stats.size / 1024).toFixed(2);

  console.log(`✓ Build complete: dist/oscar-extension.zip (${sizeKB} KB)`);
  console.log('\n' + '='.repeat(50));
  console.log('\n📦 Ready for Chrome Web Store submission!\n');
  console.log('Upload this file: dist/oscar-extension.zip\n');

} catch (error) {
  console.error('✗ Build failed:', error.message);
  process.exit(1);
}
