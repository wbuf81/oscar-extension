// OSCAR Options Page - Training Settings

// Categories for organizing compliance items
const CATEGORIES = {
  privacy: {
    label: 'Privacy & Data Protection',
    icon: '🔒',
    description: 'Core privacy requirements under GDPR, CCPA, and other data protection laws'
  },
  cookies: {
    label: 'Cookie Compliance',
    icon: '🍪',
    description: 'Cookie consent and management requirements under ePrivacy Directive'
  },
  legal: {
    label: 'Legal Disclosures',
    icon: '⚖️',
    description: 'Terms of service, legal notices, and business identification requirements'
  },
  consumer: {
    label: 'Consumer Protection',
    icon: '🛒',
    description: 'E-commerce requirements for refunds, shipping, and consumer rights'
  },
  accessibility: {
    label: 'Accessibility & Inclusion',
    icon: '♿',
    description: 'Web accessibility requirements under ADA, EAA, and Section 508'
  },
  content: {
    label: 'Content & IP',
    icon: '©️',
    description: 'Copyright, DMCA, and user-generated content policies'
  },
  corporate: {
    label: 'Corporate Responsibility',
    icon: '🏢',
    description: 'Modern slavery, environmental, and corporate governance disclosures'
  },
  registry: {
    label: 'ICANN & Registry Compliance',
    icon: '🌐',
    description: 'Domain registration, WHOIS/RDAP, and ICANN contractual requirements'
  }
};

// Default (Puppy) settings - Oscar's original training
// Organized by category with enabled/disabled defaults
const DEFAULT_SETTINGS = {
  builtinItems: {
    // ===== PRIVACY & DATA PROTECTION =====
    privacyPolicy: {
      enabled: true,
      weight: 22,
      label: 'Privacy Policy',
      keywords: ['privacy policy', 'privacy notice', 'data protection'],
      category: 'privacy'
    },
    doNotSell: {
      enabled: true,
      weight: 15,
      label: 'Do Not Sell (CCPA)',
      keywords: ['do not sell', 'ccpa', 'opt out', 'do not share'],
      category: 'privacy'
    },
    dataRequest: {
      enabled: false,
      weight: 8,
      label: 'Data Subject Request',
      keywords: ['data subject request', 'dsar', 'access my data', 'request my data', 'download my data', 'data access request', 'right to access'],
      category: 'privacy'
    },

    // ===== COOKIE COMPLIANCE =====
    cookieBanner: {
      enabled: true,
      weight: 18,
      label: 'Cookie Banner',
      keywords: ['cookie consent', 'cookie banner'],
      category: 'cookies'
    },
    cookiePolicy: {
      enabled: true,
      weight: 13,
      label: 'Cookie Policy',
      keywords: ['cookie policy', 'cookie notice'],
      category: 'cookies'
    },
    cookieSettings: {
      enabled: true,
      weight: 10,
      label: 'Cookie Settings',
      keywords: ['cookie settings', 'cookie preferences', 'manage cookies'],
      category: 'cookies'
    },

    // ===== LEGAL DISCLOSURES =====
    termsOfService: {
      enabled: true,
      weight: 9,
      label: 'Terms of Service',
      keywords: ['terms of service', 'terms of use', 'terms and conditions'],
      category: 'legal'
    },
    legal: {
      enabled: true,
      weight: 8,
      label: 'Legal Notice / Impressum',
      keywords: ['legal', 'legal notice', 'imprint', 'impressum'],
      category: 'legal'
    },
    dispute: {
      enabled: false,
      weight: 3,
      label: 'Dispute Resolution',
      keywords: ['dispute resolution', 'arbitration', 'odr', 'online dispute'],
      category: 'legal'
    },
    contact: {
      enabled: false,
      weight: 5,
      label: 'Contact Information',
      keywords: ['contact us', 'contact information', 'get in touch', 'reach us'],
      category: 'legal'
    },

    // ===== CONSUMER PROTECTION =====
    refundPolicy: {
      enabled: false,
      weight: 7,
      label: 'Refund / Return Policy',
      keywords: ['refund policy', 'return policy', 'returns', 'refunds', 'money back', 'cancellation policy'],
      category: 'consumer'
    },
    shippingPolicy: {
      enabled: false,
      weight: 5,
      label: 'Shipping Policy',
      keywords: ['shipping policy', 'shipping information', 'delivery policy', 'delivery information'],
      category: 'consumer'
    },
    ageVerification: {
      enabled: false,
      weight: 6,
      label: 'Age Verification',
      keywords: ['age verification', 'age gate', 'must be 18', 'must be 21', 'verify your age', 'coppa', 'children\'s privacy'],
      category: 'consumer'
    },

    // ===== ACCESSIBILITY =====
    accessibility: {
      enabled: false,
      weight: 10,
      label: 'Accessibility Statement',
      keywords: ['accessibility', 'accessibility statement', 'wcag', 'ada compliance', 'a11y', 'screen reader'],
      category: 'accessibility'
    },
    sitemap: {
      enabled: false,
      weight: 2,
      label: 'Sitemap',
      keywords: ['sitemap', 'site map', 'site index'],
      category: 'accessibility'
    },

    // ===== CONTENT & IP =====
    dmca: {
      enabled: false,
      weight: 1,
      label: 'DMCA / Copyright',
      keywords: ['dmca', 'copyright', 'copyright policy', 'intellectual property'],
      category: 'content'
    },
    reportAbuse: {
      enabled: false,
      weight: 1,
      label: 'Report Abuse',
      keywords: ['report abuse', 'report violation', 'report content'],
      category: 'content'
    },
    affiliateDisclosure: {
      enabled: false,
      weight: 3,
      label: 'Affiliate Disclosure',
      keywords: ['affiliate disclosure', 'affiliate links', 'ftc disclosure', 'sponsored', 'material connection'],
      category: 'content'
    },
    adChoices: {
      enabled: false,
      weight: 2,
      label: 'Ad Choices / Interest-Based Ads',
      keywords: ['ad choices', 'adchoices', 'interest-based ads', 'personalized ads', 'targeted advertising'],
      category: 'content'
    },

    // ===== CORPORATE RESPONSIBILITY =====
    modernSlavery: {
      enabled: false,
      weight: 4,
      label: 'Modern Slavery Statement',
      keywords: ['modern slavery', 'slavery statement', 'human trafficking', 'supply chain transparency'],
      category: 'corporate'
    },
    sustainability: {
      enabled: false,
      weight: 3,
      label: 'Environmental / Sustainability',
      keywords: ['sustainability', 'environmental policy', 'carbon footprint', 'climate', 'esg', 'green policy'],
      category: 'corporate'
    },
    securityPolicy: {
      enabled: false,
      weight: 4,
      label: 'Security / Vulnerability Disclosure',
      keywords: ['security policy', 'vulnerability disclosure', 'responsible disclosure', 'bug bounty', 'security.txt'],
      category: 'corporate'
    },

    // ===== ICANN & REGISTRY COMPLIANCE =====
    whoisRdap: {
      enabled: false,
      weight: 5,
      label: 'WHOIS / RDAP Lookup',
      keywords: ['whois', 'rdap', 'domain lookup', 'registration data', 'domain registration', 'registrant'],
      category: 'registry'
    },
    domainAbuse: {
      enabled: false,
      weight: 4,
      label: 'Domain Abuse Contact',
      keywords: ['domain abuse', 'abuse contact', 'report domain abuse', 'dns abuse', 'abuse@'],
      category: 'registry'
    },
    udrp: {
      enabled: false,
      weight: 3,
      label: 'UDRP / Domain Disputes',
      keywords: ['udrp', 'domain dispute', 'domain name dispute', 'cybersquatting', 'domain arbitration', 'wipo'],
      category: 'registry'
    },
    registrarInfo: {
      enabled: false,
      weight: 3,
      label: 'Registrar Information',
      keywords: ['registrar', 'domain registrar', 'accredited registrar', 'icann accredited', 'registration agreement'],
      category: 'registry'
    },
    transferPolicy: {
      enabled: false,
      weight: 2,
      label: 'Domain Transfer Policy',
      keywords: ['domain transfer', 'transfer policy', 'auth code', 'epp code', 'transfer lock'],
      category: 'registry'
    }
  },
  customItems: [],
  // Track which categories are collapsed (all expanded by default)
  collapsedCategories: []
};

let trainingSettings = null;
let saveTimeout = null;

// DOM Elements
const builtinItemsContainer = document.getElementById('builtin-items');
const customItemsContainer = document.getElementById('custom-items');
const showAddFormBtn = document.getElementById('show-add-form');
const customItemForm = document.getElementById('custom-item-form');
const customItemName = document.getElementById('custom-item-name');
const customItemKeywords = document.getElementById('custom-item-keywords');
const customItemWeight = document.getElementById('custom-item-weight');
const saveCustomItemBtn = document.getElementById('save-custom-item');
const cancelCustomItemBtn = document.getElementById('cancel-custom-item');
const resetTrainingBtn = document.getElementById('reset-training');
const saveIndicator = document.getElementById('save-indicator');

// Initialize
document.addEventListener('DOMContentLoaded', init);

async function init() {
  await loadTrainingSettings();
  migrateSettings(); // Add any new items from defaults
  renderTrainingItems();
  setupEventListeners();
  updateScorePreview(); // Initialize the Sniff-O-Meter
}

// ========================================
// Score Preview (Sniff-O-Meter)
// ========================================

const oscarMoods = {
  low: { face: '😴', messages: ['Barely sniffing...', 'Need more training!', 'Very minimal checks'] },
  medium: { face: '🐕', messages: ['Sniffing around!', 'Getting there!', 'Decent coverage'] },
  high: { face: '🐕‍🦺', messages: ['Good boy mode!', 'Thorough sniffing!', 'Well trained!'] },
  max: { face: '🦮', messages: ['Super sniffer!', 'Maximum vigilance!', 'Elite compliance dog!'] }
};

function updateScorePreview() {
  // Calculate totals
  let totalEnabled = 0;
  let totalWeight = 0;
  let maxWeight = 0;
  let enabledCount = 0;
  const categoryStats = {};

  // Initialize category stats
  for (const categoryKey of Object.keys(CATEGORIES)) {
    categoryStats[categoryKey] = { enabled: 0, total: 0, weight: 0, maxWeight: 0 };
  }

  // Calculate builtin items
  for (const [key, item] of Object.entries(trainingSettings.builtinItems)) {
    const category = item.category || 'legal';
    if (categoryStats[category]) {
      categoryStats[category].total++;
      categoryStats[category].maxWeight += item.weight;
      maxWeight += item.weight;

      if (item.enabled) {
        categoryStats[category].enabled++;
        categoryStats[category].weight += item.weight;
        totalWeight += item.weight;
        enabledCount++;
      }
    }
  }

  // Calculate custom items
  if (trainingSettings.customItems.length > 0) {
    categoryStats['custom'] = { enabled: 0, total: 0, weight: 0, maxWeight: 0 };
    for (const item of trainingSettings.customItems) {
      categoryStats['custom'].total++;
      categoryStats['custom'].maxWeight += item.weight;
      maxWeight += item.weight;
      if (item.enabled) {
        categoryStats['custom'].enabled++;
        categoryStats['custom'].weight += item.weight;
        totalWeight += item.weight;
        enabledCount++;
      }
    }
  }

  // Update DOM elements
  const totalWeightEl = document.getElementById('total-weight');
  const maxWeightEl = document.getElementById('max-weight');
  const totalBarEl = document.getElementById('total-bar');
  const percentageEl = document.getElementById('score-percentage');
  const enabledCountEl = document.getElementById('enabled-count');
  const oscarFaceEl = document.getElementById('oscar-face');
  const oscarSpeechEl = document.getElementById('oscar-speech');
  const topCategoryEl = document.getElementById('top-category');
  const scoreTipEl = document.getElementById('score-tip');
  const breakdownEl = document.getElementById('category-breakdown');

  if (!totalWeightEl) return; // Elements not ready

  // Animate the total weight number
  animateNumber(totalWeightEl, totalWeight);
  maxWeightEl.textContent = maxWeight;

  const percentage = maxWeight > 0 ? Math.round((totalWeight / maxWeight) * 100) : 0;
  totalBarEl.style.width = percentage + '%';
  percentageEl.textContent = percentage + '%';
  enabledCountEl.textContent = enabledCount;

  // Update Oscar's mood
  let mood;
  if (percentage < 25) mood = oscarMoods.low;
  else if (percentage < 50) mood = oscarMoods.medium;
  else if (percentage < 80) mood = oscarMoods.high;
  else mood = oscarMoods.max;

  oscarFaceEl.textContent = mood.face;
  oscarSpeechEl.textContent = mood.messages[Math.floor(Math.random() * mood.messages.length)];

  // Trigger sniffing animation
  oscarFaceEl.classList.add('sniffing');
  setTimeout(() => oscarFaceEl.classList.remove('sniffing'), 500);

  // Find top category
  let topCategory = null;
  let topWeight = 0;
  for (const [key, stats] of Object.entries(categoryStats)) {
    if (stats.weight > topWeight) {
      topWeight = stats.weight;
      topCategory = key;
    }
  }

  if (topCategory) {
    if (topCategory === 'custom') {
      topCategoryEl.textContent = `Top focus: ✨ Your Custom Checks`;
    } else if (CATEGORIES[topCategory]) {
      topCategoryEl.textContent = `Top focus: ${CATEGORIES[topCategory].icon} ${CATEGORIES[topCategory].label}`;
    }
  } else {
    topCategoryEl.textContent = 'No categories enabled';
  }

  // Generate tips
  const tips = generateScoreTips(categoryStats, enabledCount, percentage);
  scoreTipEl.textContent = tips[Math.floor(Math.random() * tips.length)];

  // Render category breakdown
  renderCategoryBreakdown(breakdownEl, categoryStats, maxWeight);
}

function animateNumber(element, target) {
  const current = parseInt(element.textContent) || 0;
  const diff = target - current;
  const steps = 20;
  const stepValue = diff / steps;
  let step = 0;

  const animate = () => {
    step++;
    if (step <= steps) {
      element.textContent = Math.round(current + stepValue * step);
      requestAnimationFrame(animate);
    } else {
      element.textContent = target;
    }
  };

  if (diff !== 0) {
    requestAnimationFrame(animate);
  }
}

function generateScoreTips(categoryStats, enabledCount, percentage) {
  const tips = [];

  if (percentage === 0) {
    tips.push('Enable some checks to start scanning!');
  } else if (percentage < 30) {
    tips.push('Enable more checks for better coverage');
    tips.push('Consider enabling Privacy & Cookies');
  } else if (percentage < 60) {
    tips.push('Good start! Add more for thorough scans');
    tips.push('Try enabling Legal Disclosures');
  } else if (percentage < 90) {
    tips.push('Great coverage! Fine-tune with weights');
    tips.push('Adjust weights to prioritize what matters');
  } else {
    tips.push('Maximum sniff power activated!');
    tips.push('Oscar is fully trained!');
  }

  // Category-specific tips
  if (categoryStats.privacy?.enabled === 0) {
    tips.push('Privacy checks are essential for GDPR/CCPA');
  }
  if (categoryStats.cookies?.enabled === 0) {
    tips.push('Cookie compliance is required in the EU');
  }
  if (enabledCount > 15) {
    tips.push('Pro tip: Higher weights = more impact on score');
  }

  // Custom items tips
  if (categoryStats.custom?.total > 0) {
    if (categoryStats.custom.enabled === categoryStats.custom.total) {
      tips.push('All custom checks active! Nice work!');
    } else if (categoryStats.custom.enabled > 0) {
      tips.push(`${categoryStats.custom.enabled}/${categoryStats.custom.total} custom checks enabled`);
    }
    if (categoryStats.custom.weight > 20) {
      tips.push('Custom checks are boosting your coverage!');
    }
  } else {
    tips.push('Add custom searches for industry-specific needs');
  }

  return tips;
}

function renderCategoryBreakdown(container, categoryStats, maxWeight) {
  container.innerHTML = '';

  // Render built-in categories
  for (const [key, info] of Object.entries(CATEGORIES)) {
    const stats = categoryStats[key];
    if (!stats || stats.total === 0) continue;

    const itemEl = createCategoryBarItem(key, info.icon, info.label.split(' ')[0], stats, maxWeight);

    // Add click handler to scroll to category
    itemEl.addEventListener('click', () => {
      const categorySection = document.querySelector(`.training-category[data-category="${key}"]`);
      if (categorySection) {
        categorySection.scrollIntoView({ behavior: 'smooth', block: 'center' });
        // Expand if collapsed
        if (categorySection.classList.contains('collapsed')) {
          toggleCategory(key, categorySection);
        }
        // Highlight briefly
        categorySection.style.boxShadow = '0 0 0 3px var(--secondary)';
        setTimeout(() => categorySection.style.boxShadow = '', 1000);
      }
    });

    container.appendChild(itemEl);
  }

  // Render custom category if it exists
  if (categoryStats['custom'] && categoryStats['custom'].total > 0) {
    const customStats = categoryStats['custom'];
    const itemEl = createCategoryBarItem('custom', '✨', 'Custom', customStats, maxWeight);

    // Add click handler to scroll to custom section
    itemEl.addEventListener('click', () => {
      const customSection = document.getElementById('custom-items');
      if (customSection) {
        customSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
        // Highlight briefly
        customSection.style.boxShadow = '0 0 0 3px var(--secondary)';
        setTimeout(() => customSection.style.boxShadow = '', 1000);
      }
    });

    container.appendChild(itemEl);
  }
}

function createCategoryBarItem(key, icon, label, stats, maxWeight) {
  const widthPercent = maxWeight > 0 ? Math.round((stats.weight / maxWeight) * 100) : 0;
  const isActive = stats.enabled > 0;

  const itemEl = document.createElement('div');
  itemEl.className = `category-bar-item ${isActive ? '' : 'inactive'}`;
  itemEl.dataset.category = key;

  itemEl.innerHTML = `
    <div class="category-bar-header">
      <span class="category-bar-icon">${icon}</span>
      <span class="category-bar-name">${label}</span>
      <span class="category-bar-weight">${stats.weight}</span>
    </div>
    <div class="category-mini-bar">
      <div class="category-mini-fill" style="width: ${widthPercent}%"></div>
    </div>
  `;

  return itemEl;
}

// ========================================
// Settings Management
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

// Migrate settings to add any new items that weren't in the user's saved settings
function migrateSettings() {
  let needsSave = false;

  // Add any new builtin items from defaults
  for (const [key, defaultItem] of Object.entries(DEFAULT_SETTINGS.builtinItems)) {
    if (!trainingSettings.builtinItems[key]) {
      trainingSettings.builtinItems[key] = { ...defaultItem };
      needsSave = true;
    } else {
      // Ensure category is set for existing items
      if (!trainingSettings.builtinItems[key].category) {
        trainingSettings.builtinItems[key].category = defaultItem.category;
        needsSave = true;
      }
    }
  }

  // Initialize collapsedCategories if not present
  if (!trainingSettings.collapsedCategories) {
    trainingSettings.collapsedCategories = [];
    needsSave = true;
  }

  if (needsSave) {
    saveTrainingSettings();
  }
}

async function saveTrainingSettings() {
  try {
    await chrome.storage.local.set({ trainingSettings });
    // Notify background script of settings change
    chrome.runtime.sendMessage({ action: 'settingsUpdated', settings: trainingSettings });
    showSaveIndicator();
    // Update the Sniff-O-Meter
    updateScorePreview();
  } catch (error) {
    console.error('Failed to save training settings:', error);
  }
}

function showSaveIndicator() {
  saveIndicator.classList.add('visible');

  // Clear any existing timeout
  if (saveTimeout) {
    clearTimeout(saveTimeout);
  }

  // Hide after 2 seconds
  saveTimeout = setTimeout(() => {
    saveIndicator.classList.remove('visible');
  }, 2000);
}

// ========================================
// Event Listeners
// ========================================

function setupEventListeners() {
  showAddFormBtn.addEventListener('click', showCustomItemForm);
  saveCustomItemBtn.addEventListener('click', saveCustomItem);
  cancelCustomItemBtn.addEventListener('click', hideCustomItemForm);
  resetTrainingBtn.addEventListener('click', resetToDefaults);
}

// ========================================
// Rendering
// ========================================

function renderTrainingItems() {
  builtinItemsContainer.innerHTML = '';

  // Group items by category
  const itemsByCategory = {};
  for (const [key, item] of Object.entries(trainingSettings.builtinItems)) {
    const category = item.category || 'legal'; // Default to legal for uncategorized
    if (!itemsByCategory[category]) {
      itemsByCategory[category] = [];
    }
    itemsByCategory[category].push({ key, ...item });
  }

  // Render each category
  for (const [categoryKey, categoryInfo] of Object.entries(CATEGORIES)) {
    const items = itemsByCategory[categoryKey] || [];
    if (items.length === 0) continue;

    const isCollapsed = trainingSettings.collapsedCategories?.includes(categoryKey);
    const enabledCount = items.filter(i => i.enabled).length;

    const categoryEl = document.createElement('div');
    categoryEl.className = `training-category ${isCollapsed ? 'collapsed' : ''}`;
    categoryEl.dataset.category = categoryKey;

    categoryEl.innerHTML = `
      <div class="category-header">
        <div class="category-toggle">
          <span class="category-chevron">▼</span>
        </div>
        <div class="category-info">
          <span class="category-icon">${categoryInfo.icon}</span>
          <span class="category-label">${categoryInfo.label}</span>
          <span class="category-count">${enabledCount}/${items.length} enabled</span>
        </div>
        <div class="category-actions">
          <button class="category-enable-all btn-mini" title="Enable all in category">All On</button>
          <button class="category-disable-all btn-mini" title="Disable all in category">All Off</button>
        </div>
      </div>
      <div class="category-description">${categoryInfo.description}</div>
      <div class="category-items"></div>
    `;

    // Add event listeners for category header
    const header = categoryEl.querySelector('.category-header');
    const toggle = categoryEl.querySelector('.category-toggle');
    const enableAllBtn = categoryEl.querySelector('.category-enable-all');
    const disableAllBtn = categoryEl.querySelector('.category-disable-all');

    toggle.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleCategory(categoryKey, categoryEl);
    });

    header.addEventListener('click', (e) => {
      if (e.target === header || e.target.closest('.category-info')) {
        toggleCategory(categoryKey, categoryEl);
      }
    });

    enableAllBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      setCategoryItemsEnabled(categoryKey, true);
    });

    disableAllBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      setCategoryItemsEnabled(categoryKey, false);
    });

    // Render items in this category
    const itemsContainer = categoryEl.querySelector('.category-items');
    for (const item of items) {
      const itemEl = createTrainingItemElement(item.key, item, false);
      itemsContainer.appendChild(itemEl);
    }

    builtinItemsContainer.appendChild(categoryEl);
  }

  // Render custom items
  customItemsContainer.innerHTML = '';
  if (trainingSettings.customItems.length === 0) {
    customItemsContainer.innerHTML = '<p class="empty-custom">No custom searches yet. Add one above!</p>';
  } else {
    for (const item of trainingSettings.customItems) {
      const itemEl = createTrainingItemElement(item.id, item, true);
      customItemsContainer.appendChild(itemEl);
    }
  }
}

function toggleCategory(categoryKey, categoryEl) {
  const isCollapsed = categoryEl.classList.toggle('collapsed');

  if (isCollapsed) {
    if (!trainingSettings.collapsedCategories.includes(categoryKey)) {
      trainingSettings.collapsedCategories.push(categoryKey);
    }
  } else {
    trainingSettings.collapsedCategories = trainingSettings.collapsedCategories.filter(c => c !== categoryKey);
  }

  saveTrainingSettings();
}

function setCategoryItemsEnabled(categoryKey, enabled) {
  for (const [key, item] of Object.entries(trainingSettings.builtinItems)) {
    if (item.category === categoryKey) {
      item.enabled = enabled;
    }
  }
  saveTrainingSettings();
  renderTrainingItems();
}

function createTrainingItemElement(key, item, isCustom) {
  const div = document.createElement('div');
  div.className = `training-item ${item.enabled ? '' : 'disabled'}`;
  div.dataset.key = key;

  const keywordsText = Array.isArray(item.keywords)
    ? item.keywords.join(', ')
    : item.keywords;

  div.innerHTML = `
    <div class="training-item-toggle">
      <input type="checkbox" ${item.enabled ? 'checked' : ''} title="Enable/disable this search">
    </div>
    <div class="training-item-info">
      <div class="training-item-name">${item.label}</div>
      <div class="training-item-keywords">${keywordsText}</div>
    </div>
    <div class="training-item-weight">
      <input type="number" class="weight-input" value="${item.weight}" min="0" max="100" title="Importance weight">
      <span class="weight-label">weight</span>
    </div>
    ${isCustom ? '<button class="training-item-delete" title="Delete">×</button>' : ''}
  `;

  // Event listeners
  const checkbox = div.querySelector('input[type="checkbox"]');
  checkbox.addEventListener('change', () => {
    if (isCustom) {
      const customItem = trainingSettings.customItems.find(i => i.id === key);
      if (customItem) {
        customItem.enabled = checkbox.checked;
      }
    } else {
      trainingSettings.builtinItems[key].enabled = checkbox.checked;
    }
    div.classList.toggle('disabled', !checkbox.checked);
    saveTrainingSettings();
    // Update category count
    updateCategoryCount(item.category);
  });

  const weightInput = div.querySelector('.weight-input');
  weightInput.addEventListener('change', () => {
    const weight = parseInt(weightInput.value) || 0;
    if (isCustom) {
      const customItem = trainingSettings.customItems.find(i => i.id === key);
      if (customItem) {
        customItem.weight = weight;
      }
    } else {
      trainingSettings.builtinItems[key].weight = weight;
    }
    saveTrainingSettings();
  });

  if (isCustom) {
    const deleteBtn = div.querySelector('.training-item-delete');
    deleteBtn.addEventListener('click', () => {
      if (confirm(`Delete "${item.label}" custom search?`)) {
        trainingSettings.customItems = trainingSettings.customItems.filter(i => i.id !== key);
        saveTrainingSettings();
        renderTrainingItems();
      }
    });
  }

  return div;
}

function updateCategoryCount(categoryKey) {
  const categoryEl = builtinItemsContainer.querySelector(`[data-category="${categoryKey}"]`);
  if (!categoryEl) return;

  const items = Object.values(trainingSettings.builtinItems).filter(i => i.category === categoryKey);
  const enabledCount = items.filter(i => i.enabled).length;

  const countEl = categoryEl.querySelector('.category-count');
  if (countEl) {
    countEl.textContent = `${enabledCount}/${items.length} enabled`;
  }
}

// ========================================
// Custom Items
// ========================================

function showCustomItemForm() {
  customItemForm.classList.remove('hidden');
  showAddFormBtn.style.display = 'none';
  customItemName.focus();
}

function hideCustomItemForm() {
  customItemForm.classList.add('hidden');
  showAddFormBtn.style.display = '';
  customItemName.value = '';
  customItemKeywords.value = '';
  customItemWeight.value = '5';
}

function saveCustomItem() {
  const name = customItemName.value.trim();
  const keywords = customItemKeywords.value.trim();
  const weight = parseInt(customItemWeight.value) || 5;

  if (!name) {
    customItemName.focus();
    return;
  }

  if (!keywords) {
    customItemKeywords.focus();
    return;
  }

  const keywordsArray = keywords.split(',').map(k => k.trim().toLowerCase()).filter(k => k);

  const newItem = {
    id: 'custom_' + Date.now(),
    label: name,
    keywords: keywordsArray,
    weight: weight,
    enabled: true
  };

  trainingSettings.customItems.push(newItem);
  saveTrainingSettings();
  hideCustomItemForm();
  renderTrainingItems();
}

// ========================================
// Reset
// ========================================

async function resetToDefaults() {
  if (confirm('Reset Oscar to puppy settings?\n\nThis will remove all custom searches and restore default weights.')) {
    trainingSettings = JSON.parse(JSON.stringify(DEFAULT_SETTINGS));
    await saveTrainingSettings();
    renderTrainingItems();
  }
}
