// Deep Scanner - Background service worker module for deep scanning documents
// Fetches and parses HTML/PDF documents to find compliance patterns

import { DEEP_SCAN_PATTERNS, DOCUMENT_LABELS, DEEP_SCAN_LIMITS } from '../utils/deep-scan-patterns.js';

// PDF.js setup - dynamically import when needed
let pdfLib = null;

async function loadPdfJs() {
  if (pdfLib) return pdfLib;

  try {
    // Import the module - PDF.js sets itself on globalThis.pdfjsLib
    await import('../lib/pdf.min.mjs');

    // Access the library from globalThis where PDF.js places it
    pdfLib = globalThis.pdfjsLib;

    if (!pdfLib) {
      throw new Error('PDF.js did not initialize properly');
    }

    // Configure worker - use fake worker mode for service worker compatibility
    // Service workers can't spawn web workers, so we disable the worker
    pdfLib.GlobalWorkerOptions.workerSrc = '';

    // Alternative: try to use the worker if possible
    // const workerUrl = chrome.runtime.getURL('lib/pdf.worker.min.mjs');
    // pdfLib.GlobalWorkerOptions.workerSrc = workerUrl;

    console.log('PDF.js loaded successfully');
    return pdfLib;
  } catch (error) {
    console.warn('Failed to load PDF.js:', error);
    return null;
  }
}

/**
 * Fetch document text from a URL (HTML or PDF)
 * @param {string} url - The URL to fetch
 * @returns {Promise<{text: string, type: string}>} - Extracted text and document type
 */
export async function fetchDocumentText(url) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), DEEP_SCAN_LIMITS.fetchTimeout);

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        'Accept': 'text/html,application/xhtml+xml,application/pdf,*/*'
      }
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const contentType = response.headers.get('content-type') || '';
    const isPdf = contentType.includes('application/pdf') || url.toLowerCase().endsWith('.pdf');

    if (isPdf) {
      // Handle PDF documents
      const arrayBuffer = await response.arrayBuffer();
      const text = await extractPdfText(arrayBuffer);
      return { text, type: 'pdf' };
    } else {
      // Handle HTML documents
      const html = await response.text();
      const text = extractHtmlText(html);
      return { text, type: 'html' };
    }
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      throw new Error('Request timed out');
    }
    throw error;
  }
}

/**
 * Extract text from HTML content
 * Service workers don't have DOMParser, so we use regex-based extraction
 * @param {string} html - Raw HTML string
 * @returns {string} - Extracted text content
 */
function extractHtmlText(html) {
  let text = html;

  // Remove script tags and their content
  text = text.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, ' ');

  // Remove style tags and their content
  text = text.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, ' ');

  // Remove noscript tags and their content
  text = text.replace(/<noscript\b[^<]*(?:(?!<\/noscript>)<[^<]*)*<\/noscript>/gi, ' ');

  // Remove HTML comments
  text = text.replace(/<!--[\s\S]*?-->/g, ' ');

  // Remove all HTML tags
  text = text.replace(/<[^>]+>/g, ' ');

  // Decode common HTML entities
  text = text.replace(/&nbsp;/gi, ' ');
  text = text.replace(/&amp;/gi, '&');
  text = text.replace(/&lt;/gi, '<');
  text = text.replace(/&gt;/gi, '>');
  text = text.replace(/&quot;/gi, '"');
  text = text.replace(/&#39;/gi, "'");
  text = text.replace(/&copy;/gi, '(c)');
  text = text.replace(/&reg;/gi, '(R)');
  text = text.replace(/&trade;/gi, '(TM)');
  text = text.replace(/&#\d+;/g, ' '); // Remove numeric entities

  // Clean up whitespace
  text = text.replace(/\s+/g, ' ').trim();

  // Apply text limit
  if (text.length > DEEP_SCAN_LIMITS.maxTextLength) {
    text = text.substring(0, DEEP_SCAN_LIMITS.maxTextLength);
  }

  return text;
}

/**
 * Extract text from PDF using PDF.js
 * @param {ArrayBuffer} arrayBuffer - PDF file as ArrayBuffer
 * @returns {Promise<string>} - Extracted text content
 */
async function extractPdfText(arrayBuffer) {
  // Load PDF.js dynamically
  const pdf = await loadPdfJs();
  if (!pdf) {
    console.warn('PDF.js not available, skipping PDF extraction');
    return '';
  }

  try {
    console.log('Attempting to parse PDF, size:', arrayBuffer.byteLength);

    // Configure for service worker environment (no web workers)
    const loadingTask = pdf.getDocument({
      data: arrayBuffer,
      useWorkerFetch: false,
      isEvalSupported: false,
      useSystemFonts: true
    });

    const pdfDoc = await loadingTask.promise;
    console.log('PDF loaded, pages:', pdfDoc.numPages);

    let fullText = '';
    const numPages = Math.min(pdfDoc.numPages, DEEP_SCAN_LIMITS.maxPdfPages);

    for (let i = 1; i <= numPages; i++) {
      const page = await pdfDoc.getPage(i);
      const content = await page.getTextContent();
      fullText += content.items.map(item => item.str).join(' ') + '\n';

      // Check text length limit
      if (fullText.length > DEEP_SCAN_LIMITS.maxTextLength) {
        fullText = fullText.substring(0, DEEP_SCAN_LIMITS.maxTextLength);
        break;
      }
    }

    console.log('PDF text extracted, length:', fullText.length);
    return fullText.replace(/\s+/g, ' ').trim();
  } catch (error) {
    console.error('PDF extraction error:', error.message || error);
    return '';
  }
}

/**
 * Search text for compliance patterns
 * @param {string} text - Document text to search
 * @param {string[]} missingItems - Array of compliance item keys to search for
 * @returns {Object} - Found items with matched patterns
 */
export function searchForPatterns(text, missingItems) {
  const textLower = text.toLowerCase();
  const results = {};

  for (const itemKey of missingItems) {
    const patternConfig = DEEP_SCAN_PATTERNS[itemKey];
    if (!patternConfig) continue;

    const matchedPatterns = [];
    let matchedText = null;

    for (const pattern of patternConfig.patterns) {
      const patternLower = pattern.toLowerCase();
      const index = textLower.indexOf(patternLower);

      if (index !== -1) {
        matchedPatterns.push(pattern);

        // Extract surrounding context for the first match
        if (!matchedText) {
          const start = Math.max(0, index - 50);
          const end = Math.min(text.length, index + pattern.length + 50);
          matchedText = '...' + text.substring(start, end).trim() + '...';
        }
      }
    }

    // Check if we have enough matches
    if (matchedPatterns.length >= (patternConfig.minMatches || 1)) {
      results[itemKey] = {
        found: true,
        matchedPatterns,
        matchedText,
        confidence: Math.min(matchedPatterns.length / patternConfig.patterns.length, 1)
      };
    }
  }

  return results;
}

/**
 * Perform deep scan on document links
 * @param {Object} initialResults - Initial scan results from content script
 * @returns {Promise<Object>} - Deep scan results
 */
export async function performDeepScan(initialResults) {
  const { compliance, documentLinks } = initialResults;

  // Determine which items are missing
  const missingItems = [];
  for (const [key, value] of Object.entries(compliance)) {
    const found = typeof value === 'boolean' ? value : (value && value.found);
    if (!found && DEEP_SCAN_PATTERNS[key]) {
      missingItems.push(key);
    }
  }

  // Also check for items that might be in deep scan patterns but not in initial compliance
  for (const key of Object.keys(DEEP_SCAN_PATTERNS)) {
    if (!compliance[key] && !missingItems.includes(key)) {
      missingItems.push(key);
    }
  }

  if (missingItems.length === 0) {
    return {
      performed: true,
      scannedDocuments: [],
      itemsFound: [],
      updatedCompliance: {}
    };
  }

  // Build list of documents to scan from whatever was passed
  // The popup UI handles selection, so we scan all provided documents (up to limit)
  const documentsToScan = [];

  // Priority order for documents (most likely to contain compliance info first)
  const docPriority = [
    'termsOfService', 'privacyPolicy', 'legal', 'cookiePolicy',
    'dmca', 'dispute', 'accessibility', 'refundPolicy',
    'securityPolicy', 'modernSlavery', 'sustainability',
    'whoisRdap', 'domainAbuse', 'udrp', 'registrarInfo', 'transferPolicy',
    'dataRequest', 'contact', 'shippingPolicy', 'ageVerification',
    'sitemap', 'affiliateDisclosure', 'adChoices', 'reportAbuse',
    'doNotSell', 'cookieSettings'
  ];

  // First add prioritized documents
  for (const docKey of docPriority) {
    if (documentLinks && documentLinks[docKey] && documentsToScan.length < DEEP_SCAN_LIMITS.maxDocuments) {
      documentsToScan.push({
        key: docKey,
        url: documentLinks[docKey],
        label: DOCUMENT_LABELS[docKey] || docKey
      });
    }
  }

  // Then add any remaining documents not in priority list
  for (const [docKey, url] of Object.entries(documentLinks || {})) {
    if (!docPriority.includes(docKey) && documentsToScan.length < DEEP_SCAN_LIMITS.maxDocuments) {
      documentsToScan.push({
        key: docKey,
        url: url,
        label: DOCUMENT_LABELS[docKey] || docKey
      });
    }
  }

  if (documentsToScan.length === 0) {
    return {
      performed: true,
      scannedDocuments: [],
      itemsFound: [],
      error: 'No document links found to scan'
    };
  }

  // Scan each document
  const updatedCompliance = {};
  const scannedDocuments = [];
  const itemsFound = [];
  const errors = [];

  for (const doc of documentsToScan) {
    try {
      console.log(`Deep scanning: ${doc.label} (${doc.url})`);
      const { text, type } = await fetchDocumentText(doc.url);

      if (text) {
        scannedDocuments.push(doc.key);

        // Search for missing items in this document
        const stillMissing = missingItems.filter(item => !updatedCompliance[item]);
        const foundInDoc = searchForPatterns(text, stillMissing);

        for (const [itemKey, result] of Object.entries(foundInDoc)) {
          updatedCompliance[itemKey] = {
            found: true,
            foundInDocument: doc.label,
            documentUrl: doc.url,
            documentType: type,
            matchedText: result.matchedText,
            matchedPatterns: result.matchedPatterns,
            confidence: result.confidence,
            deepScan: true
          };
          itemsFound.push(itemKey);
        }
      }
    } catch (error) {
      console.error(`Error scanning ${doc.label}:`, error.message);
      errors.push({ document: doc.label, error: error.message });
    }
  }

  return {
    performed: true,
    scannedDocuments,
    itemsFound,
    updatedCompliance,
    errors: errors.length > 0 ? errors : undefined
  };
}

/**
 * Merge deep scan results with initial scan results
 * @param {Object} initialResults - Original scan results
 * @param {Object} deepScanResults - Deep scan results
 * @returns {Object} - Merged results
 */
export function mergeDeepScanResults(initialResults, deepScanResults) {
  const merged = { ...initialResults };

  // Merge compliance items
  merged.compliance = { ...initialResults.compliance };
  for (const [key, value] of Object.entries(deepScanResults.updatedCompliance || {})) {
    // Only update if the item was not found in initial scan
    const existing = merged.compliance[key];
    const existingFound = typeof existing === 'boolean' ? existing : (existing && existing.found);

    if (!existingFound) {
      merged.compliance[key] = value;
    }
  }

  // Add deep scan metadata
  merged.deepScanResults = {
    performed: deepScanResults.performed,
    scannedDocuments: deepScanResults.scannedDocuments,
    itemsFound: deepScanResults.itemsFound,
    errors: deepScanResults.errors
  };

  return merged;
}
