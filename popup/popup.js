// Popup script for OSCAR (Obligation Scanning & Compliance Analysis Reporter)

// Default (Puppy) settings - Oscar's original training
const DEFAULT_SETTINGS = {
  builtinItems: {
    privacyPolicy: { enabled: true, weight: 22, label: 'Privacy Policy', keywords: ['privacy policy', 'privacy notice', 'data protection'] },
    cookieBanner: { enabled: true, weight: 18, label: 'Cookie Banner', keywords: ['cookie consent', 'cookie banner'] },
    doNotSell: { enabled: true, weight: 15, label: 'Do Not Sell (CCPA)', keywords: ['do not sell', 'ccpa', 'opt out'] },
    cookiePolicy: { enabled: true, weight: 13, label: 'Cookie Policy', keywords: ['cookie policy', 'cookie notice'] },
    cookieSettings: { enabled: true, weight: 10, label: 'Cookie Settings', keywords: ['cookie settings', 'cookie preferences', 'manage cookies'] },
    termsOfService: { enabled: true, weight: 9, label: 'Terms of Service', keywords: ['terms of service', 'terms of use', 'terms and conditions'] },
    legal: { enabled: true, weight: 8, label: 'Legal Notice', keywords: ['legal', 'legal notice', 'imprint'] },
    dispute: { enabled: true, weight: 3, label: 'Dispute Resolution', keywords: ['dispute resolution', 'arbitration'] },
    dmca: { enabled: true, weight: 1, label: 'DMCA / Copyright', keywords: ['dmca', 'copyright'] },
    reportAbuse: { enabled: true, weight: 1, label: 'Report Abuse', keywords: ['report abuse', 'report violation'] }
  },
  customItems: []
};

// State
let currentMode = 'current';
let selectedTabs = new Set();
let scanResults = null;
let isScanning = false;
let trainingSettings = null;

// DOM Elements
const modeTabs = document.querySelectorAll('.mode-tab');
const currentModeEl = document.getElementById('current-mode');
const compareModeEl = document.getElementById('compare-mode');
const currentTabInfo = document.getElementById('current-tab-info');
const scanCurrentBtn = document.getElementById('scan-current');
const tabsList = document.getElementById('tabs-list');
const selectAllBtn = document.getElementById('select-all');
const scanSelectedBtn = document.getElementById('scan-selected');
const selectedCountSpan = document.getElementById('selected-count');
const progressContainer = document.getElementById('scanning-progress');
const progressFill = document.querySelector('.progress-fill');
const progressText = document.querySelector('.progress-text');
const resultsSection = document.getElementById('results-section');
const clearResultsBtn = document.getElementById('clear-results');
const openAboutBtn = document.getElementById('open-about');
const openHistoryBtn = document.getElementById('open-history');
const openOptionsBtn = document.getElementById('open-options');
const headerIcon = document.querySelector('.header-icon');
const quickStats = document.getElementById('quick-stats');
const statScans = document.getElementById('stat-scans');
const statAvg = document.getElementById('stat-avg');
const statSites = document.getElementById('stat-sites');

// Initialize
document.addEventListener('DOMContentLoaded', init);

async function init() {
  await loadTrainingSettings();
  setupEventListeners();
  await loadCurrentTab();
  await loadAllTabs();
  await loadQuickStats();
}

// ========================================
// Training Settings Management
// ========================================

async function loadTrainingSettings() {
  try {
    const result = await chrome.storage.local.get('trainingSettings');
    if (result.trainingSettings) {
      trainingSettings = result.trainingSettings;
    } else {
      trainingSettings = JSON.parse(JSON.stringify(DEFAULT_SETTINGS));
    }
  } catch (error) {
    console.error('Failed to load training settings:', error);
    trainingSettings = JSON.parse(JSON.stringify(DEFAULT_SETTINGS));
  }
}

function getComplianceLabels() {
  const labels = {};
  for (const [key, item] of Object.entries(trainingSettings.builtinItems)) {
    if (item.enabled) {
      labels[key] = item.label;
    }
  }
  for (const item of trainingSettings.customItems) {
    if (item.enabled) {
      labels[item.id] = item.label;
    }
  }
  return labels;
}

// ========================================
// Event Listeners
// ========================================

function setupEventListeners() {
  // Mode tabs
  modeTabs.forEach(tab => {
    tab.addEventListener('click', () => switchMode(tab.dataset.mode));
  });

  // Scan buttons
  scanCurrentBtn.addEventListener('click', scanCurrentTab);
  scanSelectedBtn.addEventListener('click', scanSelectedTabs);
  selectAllBtn.addEventListener('click', toggleSelectAll);

  // Clear results
  clearResultsBtn.addEventListener('click', clearResults);

  // Header icon click - go to About page
  if (headerIcon) {
    headerIcon.addEventListener('click', () => {
      chrome.tabs.create({ url: chrome.runtime.getURL('about/about.html') });
    });
  }

  // Header navigation buttons - open in new tabs
  if (openAboutBtn) {
    openAboutBtn.addEventListener('click', () => {
      chrome.tabs.create({ url: chrome.runtime.getURL('about/about.html') });
    });
  }

  if (openHistoryBtn) {
    openHistoryBtn.addEventListener('click', () => {
      chrome.tabs.create({ url: chrome.runtime.getURL('history/history.html') });
    });
  }

  if (openOptionsBtn) {
    openOptionsBtn.addEventListener('click', () => {
      chrome.runtime.openOptionsPage();
    });
  }
}

// ========================================
// Mode Switching
// ========================================

function switchMode(mode) {
  currentMode = mode;

  modeTabs.forEach(tab => {
    tab.classList.toggle('active', tab.dataset.mode === mode);
  });

  currentModeEl.classList.toggle('active', mode === 'current');
  compareModeEl.classList.toggle('active', mode === 'compare');

  // Clear results when switching modes
  clearResults();
}

// ========================================
// Tab Management
// ========================================

async function loadCurrentTab() {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tab) {
      const favicon = currentTabInfo.querySelector('.tab-favicon');
      const urlSpan = currentTabInfo.querySelector('.tab-url');

      if (tab.favIconUrl) {
        favicon.style.backgroundImage = `url(${tab.favIconUrl})`;
      }
      urlSpan.textContent = new URL(tab.url).hostname;
      currentTabInfo.dataset.tabId = tab.id;
    }
  } catch (error) {
    console.error('Failed to load current tab:', error);
  }
}

async function loadAllTabs() {
  try {
    const tabs = await chrome.tabs.query({ currentWindow: true });
    tabsList.innerHTML = '';

    // Filter valid tabs
    const validTabs = tabs.filter(tab =>
      !tab.url.startsWith('chrome://') &&
      !tab.url.startsWith('chrome-extension://')
    );

    // Show empty state if no valid tabs
    if (validTabs.length === 0) {
      tabsList.innerHTML = `
        <div class="tabs-list-empty">
          <div class="tabs-list-empty-icon">🔍</div>
          <p>No scannable tabs found</p>
        </div>
      `;
      return;
    }

    validTabs.forEach(tab => {
      const tabItem = document.createElement('div');
      tabItem.className = 'tab-item';
      tabItem.dataset.tabId = tab.id;

      const hostname = new URL(tab.url).hostname;
      const title = tab.title || hostname;

      tabItem.innerHTML = `
        <input type="checkbox" id="tab-${tab.id}">
        <span class="tab-favicon" style="${tab.favIconUrl ? `background-image: url(${tab.favIconUrl})` : ''}"></span>
        <span class="tab-title" title="${title}">${title}</span>
      `;

      const checkbox = tabItem.querySelector('input');
      checkbox.addEventListener('change', () => {
        if (checkbox.checked) {
          selectedTabs.add(tab.id);
          tabItem.classList.add('selected');
        } else {
          selectedTabs.delete(tab.id);
          tabItem.classList.remove('selected');
        }
        updateSelectedCount();
      });

      tabItem.addEventListener('click', (e) => {
        if (e.target !== checkbox) {
          checkbox.checked = !checkbox.checked;
          checkbox.dispatchEvent(new Event('change'));
        }
      });

      tabsList.appendChild(tabItem);
    });
  } catch (error) {
    console.error('Failed to load tabs:', error);
  }
}

function updateSelectedCount() {
  selectedCountSpan.textContent = selectedTabs.size;
  scanSelectedBtn.disabled = selectedTabs.size === 0;
}

function toggleSelectAll() {
  const checkboxes = tabsList.querySelectorAll('input[type="checkbox"]');
  const allChecked = Array.from(checkboxes).every(cb => cb.checked);

  checkboxes.forEach(cb => {
    cb.checked = !allChecked;
    cb.dispatchEvent(new Event('change'));
  });

  selectAllBtn.textContent = allChecked ? 'Select All' : 'Deselect All';
}

// ========================================
// Scanning
// ========================================

async function scanCurrentTab() {
  if (isScanning) return;

  const tabId = parseInt(currentTabInfo.dataset.tabId);
  if (!tabId) return;

  showProgress('Oscar is sniffing...');

  try {
    const response = await chrome.runtime.sendMessage({
      action: 'scanTab',
      tabId
    });

    if (response.success) {
      scanResults = [response.data];
      renderSingleResult(response.data);

      // Update badge
      chrome.runtime.sendMessage({
        action: 'updateBadge',
        score: response.data.score
      });
    } else {
      showError(response.error || 'Failed to scan page');
    }
  } catch (error) {
    showError(error.message);
  } finally {
    hideProgress();
  }
}

async function scanSelectedTabs() {
  if (isScanning || selectedTabs.size === 0) return;

  const tabIds = Array.from(selectedTabs);
  showProgress(`Oscar is sniffing ${tabIds.length} pages...`);

  try {
    const response = await chrome.runtime.sendMessage({
      action: 'scanMultipleTabs',
      tabIds
    });

    if (response.success) {
      scanResults = response.data.filter(r => r.success).map(r => r.data);
      renderCompareResults(scanResults);
    } else {
      showError(response.error || 'Failed to scan tabs');
    }
  } catch (error) {
    showError(error.message);
  } finally {
    hideProgress();
  }
}

// ========================================
// Progress & UI Helpers
// ========================================

function showProgress(text) {
  isScanning = true;
  progressContainer.classList.remove('hidden');
  progressText.textContent = text;
  progressFill.style.width = '0%';

  // Animate progress
  let progress = 0;
  const interval = setInterval(() => {
    progress += 10;
    if (progress >= 90) {
      clearInterval(interval);
    }
    progressFill.style.width = `${progress}%`;
  }, 100);

  progressContainer.dataset.interval = interval;
}

function hideProgress() {
  isScanning = false;
  progressFill.style.width = '100%';

  const interval = progressContainer.dataset.interval;
  if (interval) clearInterval(parseInt(interval));

  setTimeout(() => {
    progressContainer.classList.add('hidden');
  }, 300);
}

function getScoreClass(score) {
  if (score >= 80) return 'score-excellent';
  if (score >= 60) return 'score-good';
  if (score >= 40) return 'score-fair';
  return 'score-poor';
}

function getScoreLabel(score) {
  if (score >= 80) return 'Excellent';
  if (score >= 60) return 'Good';
  if (score >= 40) return 'Fair';
  return 'Poor';
}

// ========================================
// Results Rendering
// ========================================

function renderSingleResult(result) {
  resultsSection.classList.remove('hidden');
  clearResultsBtn.classList.remove('hidden');

  const hostname = new URL(result.url).hostname;
  const labels = getComplianceLabels();

  resultsSection.innerHTML = `
    <div class="result-card">
      <div class="result-header">
        <span class="result-url" title="${result.url}">${hostname}</span>
        <div class="result-score">
          <span class="score-badge ${getScoreClass(result.score)}">${result.score}% - ${getScoreLabel(result.score)}</span>
        </div>
      </div>
      <div class="result-body">
        <div class="compliance-list">
          ${renderComplianceItems(result.compliance, labels)}
        </div>
      </div>
    </div>
  `;
}

function renderComplianceItems(compliance, labels) {
  // Get enabled items in order
  const enabledBuiltins = Object.entries(trainingSettings.builtinItems)
    .filter(([_, item]) => item.enabled)
    .map(([key, _]) => key);

  const enabledCustom = trainingSettings.customItems
    .filter(item => item.enabled)
    .map(item => item.id);

  const order = [...enabledBuiltins, ...enabledCustom];

  return order.map(key => {
    const item = compliance[key];
    const found = typeof item === 'boolean' ? item : (item && item.found);
    const url = item?.url;
    const text = item?.text;
    const label = labels[key] || key;

    return `
      <div class="compliance-item ${found ? 'found' : 'not-found'}">
        <div>
          <span class="compliance-name">${label}</span>
          ${found && url ? `<a href="${url}" target="_blank" class="compliance-link" title="${text || url}">${text || 'View'}</a>` : ''}
        </div>
        <span class="compliance-status ${found ? 'found' : 'not-found'}">
          <span class="status-icon">${found ? '&#10003;' : '&#10007;'}</span>
          ${found ? 'Found' : 'Not Found'}
        </span>
      </div>
    `;
  }).join('');
}

function renderCompareResults(results) {
  if (results.length === 0) {
    showError('No results to display');
    return;
  }

  resultsSection.classList.remove('hidden');
  clearResultsBtn.classList.remove('hidden');

  const labels = getComplianceLabels();
  const complianceKeys = Object.keys(labels);

  // Calculate summary stats
  const avgScore = Math.round(results.reduce((sum, r) => sum + r.score, 0) / results.length);
  const bestSite = results.reduce((best, r) => r.score > best.score ? r : best, results[0]);
  const bestHostname = new URL(bestSite.url).hostname;

  // Build card-based comparison
  const siteCards = results.map(result => {
    const hostname = new URL(result.url).hostname;

    // Build compliance items grid
    const complianceItems = complianceKeys.map(key => {
      const item = result.compliance[key];
      const found = typeof item === 'boolean' ? item : (item && item.found);
      return `
        <div class="compare-compliance-item ${found ? 'found' : 'not-found'}">
          <span class="status-icon">${found ? '✓' : '✗'}</span>
          <span class="item-label" title="${labels[key]}">${labels[key]}</span>
        </div>
      `;
    }).join('');

    return `
      <div class="compare-card">
        <div class="compare-card-header">
          <span class="compare-card-site" title="${result.url}">${hostname}</span>
          <span class="score-badge compare-card-score ${getScoreClass(result.score)}">${result.score}% - ${getScoreLabel(result.score)}</span>
        </div>
        <div class="compare-card-body">
          <div class="compare-compliance-grid">
            ${complianceItems}
          </div>
        </div>
      </div>
    `;
  }).join('');

  resultsSection.innerHTML = `
    <div class="compare-results">
      <div class="compare-results-header">
        Comparing ${results.length} Sites
      </div>
      ${siteCards}
      <div class="compare-summary">
        <div class="compare-summary-item">
          <div class="compare-summary-label">Avg Score</div>
          <div class="compare-summary-value">${avgScore}%</div>
        </div>
        <div class="compare-summary-item">
          <div class="compare-summary-label">Best</div>
          <div class="compare-summary-value" title="${bestHostname}">${bestSite.score}%</div>
        </div>
        <div class="compare-summary-item">
          <div class="compare-summary-label">Sites</div>
          <div class="compare-summary-value">${results.length}</div>
        </div>
      </div>
    </div>
  `;
}

// ========================================
// Clear & Error
// ========================================

function clearResults() {
  resultsSection.classList.add('hidden');
  resultsSection.innerHTML = '';
  clearResultsBtn.classList.add('hidden');
  scanResults = null;
}

function showError(message) {
  resultsSection.classList.remove('hidden');
  resultsSection.innerHTML = `
    <div class="empty-state" style="color: var(--error);">
      <div class="empty-state-icon">&#9888;</div>
      <p class="empty-state-text">${message}</p>
    </div>
  `;
}

// ========================================
// Quick Stats
// ========================================

async function loadQuickStats() {
  try {
    const result = await chrome.storage.local.get('history');
    const history = result.history || [];

    if (history.length === 0) {
      quickStats.classList.add('hidden');
      return;
    }

    // Calculate stats
    const totalScans = history.length;
    const avgScore = Math.round(history.reduce((sum, item) => sum + item.score, 0) / totalScans);
    const uniqueSites = new Set(history.map(item => {
      try {
        return new URL(item.url).hostname;
      } catch {
        return item.url;
      }
    })).size;

    // Update UI
    statScans.textContent = totalScans;
    statAvg.textContent = avgScore + '%';
    statSites.textContent = uniqueSites;

    quickStats.classList.remove('hidden');
  } catch (error) {
    console.error('Failed to load quick stats:', error);
    quickStats.classList.add('hidden');
  }
}

