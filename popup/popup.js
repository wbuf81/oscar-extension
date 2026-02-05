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
const copyResultsBtn = document.getElementById('copy-results');
const openAboutBtn = document.getElementById('open-about');
const openHistoryBtn = document.getElementById('open-history');
const openOptionsBtn = document.getElementById('open-options');
const headerIcon = document.querySelector('.header-icon');
const quickStats = document.getElementById('quick-stats');
const statScans = document.getElementById('stat-scans');
const statAvg = document.getElementById('stat-avg');
const statSites = document.getElementById('stat-sites');
const deepScanContainer = document.getElementById('deep-scan-container');
const deepScanToggle = document.getElementById('deep-scan-toggle');
const deepScanOptions = document.getElementById('deep-scan-options');
const deepScanDocsList = document.getElementById('deep-scan-docs-list');
const deepScanStartBtn = document.getElementById('deep-scan-start');

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

  // Clear / Copy results
  clearResultsBtn.addEventListener('click', clearResults);
  if (copyResultsBtn) {
    copyResultsBtn.addEventListener('click', copyResultsToClipboard);
  }

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

  // Force Cookie Banner button
  const forceCookieBannerBtn = document.getElementById('force-cookie-banner');
  if (forceCookieBannerBtn) {
    forceCookieBannerBtn.addEventListener('click', forceCookieBanner);
  }

  // Deep Scan toggle and start buttons
  if (deepScanToggle) {
    deepScanToggle.addEventListener('click', toggleDeepScanOptions);
  }
  if (deepScanStartBtn) {
    deepScanStartBtn.addEventListener('click', performDeepScan);
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

// ========================================
// Compliance Descriptions for Tooltips
// ========================================

const COMPLIANCE_DESCRIPTIONS = {
  privacyPolicy: { desc: 'Explains how a site collects, uses, and protects personal information.', reg: 'GDPR, CCPA' },
  doNotSell: { desc: 'Lets users opt out of the sale of their personal data.', reg: 'CCPA/CPRA' },
  dataRequest: { desc: 'Provides a way for users to access, download, or delete their personal data.', reg: 'GDPR, CCPA' },
  cookieBanner: { desc: 'Asks for informed consent before placing non-essential tracking cookies.', reg: 'EU ePrivacy Directive, GDPR' },
  cookiePolicy: { desc: 'Details what cookies are used, their purposes, and retention periods.', reg: 'GDPR' },
  cookieSettings: { desc: 'Lets users manage or withdraw cookie consent at any time.', reg: 'GDPR, ePrivacy' },
  termsOfService: { desc: 'The legal contract defining acceptable use, liability, and user rights.', reg: 'General contract law' },
  legal: { desc: 'Identifies the site operator with contact and business registration info.', reg: 'EU Impressum laws' },
  dispute: { desc: 'Informs consumers about available dispute resolution mechanisms.', reg: 'EU ODR Regulation' },
  contact: { desc: 'Provides users a way to reach the business behind the site.', reg: 'EU Consumer Rights Directive' },
  refundPolicy: { desc: 'Explains how customers can return products and receive refunds.', reg: 'FTC, EU Consumer Rights Directive' },
  shippingPolicy: { desc: 'States shipping costs, delivery times, and available methods.', reg: 'Consumer protection laws' },
  ageVerification: { desc: 'Verifies user age for restricted content or data from children.', reg: 'COPPA' },
  accessibility: { desc: 'Documents accessibility features and how to request accommodations.', reg: 'ADA, EU Accessibility Act' },
  sitemap: { desc: 'Helps users and screen readers navigate the site structure.', reg: 'Best practice' },
  dmca: { desc: 'Provides takedown procedures for infringing content, granting safe harbor.', reg: 'DMCA' },
  reportAbuse: { desc: 'Offers a mechanism for reporting illegal or harmful content.', reg: 'EU Digital Services Act' },
  affiliateDisclosure: { desc: 'Discloses compensation received for endorsements or affiliate links.', reg: 'FTC Guidelines' },
  adChoices: { desc: 'Provides transparency about interest-based ads and opt-out options.', reg: 'DAA, NAI' },
  modernSlavery: { desc: 'Details steps taken to prevent slavery in the business or supply chain.', reg: 'UK Modern Slavery Act' },
  sustainability: { desc: 'Reports on environmental impact, carbon footprint, and green initiatives.', reg: 'EU CSRD' },
  securityPolicy: { desc: 'Provides a channel for reporting vulnerabilities responsibly.', reg: 'CISA guidelines' },
  whoisRdap: { desc: 'Lookup service for domain registration and ownership data.', reg: 'ICANN RDAP requirement' },
  domainAbuse: { desc: 'Published abuse contact info for investigating domain abuse reports.', reg: 'ICANN RAA Section 3.18' },
  udrp: { desc: 'Mandatory arbitration process for domain name cybersquatting disputes.', reg: 'ICANN UDRP' },
  registrarInfo: { desc: 'Details about the ICANN-accredited registrar managing the domain.', reg: 'ICANN RAA' },
  transferPolicy: { desc: 'Explains how domains move between registrars with auth codes and locks.', reg: 'ICANN Transfer Policy' }
};

// Oscar moods for different score ranges
const oscarResultMoods = {
  poor: {
    face: '😰',
    messages: [
      "Ruh roh... needs work!",
      "Oscar is concerned...",
      "Some things are missing!"
    ]
  },
  fair: {
    face: '🐕',
    messages: [
      "Getting there!",
      "Room for improvement!",
      "Not bad, but could be better!"
    ]
  },
  good: {
    face: '🐕‍🦺',
    messages: [
      "Good compliance coverage!",
      "Nice work on this site!",
      "Oscar approves!"
    ]
  },
  excellent: {
    face: '🦮',
    messages: [
      "Excellent! Top-tier compliance!",
      "Oscar is impressed!",
      "This site takes compliance seriously!"
    ]
  }
};

// Category definitions for grouping results
const RESULT_CATEGORIES = {
  privacy: { label: 'Privacy', icon: '🔒', keys: ['privacyPolicy', 'doNotSell', 'dataRequest'] },
  cookies: { label: 'Cookies', icon: '🍪', keys: ['cookieBanner', 'cookiePolicy', 'cookieSettings'] },
  legal: { label: 'Legal', icon: '⚖️', keys: ['termsOfService', 'legal', 'dispute', 'contact'] },
  consumer: { label: 'Consumer', icon: '🛒', keys: ['refundPolicy', 'shippingPolicy', 'ageVerification'] },
  accessibility: { label: 'Access', icon: '♿', keys: ['accessibility', 'sitemap'] },
  content: { label: 'Content', icon: '©️', keys: ['dmca', 'reportAbuse', 'affiliateDisclosure', 'adChoices'] },
  corporate: { label: 'Corporate', icon: '🏢', keys: ['modernSlavery', 'sustainability', 'securityPolicy'] },
  registry: { label: 'Registry', icon: '🌐', keys: ['whoisRdap', 'domainAbuse', 'udrp', 'registrarInfo', 'transferPolicy'] }
};

function renderSingleResult(result) {
  resultsSection.classList.remove('hidden');
  clearResultsBtn.classList.remove('hidden');
  if (copyResultsBtn) copyResultsBtn.classList.remove('hidden');

  const hostname = new URL(result.url).hostname;
  const labels = getComplianceLabels();

  // Determine Oscar's mood
  const moodKey = result.score >= 80 ? 'excellent' : result.score >= 60 ? 'good' : result.score >= 40 ? 'fair' : 'poor';
  const mood = oscarResultMoods[moodKey];
  const oscarMessage = mood.messages[Math.floor(Math.random() * mood.messages.length)];

  // Calculate found/total
  const { foundCount, totalCount, categoryStats } = calculateComplianceStats(result.compliance, labels);

  resultsSection.innerHTML = `
    <div class="result-card sniff-o-meter-result">
      <!-- Oscar's Reaction Header -->
      <div class="result-oscar-header">
        <div class="result-oscar-face" id="result-oscar-face">${mood.face}</div>
        <div class="result-oscar-info">
          <div class="result-oscar-speech">"${oscarMessage}"</div>
          <div class="result-url" title="${result.url}">${hostname}</div>
        </div>
      </div>

      <!-- Score Gauge -->
      <div class="result-score-gauge">
        <div class="result-score-display">
          <span class="result-score-number ${getScoreClass(result.score)}" id="result-score-number">0</span>
          <span class="result-score-percent">%</span>
        </div>
        <div class="result-score-label">${getScoreLabel(result.score)}</div>
        <div class="result-gauge-container">
          <div class="result-gauge-bg">
            <div class="result-gauge-fill ${getScoreClass(result.score)}" id="result-gauge-fill" style="width: 0%"></div>
          </div>
        </div>
        <div class="result-found-summary">
          <span class="result-found-icon">🔍</span>
          Oscar found <strong id="result-found-count">0</strong> of <strong>${totalCount}</strong> items
        </div>
      </div>

      <!-- Category Breakdown -->
      <div class="result-category-breakdown">
        <div class="result-category-title">Category Breakdown</div>
        <div class="result-categories" id="result-categories">
          ${renderCategoryBreakdown(categoryStats)}
        </div>
      </div>

      <!-- Deep Scan Summary (if performed) -->
      ${renderDeepScanSummary(result)}

      <!-- Compliance Items List -->
      <div class="result-compliance-section">
        <div class="result-compliance-title">Compliance Items</div>
        <div class="compliance-list">
          ${renderComplianceItems(result.compliance, labels)}
        </div>
      </div>
    </div>
  `;

  // Animate the score
  animateResultScore(result.score, foundCount);

  // Trigger Oscar animation
  const oscarFace = document.getElementById('result-oscar-face');
  if (oscarFace) {
    oscarFace.classList.add('celebrating');
    setTimeout(() => oscarFace.classList.remove('celebrating'), 1000);
  }

  // Check deep scan eligibility and update button
  updateDeepScanButton(result);
}

function calculateComplianceStats(compliance, labels) {
  let foundCount = 0;
  let totalCount = 0;
  const categoryStats = {};

  // Initialize category stats
  for (const [catKey, catInfo] of Object.entries(RESULT_CATEGORIES)) {
    categoryStats[catKey] = { ...catInfo, found: 0, total: 0, items: [] };
  }
  categoryStats['custom'] = { label: 'Custom', icon: '✨', found: 0, total: 0, items: [], keys: [] };

  // Process each compliance item
  for (const [key, value] of Object.entries(compliance)) {
    const found = typeof value === 'boolean' ? value : (value && value.found);
    const label = labels[key] || key;

    // Find which category this belongs to
    let assignedCategory = null;
    for (const [catKey, catInfo] of Object.entries(RESULT_CATEGORIES)) {
      if (catInfo.keys.includes(key)) {
        assignedCategory = catKey;
        break;
      }
    }

    // If not found in built-in categories, it's custom
    if (!assignedCategory) {
      assignedCategory = 'custom';
    }

    categoryStats[assignedCategory].total++;
    categoryStats[assignedCategory].items.push({ key, label, found });
    totalCount++;

    if (found) {
      categoryStats[assignedCategory].found++;
      foundCount++;
    }
  }

  return { foundCount, totalCount, categoryStats };
}

function renderCategoryBreakdown(categoryStats) {
  let html = '';

  for (const [catKey, stats] of Object.entries(categoryStats)) {
    if (stats.total === 0) continue;

    const percent = Math.round((stats.found / stats.total) * 100);
    const statusClass = percent === 100 ? 'complete' : percent >= 50 ? 'partial' : percent > 0 ? 'low' : 'none';

    html += `
      <div class="result-category-item ${statusClass}" data-category="${catKey}">
        <div class="result-category-header">
          <span class="result-category-icon">${stats.icon}</span>
          <span class="result-category-name">${stats.label}</span>
          <span class="result-category-score">${stats.found}/${stats.total}</span>
        </div>
        <div class="result-category-bar">
          <div class="result-category-fill" style="width: ${percent}%"></div>
        </div>
      </div>
    `;
  }

  return html;
}

function animateResultScore(targetScore, targetFound) {
  const scoreEl = document.getElementById('result-score-number');
  const gaugeEl = document.getElementById('result-gauge-fill');
  const foundEl = document.getElementById('result-found-count');

  if (!scoreEl || !gaugeEl) return;

  let currentScore = 0;
  let currentFound = 0;
  const duration = 1000; // 1 second
  const steps = 30;
  const scoreStep = targetScore / steps;
  const foundStep = targetFound / steps;
  const interval = duration / steps;

  const animate = setInterval(() => {
    currentScore += scoreStep;
    currentFound += foundStep;

    if (currentScore >= targetScore) {
      currentScore = targetScore;
      currentFound = targetFound;
      clearInterval(animate);
    }

    scoreEl.textContent = Math.round(currentScore);
    gaugeEl.style.width = currentScore + '%';
    foundEl.textContent = Math.round(currentFound);
  }, interval);
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
    const url = item?.url || item?.documentUrl;
    const text = item?.text;
    const label = labels[key] || key;

    // Check if consent was previously given (for cookie banner)
    const consentGiven = item?.details?.consentGiven;
    // Check if found via deep scan
    const foundInDocument = item?.foundInDocument;
    const isDeepScan = item?.deepScan === true;

    let statusText = 'Not Found';
    if (found) {
      if (foundInDocument) {
        statusText = `Found in ${foundInDocument}`;
      } else if (consentGiven) {
        statusText = 'Found (consent given)';
      } else {
        statusText = 'Found';
      }
    }

    // Generate tooltip for deep scan items
    const matchedTextTooltip = item?.matchedText ? `title="${escapeHtml(item.matchedText)}"` : '';

    // "What's This?" info tooltip
    const descData = COMPLIANCE_DESCRIPTIONS[key];
    const infoTooltip = descData ? `
      <span class="compliance-info-trigger" tabindex="0">
        <span class="compliance-info-icon">i</span>
        <span class="compliance-tooltip">${escapeHtml(descData.desc)}<br><em>${escapeHtml(descData.reg)}</em></span>
      </span>` : '';

    return `
      <div class="compliance-item ${found ? 'found' : 'not-found'}${isDeepScan ? ' deep-scan-found' : ''}">
        <div>
          <span class="compliance-name">${label}</span>${infoTooltip}
          ${found && url ? `<a href="${url}" target="_blank" class="compliance-link" title="${text || url}">${text || 'View'}</a>` : ''}
        </div>
        <span class="compliance-status ${found ? 'found' : 'not-found'}${consentGiven ? ' consent-given' : ''}${isDeepScan ? ' deep-scan' : ''}" ${matchedTextTooltip}>
          <span class="status-icon">${found ? (isDeepScan ? '📄' : '&#10003;') : '&#10007;'}</span>
          ${statusText}
        </span>
      </div>
    `;
  }).join('');
}

// Escape HTML for safe insertion
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Render deep scan summary if performed
function renderDeepScanSummary(result) {
  if (!result.deepScanResults || !result.deepScanResults.performed) {
    return '';
  }

  const { scannedDocuments, itemsFound, errors } = result.deepScanResults;

  if (scannedDocuments.length === 0) {
    return '';
  }

  const documentLabels = {
    termsOfService: 'Terms of Service',
    privacyPolicy: 'Privacy Policy',
    legal: 'Legal Page',
    cookiePolicy: 'Cookie Policy'
  };

  const scannedList = scannedDocuments
    .map(doc => documentLabels[doc] || doc)
    .join(', ');

  const hasErrors = errors && errors.length > 0;

  return `
    <div class="deep-scan-summary">
      <div class="deep-scan-header">
        <span class="deep-scan-icon">📄</span>
        <span class="deep-scan-title">Deep Scan Complete</span>
      </div>
      <div class="deep-scan-details">
        <div class="deep-scan-stat">
          <span class="deep-scan-stat-label">Documents Scanned:</span>
          <span class="deep-scan-stat-value">${scannedList}</span>
        </div>
        <div class="deep-scan-stat">
          <span class="deep-scan-stat-label">Items Found:</span>
          <span class="deep-scan-stat-value ${itemsFound.length > 0 ? 'success' : ''}">${itemsFound.length}</span>
        </div>
        ${hasErrors ? `
          <div class="deep-scan-errors">
            <span class="deep-scan-error-icon">⚠️</span>
            ${errors.length} document${errors.length > 1 ? 's' : ''} could not be scanned
          </div>
        ` : ''}
      </div>
    </div>
  `;
}

function renderCompareResults(results) {
  if (results.length === 0) {
    showError('No results to display');
    return;
  }

  resultsSection.classList.remove('hidden');
  clearResultsBtn.classList.remove('hidden');
  if (copyResultsBtn) copyResultsBtn.classList.remove('hidden');

  const labels = getComplianceLabels();

  // Calculate summary stats
  const avgScore = Math.round(results.reduce((sum, r) => sum + r.score, 0) / results.length);
  const bestSite = results.reduce((best, r) => r.score > best.score ? r : best, results[0]);
  const worstSite = results.reduce((worst, r) => r.score < worst.score ? r : worst, results[0]);

  // Determine Oscar's mood based on average
  const moodKey = avgScore >= 80 ? 'excellent' : avgScore >= 60 ? 'good' : avgScore >= 40 ? 'fair' : 'poor';
  const mood = oscarResultMoods[moodKey];
  const oscarMessage = mood.messages[Math.floor(Math.random() * mood.messages.length)];

  // Build card-based comparison with mini Sniff-O-Meters
  const siteCards = results.map((result, index) => {
    const hostname = new URL(result.url).hostname;
    const { foundCount, totalCount, categoryStats } = calculateComplianceStats(result.compliance, labels);
    const siteMoodKey = result.score >= 80 ? 'excellent' : result.score >= 60 ? 'good' : result.score >= 40 ? 'fair' : 'poor';
    const siteMood = oscarResultMoods[siteMoodKey];

    // Build mini category bars
    const categoryBars = Object.entries(categoryStats)
      .filter(([_, stats]) => stats.total > 0)
      .slice(0, 4) // Show top 4 categories
      .map(([catKey, stats]) => {
        const percent = Math.round((stats.found / stats.total) * 100);
        return `
          <div class="compare-mini-category">
            <span class="compare-mini-icon">${stats.icon}</span>
            <div class="compare-mini-bar">
              <div class="compare-mini-fill ${percent === 100 ? 'complete' : percent >= 50 ? 'partial' : 'low'}" style="width: ${percent}%"></div>
            </div>
          </div>
        `;
      }).join('');

    return `
      <div class="compare-card sniff-o-meter-compare" data-index="${index}" data-scan-id="${result.id || ''}" data-url="${result.url}">
        <div class="compare-card-header">
          <div class="compare-oscar-mini">${siteMood.face}</div>
          <div class="compare-site-info">
            <span class="compare-card-site" title="${result.url}">${hostname}</span>
            <span class="compare-found-mini">${foundCount}/${totalCount} found</span>
          </div>
          <div class="compare-score-mini ${getScoreClass(result.score)}">
            <span class="compare-score-value">${result.score}</span>
            <span class="compare-score-percent">%</span>
          </div>
        </div>
        <div class="compare-card-body">
          <div class="compare-gauge-mini">
            <div class="compare-gauge-fill ${getScoreClass(result.score)}" style="width: ${result.score}%"></div>
          </div>
          <div class="compare-categories-mini">
            ${categoryBars}
          </div>
        </div>
        <div class="compare-card-footer">
          <span class="compare-view-history">View in History →</span>
        </div>
      </div>
    `;
  }).join('');

  resultsSection.innerHTML = `
    <div class="compare-results sniff-o-meter-compare-results">
      <!-- Oscar's Summary Header -->
      <div class="compare-oscar-header">
        <div class="compare-oscar-face">${mood.face}</div>
        <div class="compare-oscar-info">
          <div class="compare-oscar-speech">"${oscarMessage}"</div>
          <div class="compare-sites-count">Compared ${results.length} sites</div>
        </div>
      </div>

      <!-- Summary Stats -->
      <div class="compare-stats-bar">
        <div class="compare-stat">
          <div class="compare-stat-value" id="compare-avg-score">0</div>
          <div class="compare-stat-label">Avg Score</div>
        </div>
        <div class="compare-stat best">
          <div class="compare-stat-value">${bestSite.score}%</div>
          <div class="compare-stat-label">🏆 Best</div>
        </div>
        <div class="compare-stat worst">
          <div class="compare-stat-value">${worstSite.score}%</div>
          <div class="compare-stat-label">📉 Lowest</div>
        </div>
      </div>

      <!-- Site Cards -->
      <div class="compare-cards-container">
        ${siteCards}
      </div>
    </div>
  `;

  // Animate average score
  animateCompareScore(avgScore);

  // Add click handlers for compare cards to open history
  setupCompareCardClickHandlers();
}

function setupCompareCardClickHandlers() {
  const cards = document.querySelectorAll('.compare-card.sniff-o-meter-compare');
  cards.forEach(card => {
    card.addEventListener('click', () => {
      // Open history page - the scan will be there from the recent scan
      chrome.tabs.create({ url: chrome.runtime.getURL('history/history.html') });
    });
  });
}

function animateCompareScore(targetScore) {
  const scoreEl = document.getElementById('compare-avg-score');
  if (!scoreEl) return;

  let current = 0;
  const duration = 800;
  const steps = 20;
  const step = targetScore / steps;
  const interval = duration / steps;

  const animate = setInterval(() => {
    current += step;
    if (current >= targetScore) {
      current = targetScore;
      clearInterval(animate);
    }
    scoreEl.textContent = Math.round(current) + '%';
  }, interval);
}

// ========================================
// Clear & Error
// ========================================

function clearResults() {
  resultsSection.classList.add('hidden');
  resultsSection.innerHTML = '';
  clearResultsBtn.classList.add('hidden');
  if (copyResultsBtn) copyResultsBtn.classList.add('hidden');
  scanResults = null;
}

function showError(message) {
  resultsSection.classList.remove('hidden');

  // Dog-themed error messages
  const errorConfig = getErrorConfig(message);

  resultsSection.innerHTML = `
    <div class="error-card">
      <div class="error-oscar">${errorConfig.face}</div>
      <div class="error-title">${errorConfig.title}</div>
      <div class="error-message">${errorConfig.message}</div>
      <div class="error-hint">${errorConfig.hint}</div>
    </div>
  `;
}

function getErrorConfig(message) {
  const lowerMessage = message.toLowerCase();

  // Connection error - can't reach the page
  if (lowerMessage.includes('receiving end does not exist') ||
      lowerMessage.includes('could not establish connection') ||
      lowerMessage.includes('no tab') ||
      lowerMessage.includes('cannot access')) {
    return {
      face: '🐕‍🦺',
      title: "Oscar can't sniff this page!",
      message: "This page has a \"No Dogs Allowed\" sign. Oscar can't scan browser system pages, extension pages, or protected sites.",
      hint: "🦴 Try scanning a regular website instead!"
    };
  }

  // Permission or access error
  if (lowerMessage.includes('permission') || lowerMessage.includes('access denied')) {
    return {
      face: '🚫🐕',
      title: "Blocked by the fence!",
      message: "Oscar doesn't have permission to sniff around this yard.",
      hint: "🦴 This site may have restricted access."
    };
  }

  // Timeout error
  if (lowerMessage.includes('timeout') || lowerMessage.includes('timed out')) {
    return {
      face: '😴',
      title: "Oscar got tired waiting...",
      message: "The page took too long to respond. Oscar fell asleep!",
      hint: "🦴 Try again or check if the page is loading slowly."
    };
  }

  // Network error
  if (lowerMessage.includes('network') || lowerMessage.includes('fetch') || lowerMessage.includes('failed to load')) {
    return {
      face: '📡🐕',
      title: "Lost the scent!",
      message: "Oscar couldn't connect to the page. The trail went cold!",
      hint: "🦴 Check your internet connection and try again."
    };
  }

  // No results
  if (lowerMessage.includes('no results')) {
    return {
      face: '🔍🐕',
      title: "Nothing to sniff here!",
      message: "Oscar searched everywhere but couldn't find any results.",
      hint: "🦴 Try selecting some tabs to compare."
    };
  }

  // Default error
  return {
    face: '😿',
    title: "Uh oh! Oscar hit a snag",
    message: message,
    hint: "🦴 Try refreshing the page or scanning again."
  };
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

// ========================================
// Force Cookie Banner
// ========================================

async function forceCookieBanner() {
  const btn = document.getElementById('force-cookie-banner');
  if (!btn || btn.classList.contains('loading')) return;

  btn.classList.add('loading');
  const originalText = btn.querySelector('.btn-text').textContent;
  btn.querySelector('.btn-text').textContent = 'Detecting CMP';

  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab || !tab.id) {
      showCookieToast('No active tab found', 'error');
      return;
    }

    // First, try to detect and trigger CMP via content script
    const result = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: detectAndTriggerCMP
    });

    const cmpResult = result[0]?.result;

    if (cmpResult?.success) {
      showCookieToast(cmpResult.message, 'success');
    } else if (cmpResult?.needsReload) {
      // CMP not found, offer to clear storage and reload
      btn.querySelector('.btn-text').textContent = 'Clearing consent';

      // Clear consent-related cookies
      await clearConsentCookies(tab.url);

      // Clear consent-related localStorage via content script
      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: clearConsentStorage
      });

      showCookieToast('Consent cleared! Reloading page...', 'warning');

      // Reload the tab after a short delay
      setTimeout(() => {
        chrome.tabs.reload(tab.id);
      }, 1000);
    } else {
      showCookieToast(cmpResult?.message || 'Could not trigger cookie banner', 'error');
    }
  } catch (error) {
    showCookieToast('Error: ' + error.message, 'error');
  } finally {
    btn.classList.remove('loading');
    btn.querySelector('.btn-text').textContent = originalText;
  }
}

// Content script function to detect and trigger CMP
function detectAndTriggerCMP() {
  const cmps = [
    // OneTrust
    {
      name: 'OneTrust',
      detect: () => typeof OneTrust !== 'undefined',
      trigger: () => {
        if (typeof OneTrust !== 'undefined' && OneTrust.ToggleInfoDisplay) {
          OneTrust.ToggleInfoDisplay();
          return true;
        }
        return false;
      }
    },
    // Cookiebot
    {
      name: 'Cookiebot',
      detect: () => typeof Cookiebot !== 'undefined',
      trigger: () => {
        if (typeof Cookiebot !== 'undefined' && Cookiebot.renew) {
          Cookiebot.renew();
          return true;
        }
        return false;
      }
    },
    // TrustArc / TRUSTe
    {
      name: 'TrustArc',
      detect: () => typeof truste !== 'undefined' || document.querySelector('#truste-consent-track'),
      trigger: () => {
        if (typeof truste !== 'undefined' && truste.eu && truste.eu.clickListener) {
          truste.eu.clickListener();
          return true;
        }
        // Try clicking the TrustArc button
        const btn = document.querySelector('#truste-consent-button, .truste-consent-button, [data-truste-trigger]');
        if (btn) { btn.click(); return true; }
        return false;
      }
    },
    // Quantcast / IAB TCF v2
    {
      name: 'TCF v2 (Quantcast/IAB)',
      detect: () => typeof __tcfapi !== 'undefined',
      trigger: () => {
        if (typeof __tcfapi !== 'undefined') {
          __tcfapi('displayConsentUi', 2, () => {});
          return true;
        }
        return false;
      }
    },
    // Didomi
    {
      name: 'Didomi',
      detect: () => typeof Didomi !== 'undefined',
      trigger: () => {
        if (typeof Didomi !== 'undefined' && Didomi.preferences && Didomi.preferences.show) {
          Didomi.preferences.show();
          return true;
        }
        return false;
      }
    },
    // Usercentrics
    {
      name: 'Usercentrics',
      detect: () => typeof UC_UI !== 'undefined',
      trigger: () => {
        if (typeof UC_UI !== 'undefined' && UC_UI.showSecondLayer) {
          UC_UI.showSecondLayer();
          return true;
        }
        return false;
      }
    },
    // CookieYes
    {
      name: 'CookieYes',
      detect: () => typeof getCkyConsent !== 'undefined' || document.querySelector('.cky-consent-container'),
      trigger: () => {
        const btn = document.querySelector('.cky-btn-revisit, [data-cky-tag="revisit-consent"]');
        if (btn) { btn.click(); return true; }
        // Try to show the banner directly
        const banner = document.querySelector('.cky-consent-container');
        if (banner) { banner.style.display = 'block'; return true; }
        return false;
      }
    },
    // Osano
    {
      name: 'Osano',
      detect: () => typeof Osano !== 'undefined',
      trigger: () => {
        if (typeof Osano !== 'undefined' && Osano.cm && Osano.cm.showDrawer) {
          Osano.cm.showDrawer();
          return true;
        }
        return false;
      }
    },
    // Klaro
    {
      name: 'Klaro',
      detect: () => typeof klaro !== 'undefined',
      trigger: () => {
        if (typeof klaro !== 'undefined' && klaro.show) {
          klaro.show();
          return true;
        }
        return false;
      }
    },
    // Generic: Try to find and click common cookie settings buttons
    {
      name: 'Generic Cookie Settings',
      detect: () => true, // Always try as fallback
      trigger: () => {
        const selectors = [
          '[data-cookie-settings]',
          '[data-cookie-preferences]',
          '.cookie-settings-button',
          '.cookie-preferences-button',
          '#cookie-settings',
          '#cookie-preferences',
          'button[aria-label*="cookie" i]',
          'a[href*="cookie-settings"]',
          'a[href*="cookie-preferences"]',
          '.cc-revoke',
          '.cc-btn.cc-dismiss'
        ];

        for (const selector of selectors) {
          const el = document.querySelector(selector);
          if (el) {
            el.click();
            return true;
          }
        }
        return false;
      }
    }
  ];

  // Try each CMP
  for (const cmp of cmps) {
    try {
      if (cmp.detect()) {
        const triggered = cmp.trigger();
        if (triggered) {
          return { success: true, message: `${cmp.name} banner triggered!` };
        }
      }
    } catch (e) {
      // Continue to next CMP
    }
  }

  // No CMP found or couldn't trigger
  return { success: false, needsReload: true, message: 'No CMP detected. Clearing consent data...' };
}

// Content script function to clear consent storage
function clearConsentStorage() {
  const consentKeys = [
    // Common consent storage keys
    'cookieconsent', 'cookie_consent', 'cookie-consent',
    'CookieConsent', 'euconsent', 'euconsent-v2',
    'consentUUID', 'consentDate', 'gdpr', 'gdpr_consent',
    'ccpa', 'ccpa_consent', 'privacy_consent',
    'cookiebot', 'CookieBot', 'cookieyes',
    'onetrust', 'OneTrust', 'OptanonConsent', 'OptanonAlertBoxClosed',
    'didomi', 'Didomi', 'didomi_token',
    'usercentrics', 'uc_settings', 'UC_UI',
    'trustarc', 'truste', 'notice_gdpr_prefs',
    'osano', 'klaro', 'cookiehub',
    '__cmp', '_cmpRepromptHash', 'usprivacy'
  ];

  let cleared = 0;

  // Clear localStorage
  for (const key of consentKeys) {
    if (localStorage.getItem(key) !== null) {
      localStorage.removeItem(key);
      cleared++;
    }
  }

  // Also clear any key containing common consent-related terms
  const allKeys = Object.keys(localStorage);
  for (const key of allKeys) {
    const lowerKey = key.toLowerCase();
    if (lowerKey.includes('consent') ||
        lowerKey.includes('cookie') ||
        lowerKey.includes('gdpr') ||
        lowerKey.includes('privacy') ||
        lowerKey.includes('optanon') ||
        lowerKey.includes('euconsent')) {
      localStorage.removeItem(key);
      cleared++;
    }
  }

  // Clear sessionStorage too
  for (const key of consentKeys) {
    if (sessionStorage.getItem(key) !== null) {
      sessionStorage.removeItem(key);
      cleared++;
    }
  }

  return { cleared };
}

// Clear consent cookies for the domain
async function clearConsentCookies(urlString) {
  try {
    const url = new URL(urlString);
    const domain = url.hostname;

    // Get all cookies for this domain
    const cookies = await chrome.cookies.getAll({ domain });

    const consentPatterns = [
      'consent', 'cookie', 'gdpr', 'ccpa', 'privacy',
      'optanon', 'euconsent', 'onetrust', 'cookiebot',
      'didomi', 'usercentrics', 'trustarc', 'osano', 'klaro'
    ];

    let removed = 0;
    for (const cookie of cookies) {
      const lowerName = cookie.name.toLowerCase();
      const isConsentCookie = consentPatterns.some(pattern => lowerName.includes(pattern));

      if (isConsentCookie) {
        const cookieUrl = `http${cookie.secure ? 's' : ''}://${cookie.domain.startsWith('.') ? cookie.domain.slice(1) : cookie.domain}${cookie.path}`;
        await chrome.cookies.remove({ url: cookieUrl, name: cookie.name });
        removed++;
      }
    }

    return { removed };
  } catch (error) {
    return { error: error.message };
  }
}

// Show toast notification
function showCookieToast(message, type = 'success') {
  // Remove existing toast
  const existing = document.querySelector('.cookie-banner-toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = `cookie-banner-toast ${type}`;
  toast.textContent = message;
  document.body.appendChild(toast);

  // Trigger animation
  requestAnimationFrame(() => {
    toast.classList.add('visible');
  });

  // Remove after delay
  setTimeout(() => {
    toast.classList.remove('visible');
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// ========================================
// Copy Results to Clipboard
// ========================================

async function copyResultsToClipboard() {
  if (!scanResults || scanResults.length === 0) return;

  const labels = getComplianceLabels();
  const version = chrome.runtime.getManifest().version;
  let text = '';

  if (scanResults.length === 1) {
    // Single result
    const result = scanResults[0];
    const hostname = new URL(result.url).hostname;
    const date = new Date(result.scannedAt).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric'
    });

    text += `# OSCAR Compliance Report\n`;
    text += `**Site:** ${hostname}\n`;
    text += `**Score:** ${result.score}% (${getScoreLabel(result.score)})\n`;
    text += `**Date:** ${date}\n\n`;
    text += `## Compliance Checklist\n`;

    for (const [key, value] of Object.entries(result.compliance)) {
      const found = typeof value === 'boolean' ? value : (value && value.found);
      const label = labels[key] || key;
      text += `- [${found ? 'x' : ' '}] ${label}\n`;
    }
  } else {
    // Compare mode
    const avgScore = Math.round(scanResults.reduce((sum, r) => sum + r.score, 0) / scanResults.length);
    text += `# OSCAR Comparison Report\n`;
    text += `**Sites compared:** ${scanResults.length}\n`;
    text += `**Average score:** ${avgScore}%\n\n`;

    for (const result of scanResults) {
      const hostname = new URL(result.url).hostname;
      const date = new Date(result.scannedAt).toLocaleDateString('en-US', {
        month: 'short', day: 'numeric', year: 'numeric'
      });

      text += `## ${hostname} — ${result.score}% (${getScoreLabel(result.score)})\n`;
      text += `**Date:** ${date}\n`;

      for (const [key, value] of Object.entries(result.compliance)) {
        const found = typeof value === 'boolean' ? value : (value && value.found);
        const label = labels[key] || key;
        text += `- [${found ? 'x' : ' '}] ${label}\n`;
      }
      text += '\n';
    }
  }

  text += `\n---\nGenerated by OSCAR v${version}\n`;

  try {
    await navigator.clipboard.writeText(text);
    showCookieToast('Results copied to clipboard!', 'success');
  } catch (err) {
    showCookieToast('Failed to copy results', 'error');
  }
}

// ========================================
// Deep Scan
// ========================================

// Document labels for display (all compliance items that could have URLs)
const DOCUMENT_LABELS = {
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

function checkDeepScanEligibility(result) {
  // Check if we have document links to scan
  const hasDocumentLinks = result.documentLinks &&
    Object.keys(result.documentLinks).length > 0;

  if (!hasDocumentLinks) {
    return { eligible: false, reason: 'No document links found' };
  }

  // Check if there are missing compliance items that could be found via deep scan
  const deepScanPatternKeys = ['dmca', 'dispute', 'reportAbuse', 'doNotSell', 'dataRequest', 'accessibility'];
  const missingItems = [];

  for (const key of deepScanPatternKeys) {
    const item = result.compliance[key];
    const found = typeof item === 'boolean' ? item : (item && item.found);
    if (!found) {
      missingItems.push(key);
    }
  }

  if (missingItems.length === 0) {
    return { eligible: false, reason: 'All scannable items already found' };
  }

  return {
    eligible: true,
    documentLinks: result.documentLinks,
    documentCount: Object.keys(result.documentLinks).length,
    missingCount: missingItems.length
  };
}

function resetDeepScanUI() {
  if (!deepScanContainer) return;

  // Reset all button states
  if (deepScanToggle) {
    deepScanToggle.disabled = false;
    deepScanToggle.classList.remove('loading');
  }
  if (deepScanStartBtn) {
    deepScanStartBtn.disabled = false;
    deepScanStartBtn.classList.remove('loading');
  }
  if (deepScanOptions) {
    deepScanOptions.classList.add('hidden');
  }
  if (deepScanToggle) {
    const caret = deepScanToggle.querySelector('.btn-caret');
    if (caret) caret.textContent = '▼';
  }
}

function updateDeepScanButton(result) {
  if (!deepScanContainer) return;

  // Always reset UI state first
  resetDeepScanUI();

  const eligibility = checkDeepScanEligibility(result);

  if (eligibility.eligible) {
    deepScanContainer.classList.remove('hidden');

    // Update button text
    const docCount = eligibility.documentCount;
    deepScanToggle.querySelector('.btn-text').textContent =
      `Deep Scan ${docCount} Document${docCount > 1 ? 's' : ''}`;

    // Populate document checkboxes
    populateDocumentList(eligibility.documentLinks);

    // Collapse options by default
    deepScanOptions.classList.add('hidden');
    deepScanToggle.querySelector('.btn-caret').textContent = '▼';
  } else {
    deepScanContainer.classList.add('hidden');
  }
}

function populateDocumentList(documentLinks) {
  if (!deepScanDocsList) return;

  deepScanDocsList.innerHTML = '';

  for (const [key, url] of Object.entries(documentLinks)) {
    const label = DOCUMENT_LABELS[key] || key;
    const hostname = new URL(url).hostname;

    const docItem = document.createElement('label');
    docItem.className = 'deep-scan-doc-item';
    docItem.innerHTML = `
      <input type="checkbox" name="deep-scan-doc" value="${key}" data-url="${escapeHtml(url)}" checked>
      <span class="deep-scan-doc-icon">📄</span>
      <span class="deep-scan-doc-info">
        <span class="deep-scan-doc-label">${label}</span>
        <span class="deep-scan-doc-url" title="${escapeHtml(url)}">${hostname}</span>
      </span>
    `;

    deepScanDocsList.appendChild(docItem);
  }

  updateDeepScanStartButton();

  // Add change listeners to checkboxes
  deepScanDocsList.querySelectorAll('input[type="checkbox"]').forEach(cb => {
    cb.addEventListener('change', updateDeepScanStartButton);
  });
}

function updateDeepScanStartButton() {
  if (!deepScanStartBtn || !deepScanDocsList) return;

  const checkedCount = deepScanDocsList.querySelectorAll('input[type="checkbox"]:checked').length;
  deepScanStartBtn.disabled = checkedCount === 0;
  deepScanStartBtn.querySelector('.btn-text').textContent =
    checkedCount === 0 ? 'Select Documents' : `Scan ${checkedCount} Selected`;
}

function toggleDeepScanOptions() {
  if (!deepScanOptions || !deepScanToggle) return;

  const isHidden = deepScanOptions.classList.contains('hidden');
  deepScanOptions.classList.toggle('hidden');
  deepScanToggle.querySelector('.btn-caret').textContent = isHidden ? '▲' : '▼';
}

function getSelectedDocuments() {
  if (!deepScanDocsList) return {};

  const selected = {};
  deepScanDocsList.querySelectorAll('input[type="checkbox"]:checked').forEach(cb => {
    selected[cb.value] = cb.dataset.url;
  });
  return selected;
}

async function performDeepScan() {
  if (!scanResults || scanResults.length === 0 || isScanning) return;

  const currentResult = scanResults[0];
  const selectedDocs = getSelectedDocuments();

  if (Object.keys(selectedDocs).length === 0) {
    showCookieToast('No documents selected', 'error');
    return;
  }

  // Update buttons to show progress
  deepScanStartBtn.disabled = true;
  deepScanStartBtn.classList.add('loading');
  deepScanToggle.disabled = true;
  const originalText = deepScanStartBtn.querySelector('.btn-text').textContent;
  deepScanStartBtn.querySelector('.btn-text').textContent = 'Scanning...';

  showProgress('Oscar is reading the fine print...');

  try {
    // Create a modified result with only selected documents
    const modifiedResult = {
      ...currentResult,
      documentLinks: selectedDocs
    };

    const response = await chrome.runtime.sendMessage({
      action: 'deepScanTab',
      initialResults: modifiedResult
    });

    if (response.success) {
      // Update scan results with deep scan findings
      scanResults = [response.data];

      // Re-render results
      renderSingleResult(response.data);

      // Update badge
      chrome.runtime.sendMessage({
        action: 'updateBadge',
        score: response.data.score
      });

      // Show success message
      const itemsFound = response.data.deepScanResults?.itemsFound || [];
      if (itemsFound.length > 0) {
        showCookieToast(`Found ${itemsFound.length} item${itemsFound.length > 1 ? 's' : ''} in documents!`, 'success');
      } else {
        showCookieToast('No additional items found', 'warning');
      }

      // Hide deep scan container since scan is complete
      deepScanContainer.classList.add('hidden');
    } else {
      showCookieToast(response.error || 'Deep scan failed', 'error');
      deepScanStartBtn.disabled = false;
      deepScanToggle.disabled = false;
      deepScanStartBtn.querySelector('.btn-text').textContent = originalText;
    }
  } catch (error) {
    showCookieToast('Deep scan error: ' + error.message, 'error');
    deepScanStartBtn.disabled = false;
    deepScanToggle.disabled = false;
    deepScanStartBtn.querySelector('.btn-text').textContent = originalText;
  } finally {
    deepScanStartBtn.classList.remove('loading');
    hideProgress();
  }
}

