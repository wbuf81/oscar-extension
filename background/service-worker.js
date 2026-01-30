// Background service worker for OSCAR (Obligation Scanning & Compliance Analysis Reporter)

// Default compliance weights (puppy settings)
const DEFAULT_WEIGHTS = {
  privacyPolicy: 22,
  cookieBanner: 18,
  doNotSell: 15,
  cookiePolicy: 13,
  cookieSettings: 10,
  termsOfService: 9,
  legal: 8,
  dispute: 3,
  dmca: 1,
  reportAbuse: 1
};

// Get current training settings
async function getTrainingSettings() {
  try {
    const result = await chrome.storage.local.get('trainingSettings');
    return result.trainingSettings || null;
  } catch (error) {
    console.error('Failed to get training settings:', error);
    return null;
  }
}

// Calculate compliance score using training settings
async function calculateComplianceScore(compliance) {
  const settings = await getTrainingSettings();

  let score = 0;
  let totalWeight = 0;

  if (settings) {
    // Use custom training settings
    for (const [key, item] of Object.entries(settings.builtinItems)) {
      if (item.enabled) {
        totalWeight += item.weight;
        const complianceItem = compliance[key];
        const hasItem = typeof complianceItem === 'boolean' ? complianceItem : (complianceItem && complianceItem.found);
        if (hasItem) score += item.weight;
      }
    }

    // Include custom items
    for (const item of settings.customItems) {
      if (item.enabled) {
        totalWeight += item.weight;
        const complianceItem = compliance[item.id];
        const hasItem = typeof complianceItem === 'boolean' ? complianceItem : (complianceItem && complianceItem.found);
        if (hasItem) score += item.weight;
      }
    }
  } else {
    // Use default weights
    for (const [key, weight] of Object.entries(DEFAULT_WEIGHTS)) {
      totalWeight += weight;
      const item = compliance[key];
      const hasItem = typeof item === 'boolean' ? item : (item && item.found);
      if (hasItem) score += weight;
    }
  }

  return totalWeight > 0 ? Math.round((score / totalWeight) * 100) : 0;
}

// Inject content script and scan a tab
async function scanTab(tabId) {
  try {
    // First, try to inject the content script if not already present
    try {
      await chrome.scripting.executeScript({
        target: { tabId },
        files: ['content/scanner.js']
      });
    } catch (e) {
      // Script might already be injected, continue
    }

    // Get training settings to pass to content script
    const settings = await getTrainingSettings();

    // Send message to content script to scan
    const response = await chrome.tabs.sendMessage(tabId, {
      action: 'scan',
      settings: settings
    });

    if (response.success) {
      const scanResult = response.data;
      scanResult.score = await calculateComplianceScore(scanResult.compliance);

      // Save to history
      await saveScanToHistory(scanResult);

      return { success: true, data: scanResult };
    } else {
      return { success: false, error: response.error };
    }
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// Scan multiple tabs
async function scanMultipleTabs(tabIds) {
  const results = [];

  for (const tabId of tabIds) {
    const result = await scanTab(tabId);
    results.push({
      tabId,
      ...result
    });
  }

  return results;
}

// Save scan result to history
async function saveScanToHistory(scanResult) {
  try {
    const { history = [] } = await chrome.storage.local.get('history');

    // Add new result to beginning
    history.unshift({
      id: Date.now().toString(),
      ...scanResult
    });

    // Keep only last 50 scans
    const trimmedHistory = history.slice(0, 50);

    await chrome.storage.local.set({ history: trimmedHistory });
  } catch (error) {
    console.error('Failed to save to history:', error);
  }
}

// Get scan history
async function getHistory() {
  const { history = [] } = await chrome.storage.local.get('history');
  return history;
}

// Clear history
async function clearHistory() {
  await chrome.storage.local.set({ history: [] });
}

// Delete a specific history item
async function deleteHistoryItem(id) {
  const { history = [] } = await chrome.storage.local.get('history');
  const filtered = history.filter(item => item.id !== id);
  await chrome.storage.local.set({ history: filtered });
}

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  (async () => {
    try {
      switch (request.action) {
        case 'scanTab': {
          const result = await scanTab(request.tabId);
          sendResponse(result);
          break;
        }
        case 'scanMultipleTabs': {
          const results = await scanMultipleTabs(request.tabIds);
          sendResponse({ success: true, data: results });
          break;
        }
        case 'getHistory': {
          const history = await getHistory();
          sendResponse({ success: true, data: history });
          break;
        }
        case 'clearHistory': {
          await clearHistory();
          sendResponse({ success: true });
          break;
        }
        case 'deleteHistoryItem': {
          await deleteHistoryItem(request.id);
          sendResponse({ success: true });
          break;
        }
        case 'settingsUpdated': {
          // Settings were updated, acknowledge
          sendResponse({ success: true });
          break;
        }
        case 'updateBadge': {
          if (request.score !== undefined) {
            const score = request.score;
            let color = '#8B3A3A'; // error red (theme)
            if (score >= 80) color = '#5D7A5D'; // success green (theme)
            else if (score >= 60) color = '#B8860B'; // warning gold (theme)
            else if (score >= 40) color = '#C4956A'; // tan (theme)

            chrome.action.setBadgeBackgroundColor({ color });
            chrome.action.setBadgeText({ text: score.toString() });
          }
          sendResponse({ success: true });
          break;
        }
        default:
          sendResponse({ success: false, error: 'Unknown action' });
      }
    } catch (error) {
      sendResponse({ success: false, error: error.message });
    }
  })();

  return true; // Keep message channel open for async response
});
