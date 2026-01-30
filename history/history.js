// OSCAR History Page

let historyData = [];
let filteredData = [];
let selectedScanId = null;

// DOM Elements
const historyList = document.getElementById('history-list');
const emptyState = document.getElementById('empty-state');
const noResultsState = document.getElementById('no-results-state');
const searchInput = document.getElementById('search-input');
const scoreFilter = document.getElementById('score-filter');
const clearAllBtn = document.getElementById('clear-all-history');
const totalScansEl = document.getElementById('total-scans');
const avgScoreEl = document.getElementById('avg-score');
const uniqueSitesEl = document.getElementById('unique-sites');
const detailModal = document.getElementById('detail-modal');
const modalTitle = document.getElementById('modal-title');
const modalBody = document.getElementById('modal-body');
const deleteScanBtn = document.getElementById('delete-scan');

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

  // Modal close buttons
  document.querySelectorAll('.modal-close, .modal-close-btn').forEach(btn => {
    btn.addEventListener('click', closeModal);
  });

  // Backdrop click to close
  document.querySelector('.modal-backdrop').addEventListener('click', closeModal);

  // Escape key to close modal
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && detailModal.classList.contains('visible')) {
      closeModal();
    }
  });
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

  div.innerHTML = `
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

  div.addEventListener('click', () => openDetailModal(item));

  return div;
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

  if (confirm('Delete this scan from history?')) {
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
  if (confirm('Clear all scan history?\n\nThis action cannot be undone.')) {
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
