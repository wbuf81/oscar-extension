/**
 * OSCAR Extension - Test Runner
 *
 * Runs all tests and reports results.
 * Usage: node tests/run-all.js
 */

const { execSync } = require('child_process');
const path = require('path');

const tests = [
  'manifest.test.js',
  'patterns.test.js',
  'files.test.js'
];

console.log('\n🐕 OSCAR Extension - Test Suite\n');
console.log('='.repeat(60));
console.log('Running all tests...\n');

let allPassed = true;
const results = [];

for (const test of tests) {
  const testPath = path.join(__dirname, test);
  console.log(`\n▶ Running ${test}...\n`);

  try {
    execSync(`node "${testPath}"`, { stdio: 'inherit' });
    results.push({ test, status: 'PASSED' });
  } catch (error) {
    results.push({ test, status: 'FAILED' });
    allPassed = false;
  }
}

console.log('\n' + '='.repeat(60));
console.log('\n📊 Test Summary\n');

for (const result of results) {
  const icon = result.status === 'PASSED' ? '✓' : '✗';
  console.log(`  ${icon} ${result.test}: ${result.status}`);
}

console.log('\n' + '='.repeat(60));

if (allPassed) {
  console.log('\n✅ All tests passed! Ready for submission.\n');
  process.exit(0);
} else {
  console.log('\n❌ Some tests failed. Please fix issues before submitting.\n');
  process.exit(1);
}
