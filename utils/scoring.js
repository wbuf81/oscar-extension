import { COMPLIANCE_WEIGHTS } from './patterns.js';

/**
 * Calculate compliance score
 * @param {Object} compliance - Compliance data object
 * @returns {number} Compliance score (0-100)
 */
export function calculateComplianceScore(compliance) {
  let score = 0;
  let totalWeight = 0;

  for (const [key, weight] of Object.entries(COMPLIANCE_WEIGHTS)) {
    totalWeight += weight;
    const item = compliance[key];
    const hasItem = typeof item === 'boolean' ? item : (item && item.found);
    if (hasItem) score += weight;
  }

  return totalWeight > 0 ? Math.round((score / totalWeight) * 100) : 0;
}

/**
 * Get score label
 */
export function getScoreLabel(score) {
  if (score >= 80) return 'Excellent';
  if (score >= 60) return 'Good';
  if (score >= 40) return 'Fair';
  return 'Poor';
}

/**
 * Get score CSS class
 */
export function getScoreClass(score) {
  if (score >= 80) return 'score-excellent';
  if (score >= 60) return 'score-good';
  if (score >= 40) return 'score-fair';
  return 'score-poor';
}

/**
 * Get score color info
 */
export function getScoreColor(score) {
  if (score >= 80) return { bg: '#d4edda', text: '#155724', label: 'Excellent' };
  if (score >= 60) return { bg: '#fff3cd', text: '#856404', label: 'Good' };
  if (score >= 40) return { bg: '#ffe5d0', text: '#c45a00', label: 'Fair' };
  return { bg: '#f8d7da', text: '#721c24', label: 'Poor' };
}
