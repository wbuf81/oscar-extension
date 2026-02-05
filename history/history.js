// OSCAR History Page

let historyData = [];
let filteredData = [];
let selectedScanId = null;
let compareMode = false;
let selectedForCompare = new Set();

// DOM Elements
const historyList = document.getElementById('history-list');
const emptyState = document.getElementById('empty-state');
const noResultsState = document.getElementById('no-results-state');
const searchInput = document.getElementById('search-input');
const scoreFilter = document.getElementById('score-filter');
const clearAllBtn = document.getElementById('clear-all-history');
const exportCsvBtn = document.getElementById('export-csv');
const totalScansEl = document.getElementById('total-scans');
const avgScoreEl = document.getElementById('avg-score');
const uniqueSitesEl = document.getElementById('unique-sites');
const detailModal = document.getElementById('detail-modal');
const modalTitle = document.getElementById('modal-title');
const modalBody = document.getElementById('modal-body');
const deleteScanBtn = document.getElementById('delete-scan');

// Compare Mode Elements
const toggleCompareModeBtn = document.getElementById('toggle-compare-mode');
const compareInstructions = document.getElementById('compare-instructions');
const exitCompareModeBtn = document.getElementById('exit-compare-mode');
const compareBar = document.getElementById('compare-bar');
const compareCountEl = document.getElementById('compare-count');
const clearCompareBtn = document.getElementById('clear-compare-selection');
const compareSelectedBtn = document.getElementById('compare-selected');
const compareModal = document.getElementById('compare-modal');
const compareModalBody = document.getElementById('compare-modal-body');

// Initialize
document.addEventListener('DOMContentLoaded', init);

async function init() {
  await loadHistory();
  setupEventListeners();
  renderHistory();
  updateStats();
}

// ========================================
// Data Loading
// ========================================

async function loadHistory() {
  try {
    const result = await chrome.storage.local.get('history');
    historyData = result.history || [];
    filteredData = [...historyData];
  } catch (error) {
    console.error('Failed to load history:', error);
    historyData = [];
    filteredData = [];
  }
}

// ========================================
// Event Listeners
// ========================================

function setupEventListeners() {
  searchInput.addEventListener('input', filterHistory);
  scoreFilter.addEventListener('change', filterHistory);
  clearAllBtn.addEventListener('click', clearAllHistory);
  deleteScanBtn.addEventListener('click', deleteSelectedScan);
  if (exportCsvBtn) {
    exportCsvBtn.addEventListener('click', exportHistoryToCsv);
  }

  // Modal close buttons
  document.querySelectorAll('.modal-close, .modal-close-btn').forEach(btn => {
    btn.addEventListener('click', closeModal);
  });

  // Backdrop click to close
  document.querySelector('.modal-backdrop').addEventListener('click', closeModal);

  // Escape key to close modal
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (compareModal && compareModal.classList.contains('visible')) {
        closeCompareModal();
      } else if (detailModal.classList.contains('visible')) {
        closeModal();
      }
    }
  });

  // Compare mode event listeners
  if (toggleCompareModeBtn) {
    toggleCompareModeBtn.addEventListener('click', toggleCompareMode);
  }
  if (exitCompareModeBtn) {
    exitCompareModeBtn.addEventListener('click', exitCompareMode);
  }
  if (clearCompareBtn) {
    clearCompareBtn.addEventListener('click', clearCompareSelection);
  }
  if (compareSelectedBtn) {
    compareSelectedBtn.addEventListener('click', showCompareModal);
  }

  // Compare modal close buttons
  document.querySelectorAll('.compare-modal-close').forEach(btn => {
    btn.addEventListener('click', closeCompareModal);
  });

  // Compare modal backdrop click
  if (compareModal) {
    const backdrop = compareModal.querySelector('.modal-backdrop');
    if (backdrop) {
      backdrop.addEventListener('click', closeCompareModal);
    }
  }
}

// ========================================
// Filtering
// ========================================

function filterHistory() {
  const searchTerm = searchInput.value.toLowerCase().trim();
  const scoreFilterValue = scoreFilter.value;

  filteredData = historyData.filter(item => {
    // Search filter
    const matchesSearch = !searchTerm ||
      item.url.toLowerCase().includes(searchTerm) ||
      new URL(item.url).hostname.toLowerCase().includes(searchTerm);

    // Score filter
    let matchesScore = true;
    if (scoreFilterValue !== 'all') {
      switch (scoreFilterValue) {
        case 'excellent':
          matchesScore = item.score >= 80;
          break;
        case 'good':
          matchesScore = item.score >= 60 && item.score < 80;
          break;
        case 'fair':
          matchesScore = item.score >= 40 && item.score < 60;
          break;
        case 'poor':
          matchesScore = item.score < 40;
          break;
      }
    }

    return matchesSearch && matchesScore;
  });

  renderHistory();
}

// ========================================
// Rendering
// ========================================

function renderHistory() {
  historyList.innerHTML = '';

  if (historyData.length === 0) {
    emptyState.classList.remove('hidden');
    noResultsState.classList.add('hidden');
    return;
  }

  emptyState.classList.add('hidden');

  if (filteredData.length === 0) {
    noResultsState.classList.remove('hidden');
    return;
  }

  noResultsState.classList.add('hidden');

  filteredData.forEach(item => {
    const itemEl = createHistoryItemElement(item);
    historyList.appendChild(itemEl);
  });
}

function createHistoryItemElement(item) {
  const div = document.createElement('div');
  div.className = 'history-item';
  div.dataset.id = item.id;

  const hostname = new URL(item.url).hostname;
  const date = new Date(item.scannedAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  });

  const scoreClass = getScoreClass(item.score);
  const foundCount = countFoundItems(item.compliance);
  const isSelected = selectedForCompare.has(item.id);

  div.innerHTML = `
    <div class="history-item-checkbox ${compareMode ? '' : 'hidden'}">
      <input type="checkbox" class="compare-checkbox" data-id="${item.id}" ${isSelected ? 'checked' : ''}>
    </div>
    <div class="history-item-score ${scoreClass}">${item.score}%</div>
    <div class="history-item-info">
      <div class="history-item-url">${hostname}</div>
      <div class="history-item-meta">
        <span class="history-item-date">📅 ${date}</span>
        <span class="history-item-found">✓ ${foundCount} items found</span>
      </div>
    </div>
    <div class="history-item-arrow">›</div>
  `;

  // Add class if selected
  if (isSelected) {
    div.classList.add('selected-for-compare');
  }

  // Handle click based on compare mode
  div.addEventListener('click', (e) => {
    if (compareMode) {
      // In compare mode, toggle checkbox
      const checkbox = div.querySelector('.compare-checkbox');
      if (e.target !== checkbox) {
        checkbox.checked = !checkbox.checked;
        handleCompareCheckboxChange(checkbox, item.id, div);
      }
    } else {
      // Normal mode, open detail modal
      openDetailModal(item);
    }
  });

  // Handle checkbox change directly
  const checkbox = div.querySelector('.compare-checkbox');
  if (checkbox) {
    checkbox.addEventListener('change', (e) => {
      e.stopPropagation();
      handleCompareCheckboxChange(checkbox, item.id, div);
    });
  }

  return div;
}

function handleCompareCheckboxChange(checkbox, itemId, div) {
  if (checkbox.checked) {
    if (selectedForCompare.size < 4) {
      selectedForCompare.add(itemId);
      div.classList.add('selected-for-compare');
    } else {
      checkbox.checked = false;
      OscarModal.alert({
        title: 'Selection Limit',
        message: 'You can compare up to 4 scans at a time. Please deselect one first.',
        type: 'warning'
      });
    }
  } else {
    selectedForCompare.delete(itemId);
    div.classList.remove('selected-for-compare');
  }
  updateCompareBar();
}

function getScoreClass(score) {
  if (score >= 80) return 'excellent';
  if (score >= 60) return 'good';
  if (score >= 40) return 'fair';
  return 'poor';
}

function getScoreLabel(score) {
  if (score >= 80) return 'Excellent';
  if (score >= 60) return 'Good';
  if (score >= 40) return 'Fair';
  return 'Poor';
}

function countFoundItems(compliance) {
  let count = 0;
  for (const [key, value] of Object.entries(compliance)) {
    const found = typeof value === 'boolean' ? value : (value && value.found);
    if (found) count++;
  }
  return count;
}

// ========================================
// Stats
// ========================================

function updateStats() {
  // Total scans
  totalScansEl.textContent = historyData.length;

  // Average score
  if (historyData.length > 0) {
    const avgScore = Math.round(
      historyData.reduce((sum, item) => sum + item.score, 0) / historyData.length
    );
    avgScoreEl.textContent = avgScore + '%';
  } else {
    avgScoreEl.textContent = '0%';
  }

  // Unique sites
  const uniqueSites = new Set(historyData.map(item => {
    try {
      return new URL(item.url).hostname;
    } catch {
      return item.url;
    }
  }));
  uniqueSitesEl.textContent = uniqueSites.size;
}

// ========================================
// Modal
// ========================================

async function openDetailModal(item) {
  selectedScanId = item.id;

  const hostname = new URL(item.url).hostname;
  const date = new Date(item.scannedAt).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  });

  const scoreClass = getScoreClass(item.score);
  const scoreLabel = getScoreLabel(item.score);

  // Load training settings for labels
  let labels = {};
  try {
    const result = await chrome.storage.local.get('trainingSettings');
    if (result.trainingSettings) {
      for (const [key, setting] of Object.entries(result.trainingSettings.builtinItems)) {
        labels[key] = setting.label;
      }
      for (const custom of result.trainingSettings.customItems) {
        labels[custom.id] = custom.label;
      }
    }
  } catch (e) {
    console.error('Failed to load labels', e);
  }

  // Default labels
  const defaultLabels = {
    privacyPolicy: 'Privacy Policy',
    cookieBanner: 'Cookie Banner',
    doNotSell: 'Do Not Sell (CCPA)',
    cookiePolicy: 'Cookie Policy',
    cookieSettings: 'Cookie Settings',
    termsOfService: 'Terms of Service',
    legal: 'Legal Notice',
    dispute: 'Dispute Resolution',
    dmca: 'DMCA / Copyright',
    reportAbuse: 'Report Abuse'
  };

  labels = { ...defaultLabels, ...labels };

  // Build compliance items
  const complianceItems = Object.entries(item.compliance).map(([key, value]) => {
    const found = typeof value === 'boolean' ? value : (value && value.found);
    const url = value?.url;
    const label = labels[key] || key;

    return `
      <div class="compliance-item ${found ? 'found' : 'not-found'}">
        <span class="status-icon">${found ? '✓' : '✗'}</span>
        <span class="item-label">${label}</span>
        ${found && url ? `<a href="${url}" target="_blank" class="item-link" title="${url}">View</a>` : ''}
      </div>
    `;
  }).join('');

  modalBody.innerHTML = `
    <div class="detail-header">
      <div class="detail-score ${scoreClass}">
        <span class="score-value">${item.score}%</span>
        <span class="score-label">${scoreLabel}</span>
      </div>
      <div class="detail-info">
        <div class="detail-url">${hostname}</div>
        <div class="detail-date">${date}</div>
        <a href="${item.url}" target="_blank" style="font-size: 12px; color: var(--primary);">Open original page →</a>
      </div>
    </div>

    <div class="detail-section">
      <h4>Compliance Items</h4>
      <div class="compliance-grid">
        ${complianceItems}
      </div>
    </div>
  `;

  detailModal.classList.remove('hidden');
  setTimeout(() => {
    detailModal.classList.add('visible');
  }, 10);
}

function closeModal() {
  detailModal.classList.remove('visible');
  setTimeout(() => {
    detailModal.classList.add('hidden');
    selectedScanId = null;
  }, 300);
}

// ========================================
// Delete Operations
// ========================================

async function deleteSelectedScan() {
  if (!selectedScanId) return;

  const confirmed = await OscarModal.confirm({
    title: 'Delete Scan',
    message: 'Delete this scan from history?',
    confirmText: 'Delete',
    cancelText: 'Keep It',
    type: 'danger'
  });

  if (confirmed) {
    try {
      historyData = historyData.filter(item => item.id !== selectedScanId);
      await chrome.storage.local.set({ history: historyData });

      closeModal();

      // Re-filter and render
      filterHistory();
      updateStats();
    } catch (error) {
      console.error('Failed to delete scan:', error);
    }
  }
}

async function clearAllHistory() {
  const confirmed = await OscarModal.confirm({
    title: 'Clear All History',
    message: 'Clear all scan history?\n\nThis action cannot be undone.',
    confirmText: 'Clear All',
    cancelText: 'Keep History',
    type: 'danger'
  });

  if (confirmed) {
    try {
      historyData = [];
      filteredData = [];
      await chrome.storage.local.set({ history: [] });

      renderHistory();
      updateStats();
    } catch (error) {
      console.error('Failed to clear history:', error);
    }
  }
}

// ========================================
// Compare Mode
// ========================================

function toggleCompareMode() {
  compareMode = !compareMode;

  if (compareMode) {
    enterCompareMode();
  } else {
    exitCompareMode();
  }
}

function enterCompareMode() {
  compareMode = true;
  document.body.classList.add('compare-mode-active');

  // Update button
  if (toggleCompareModeBtn) {
    toggleCompareModeBtn.classList.add('active');
    toggleCompareModeBtn.querySelector('.compare-text').textContent = 'Exit Compare';
  }

  // Show instructions
  if (compareInstructions) {
    compareInstructions.classList.remove('hidden');
  }

  // Show checkboxes
  document.querySelectorAll('.history-item-checkbox').forEach(el => {
    el.classList.remove('hidden');
  });

  // Show compare bar
  if (compareBar) {
    compareBar.classList.remove('hidden');
  }

  updateCompareBar();
}

function exitCompareMode() {
  compareMode = false;
  document.body.classList.remove('compare-mode-active');

  // Update button
  if (toggleCompareModeBtn) {
    toggleCompareModeBtn.classList.remove('active');
    toggleCompareModeBtn.querySelector('.compare-text').textContent = 'Compare Scans';
  }

  // Hide instructions
  if (compareInstructions) {
    compareInstructions.classList.add('hidden');
  }

  // Hide checkboxes
  document.querySelectorAll('.history-item-checkbox').forEach(el => {
    el.classList.add('hidden');
  });

  // Hide compare bar
  if (compareBar) {
    compareBar.classList.add('hidden');
  }

  // Clear selection
  clearCompareSelection();
}

function clearCompareSelection() {
  selectedForCompare.clear();

  // Uncheck all checkboxes
  document.querySelectorAll('.compare-checkbox').forEach(cb => {
    cb.checked = false;
  });

  // Remove selection styling
  document.querySelectorAll('.history-item.selected-for-compare').forEach(el => {
    el.classList.remove('selected-for-compare');
  });

  updateCompareBar();
}

function updateCompareBar() {
  const count = selectedForCompare.size;

  if (compareCountEl) {
    compareCountEl.textContent = count;
  }

  if (compareSelectedBtn) {
    compareSelectedBtn.disabled = count < 2;
    compareSelectedBtn.textContent = count < 2 ? 'Select at least 2' : `Compare ${count} Scans`;
  }
}

// ========================================
// Compare Modal
// ========================================

async function showCompareModal() {
  if (selectedForCompare.size < 2) return;

  // Get selected scan data
  const selectedScans = historyData.filter(item => selectedForCompare.has(item.id));

  // Load labels
  let labels = await loadComplianceLabels();

  // Render comparison
  renderCompareModalContent(selectedScans, labels);

  // Show modal
  compareModal.classList.remove('hidden');
  setTimeout(() => {
    compareModal.classList.add('visible');
  }, 10);
}

function closeCompareModal() {
  compareModal.classList.remove('visible');
  setTimeout(() => {
    compareModal.classList.add('hidden');
  }, 300);
}

async function loadComplianceLabels() {
  let labels = {};

  try {
    const result = await chrome.storage.local.get('trainingSettings');
    if (result.trainingSettings) {
      for (const [key, setting] of Object.entries(result.trainingSettings.builtinItems)) {
        labels[key] = setting.label;
      }
      for (const custom of result.trainingSettings.customItems) {
        labels[custom.id] = custom.label;
      }
    }
  } catch (e) {
    console.error('Failed to load labels', e);
  }

  // Default labels
  const defaultLabels = {
    privacyPolicy: 'Privacy Policy',
    cookieBanner: 'Cookie Banner',
    doNotSell: 'Do Not Sell (CCPA)',
    cookiePolicy: 'Cookie Policy',
    cookieSettings: 'Cookie Settings',
    termsOfService: 'Terms of Service',
    legal: 'Legal Notice',
    dispute: 'Dispute Resolution',
    dmca: 'DMCA / Copyright',
    reportAbuse: 'Report Abuse',
    dataRequest: 'Data Subject Request',
    contact: 'Contact Info',
    refundPolicy: 'Refund Policy',
    shippingPolicy: 'Shipping Policy',
    ageVerification: 'Age Verification',
    accessibility: 'Accessibility',
    sitemap: 'Sitemap',
    affiliateDisclosure: 'Affiliate Disclosure',
    adChoices: 'Ad Choices',
    modernSlavery: 'Modern Slavery',
    sustainability: 'Sustainability',
    securityPolicy: 'Security Policy',
    whoisRdap: 'WHOIS/RDAP',
    domainAbuse: 'Domain Abuse',
    udrp: 'UDRP',
    registrarInfo: 'Registrar Info',
    transferPolicy: 'Transfer Policy'
  };

  return { ...defaultLabels, ...labels };
}

function renderCompareModalContent(scans, labels) {
  // Oscar moods
  const oscarMoods = {
    poor: { face: '😰', label: 'Poor' },
    fair: { face: '🐕', label: 'Fair' },
    good: { face: '🐕‍🦺', label: 'Good' },
    excellent: { face: '🦮', label: 'Excellent' }
  };

  // Calculate stats
  const avgScore = Math.round(scans.reduce((sum, s) => sum + s.score, 0) / scans.length);
  const bestScan = scans.reduce((best, s) => s.score > best.score ? s : best, scans[0]);
  const worstScan = scans.reduce((worst, s) => s.score < worst.score ? s : worst, scans[0]);

  // Get all compliance keys from all scans
  const allKeys = new Set();
  scans.forEach(scan => {
    Object.keys(scan.compliance).forEach(key => allKeys.add(key));
  });

  // Build comparison table rows
  const tableRows = Array.from(allKeys).map(key => {
    const label = labels[key] || key;
    const cells = scans.map(scan => {
      const item = scan.compliance[key];
      const found = typeof item === 'boolean' ? item : (item && item.found);
      return `<td class="${found ? 'found' : 'not-found'}">${found ? '✓' : '✗'}</td>`;
    }).join('');

    // Count how many found this
    const foundCount = scans.filter(scan => {
      const item = scan.compliance[key];
      return typeof item === 'boolean' ? item : (item && item.found);
    }).length;

    const rowClass = foundCount === scans.length ? 'all-found' : foundCount === 0 ? 'none-found' : 'some-found';

    return `
      <tr class="${rowClass}">
        <td class="item-label">${label}</td>
        ${cells}
      </tr>
    `;
  }).join('');

  // Build header columns
  const headerCols = scans.map(scan => {
    const hostname = new URL(scan.url).hostname;
    const moodKey = scan.score >= 80 ? 'excellent' : scan.score >= 60 ? 'good' : scan.score >= 40 ? 'fair' : 'poor';
    const mood = oscarMoods[moodKey];

    return `
      <th class="compare-site-header">
        <div class="compare-site-oscar">${mood.face}</div>
        <div class="compare-site-name" title="${scan.url}">${hostname}</div>
        <div class="compare-site-score ${getScoreClass(scan.score)}">${scan.score}%</div>
      </th>
    `;
  }).join('');

  // Build site score bars
  const scoreBars = scans.map(scan => {
    const hostname = new URL(scan.url).hostname;
    const moodKey = scan.score >= 80 ? 'excellent' : scan.score >= 60 ? 'good' : scan.score >= 40 ? 'fair' : 'poor';
    const mood = oscarMoods[moodKey];

    return `
      <div class="compare-score-card">
        <div class="compare-score-header">
          <span class="compare-score-oscar">${mood.face}</span>
          <span class="compare-score-site">${hostname}</span>
        </div>
        <div class="compare-score-gauge">
          <div class="compare-score-fill ${getScoreClass(scan.score)}" style="width: ${scan.score}%"></div>
        </div>
        <div class="compare-score-value ${getScoreClass(scan.score)}">${scan.score}%</div>
      </div>
    `;
  }).join('');

  compareModalBody.innerHTML = `
    <div class="compare-overview">
      <div class="compare-overview-header">
        <div class="compare-overview-oscar">
          ${oscarMoods[avgScore >= 80 ? 'excellent' : avgScore >= 60 ? 'good' : avgScore >= 40 ? 'fair' : 'poor'].face}
        </div>
        <div class="compare-overview-info">
          <div class="compare-overview-title">Comparing ${scans.length} Scans</div>
          <div class="compare-overview-subtitle">Average score: <strong>${avgScore}%</strong></div>
        </div>
      </div>

      <div class="compare-score-cards">
        ${scoreBars}
      </div>

      <div class="compare-quick-stats">
        <div class="compare-quick-stat best">
          <span class="stat-emoji">🏆</span>
          <span class="stat-label">Best:</span>
          <span class="stat-value">${new URL(bestScan.url).hostname} (${bestScan.score}%)</span>
        </div>
        <div class="compare-quick-stat worst">
          <span class="stat-emoji">📉</span>
          <span class="stat-label">Lowest:</span>
          <span class="stat-value">${new URL(worstScan.url).hostname} (${worstScan.score}%)</span>
        </div>
      </div>
    </div>

    <div class="compare-table-container">
      <table class="compare-table">
        <thead>
          <tr>
            <th class="item-label-header">Compliance Item</th>
            ${headerCols}
          </tr>
        </thead>
        <tbody>
          ${tableRows}
        </tbody>
      </table>
    </div>

    <div class="compare-legend">
      <div class="legend-item"><span class="legend-dot all"></span> All sites have this</div>
      <div class="legend-item"><span class="legend-dot some"></span> Some sites have this</div>
      <div class="legend-item"><span class="legend-dot none"></span> No sites have this</div>
    </div>
  `;
}

// ========================================
// Export CSV
// ========================================

async function exportHistoryToCsv() {
  if (historyData.length === 0) return;

  const labels = await loadComplianceLabels();

  // Gather all compliance keys across all history items
  const allKeys = new Set();
  historyData.forEach(item => {
    Object.keys(item.compliance).forEach(key => allKeys.add(key));
  });
  const complianceKeys = Array.from(allKeys);

  // CSV escape helper
  function csvEscape(value) {
    const str = String(value ?? '');
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
      return '"' + str.replace(/"/g, '""') + '"';
    }
    return str;
  }

  // Build header row
  const header = ['URL', 'Hostname', 'Score', 'Score Label', 'Date',
    ...complianceKeys.map(key => labels[key] || key)
  ];

  // Build data rows
  const rows = historyData.map(item => {
    const hostname = new URL(item.url).hostname;
    const date = new Date(item.scannedAt).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric',
      hour: 'numeric', minute: '2-digit'
    });

    const complianceCols = complianceKeys.map(key => {
      const val = item.compliance[key];
      const found = typeof val === 'boolean' ? val : (val && val.found);
      return found ? 'Yes' : 'No';
    });

    return [item.url, hostname, item.score, getScoreLabel(item.score), date, ...complianceCols];
  });

  // Assemble CSV
  const csvContent = [header, ...rows]
    .map(row => row.map(csvEscape).join(','))
    .join('\n');

  // Download via Blob
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `oscar-history-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}
