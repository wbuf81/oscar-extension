// Content script - runs in the context of web pages
// This script scans the page DOM for compliance elements

(function() {
  'use strict';

  // Multi-language patterns for detecting compliance links
  const PATTERNS = {
    privacyPolicy: {
      en: ['privacy policy', 'privacy notice', 'privacy statement', 'data protection', 'privacy center', 'privacy centre', 'your privacy', 'your privacy rights', 'data privacy policy', 'privacy information'],
      es: ['política de privacidad', 'aviso de privacidad', 'protección de datos', 'central de privacidad', 'centro de privacidad', 'privacidad', 'derechos de privacidad', 'datos personales', 'política de datos'],
      fr: ['politique de confidentialité', 'politique de vie privée', 'protection des données', 'confidentialité', 'centre de confidentialité', 'vie privée', 'données personnelles'],
      de: ['datenschutzerklärung', 'datenschutz', 'datenschutzrichtlinie', 'datenschutzzentrum', 'datenschutzhinweis', 'datenschutzinformation', 'privatsphäre'],
      nl: ['privacyverklaring', 'privacybeleid', 'gegevensbescherming', 'privacycentrum', 'privacy', 'uw privacy'],
      pt: ['política de privacidade', 'aviso de privacidade', 'proteção de dados', 'central de privacidade', 'centro de privacidade', 'privacidade', 'dados pessoais']
    },
    cookiePolicy: {
      en: ['cookie policy', 'cookie notice', 'cookie statement', 'about cookies'],
      es: ['política de cookies', 'aviso de cookies', 'uso de cookies'],
      fr: ['politique de cookies', 'politique des cookies', 'utilisation des cookies'],
      de: ['cookie-richtlinie', 'cookie-erklärung', 'cookies'],
      nl: ['cookiebeleid', 'cookieverklaring', 'gebruik van cookies'],
      pt: ['política de cookies', 'aviso de cookies', 'uso de cookies']
    },
    cookieSettings: {
      en: ['cookie settings', 'cookie preferences', 'manage cookies', 'cookie choices', 'cookie options', 'privacy settings', 'manage your privacy'],
      es: ['configuración de cookies', 'preferencias de cookies', 'gestionar cookies', 'ajustes de cookies', 'opciones de cookies', 'configurar cookies', 'configuración de privacidad'],
      fr: ['paramètres des cookies', 'préférences cookies', 'gérer les cookies', 'paramètres de confidentialité', 'options de cookies'],
      de: ['cookie-einstellungen', 'cookie-präferenzen', 'cookies verwalten', 'datenschutzeinstellungen', 'cookies anpassen'],
      nl: ['cookie-instellingen', 'cookievoorkeuren', 'cookies beheren', 'privacy-instellingen', 'cookies aanpassen'],
      pt: ['configurações de cookies', 'preferências de cookies', 'gerenciar cookies', 'configurar cookies', 'opções de cookies', 'configurações de privacidade']
    },
    termsOfService: {
      en: ['terms of service', 'terms of use', 'terms and conditions', 'user agreement', 'service agreement'],
      es: ['términos de servicio', 'términos de uso', 'términos y condiciones', 'condiciones de uso', 'condiciones del servicio', 'condiciones generales'],
      fr: ['conditions d\'utilisation', 'conditions générales', 'conditions de service', 'conditions générales d\'utilisation'],
      de: ['nutzungsbedingungen', 'allgemeine geschäftsbedingungen', 'agb', 'geschäftsbedingungen'],
      nl: ['gebruiksvoorwaarden', 'algemene voorwaarden', 'servicevoorwaarden'],
      pt: ['termos de serviço', 'termos de uso', 'termos e condições', 'condições de uso', 'condições gerais']
    },
    legal: {
      en: ['legal', 'legal notice', 'legal information', 'imprint'],
      es: ['legal', 'aviso legal', 'información legal', 'nota legal', 'marco legal'],
      fr: ['mentions légales', 'informations légales', 'avis juridique', 'notice légale'],
      de: ['impressum', 'rechtliche hinweise', 'rechtliches'],
      nl: ['juridisch', 'wettelijke kennisgeving', 'juridische informatie'],
      pt: ['legal', 'aviso legal', 'informações legais', 'nota legal']
    },
    dispute: {
      en: ['dispute resolution', 'arbitration', 'complaints', 'dispute'],
      es: ['resolución de disputas', 'arbitraje', 'reclamaciones'],
      fr: ['règlement des litiges', 'arbitrage', 'réclamations'],
      de: ['streitbeilegung', 'schlichtung', 'beschwerden'],
      nl: ['geschillenbeslechting', 'arbitrage', 'klachten'],
      pt: ['resolução de disputas', 'arbitragem', 'reclamações']
    },
    dmca: {
      en: ['dmca', 'copyright', 'copyright policy', 'intellectual property'],
      es: ['dmca', 'derechos de autor', 'propiedad intelectual'],
      fr: ['dmca', 'droits d\'auteur', 'propriété intellectuelle'],
      de: ['dmca', 'urheberrecht', 'geistiges eigentum'],
      nl: ['dmca', 'auteursrecht', 'intellectueel eigendom'],
      pt: ['dmca', 'direitos autorais', 'propriedade intelectual']
    },
    reportAbuse: {
      en: ['report abuse', 'report violation', 'report content', 'abuse'],
      es: ['reportar abuso', 'denunciar', 'reportar contenido'],
      fr: ['signaler un abus', 'signaler une violation', 'signaler'],
      de: ['missbrauch melden', 'verstoß melden', 'melden'],
      nl: ['misbruik melden', 'schending melden', 'rapporteren'],
      pt: ['denunciar abuso', 'reportar violação', 'denunciar']
    },
    doNotSell: {
      en: ['do not sell or share my personal information', 'do not sell my personal information', 'do not share my personal information', 'do not sell', 'do not share', 'do not sell or share', 'do not sell my info', 'opt out of sale', 'your privacy choices', 'limit the use', 'ccpa opt-out', 'ccpa opt out', 'personal information', 'do-not-sell'],
      es: ['no vender ni compartir mi información personal', 'no vender mi información personal', 'no vender', 'no compartir', 'no vender ni compartir', 'opciones de privacidad'],
      fr: ['ne vendez pas ou ne partagez pas mes informations personnelles', 'ne pas vendre', 'ne pas partager', 'ne vendez pas mes informations personnelles', 'choix de confidentialité'],
      de: ['verkaufen oder teilen sie meine daten nicht', 'nicht verkaufen', 'nicht teilen', 'verkaufen sie meine daten nicht', 'datenschutzoptionen'],
      nl: ['verkoop of deel mijn gegevens niet', 'niet verkopen', 'niet delen', 'verkoop mijn gegevens niet', 'privacykeuzes'],
      pt: ['não venda ou compartilhe minhas informações pessoais', 'não vender', 'não compartilhar', 'não venda minhas informações pessoais', 'opções de privacidade']
    }
  };

  // Core keywords for fallback matching
  const CORE_KEYWORDS = {
    privacyPolicy: {
      en: ['privacy'],
      es: ['privacidad'],
      fr: ['confidentialité', 'vie privée'],
      de: ['datenschutz', 'privatsphäre'],
      nl: ['privacy'],
      pt: ['privacidade']
    },
    cookiePolicy: {
      en: ['cookie'],
      es: ['cookie'],
      fr: ['cookie'],
      de: ['cookie'],
      nl: ['cookie'],
      pt: ['cookie']
    },
    termsOfService: {
      en: ['terms'],
      es: ['términos', 'condiciones'],
      fr: ['conditions'],
      de: ['nutzungsbedingungen', 'agb'],
      nl: ['voorwaarden'],
      pt: ['termos', 'condições']
    }
  };

  // URL path indicators
  const URL_INDICATORS = {
    privacyPolicy: ['privacy', 'privacidad', 'privacidade', 'confidentialite', 'datenschutz', 'privatsphare', 'datos-personales', 'data-protection'],
    cookiePolicy: ['cookie'],
    termsOfService: ['terms', 'tos', 'condiciones', 'conditions', 'termos', 'nutzungsbedingungen', 'voorwaarden'],
    legal: ['legal', 'impressum', 'mentions-legales'],
    doNotSell: ['do-not-sell', 'ccpa', 'opt-out', 'personal-information', 'no-vender']
  };

  // Cookie banner patterns
  const COOKIE_BANNER_PATTERNS = {
    ids: [
      'cookie-banner', 'cookie-notice', 'cookie-consent', 'cookiebanner',
      'cookienotice', 'gdpr-banner', 'privacy-banner', 'onetrust-banner',
      'cookiebot', 'consent-banner', 'CybotCookiebotDialog', 'onetrust-consent-sdk'
    ],
    classes: [
      'cookie-banner', 'cookie-notice', 'cookie-consent', 'gdpr-banner',
      'privacy-notice', 'consent-overlay', 'cookie-popup', 'cookie-bar',
      'cc-banner', 'cookiealert', 'cmp-container', 'optanon-alert-box-wrapper'
    ],
    textPatterns: {
      en: ['we use cookies', 'this website uses cookies', 'cookie consent', 'accept cookies', 'accept all cookies'],
      es: ['usamos cookies', 'este sitio usa cookies', 'aceptar cookies'],
      fr: ['nous utilisons des cookies', 'ce site utilise des cookies', 'accepter les cookies'],
      de: ['wir verwenden cookies', 'diese website verwendet cookies', 'cookies akzeptieren'],
      nl: ['we gebruiken cookies', 'deze website gebruikt cookies', 'cookies accepteren'],
      pt: ['usamos cookies', 'este site usa cookies', 'aceitar cookies']
    }
  };

  // Scoring constants
  const SCORES = {
    EXACT: 100,
    STARTS_WITH: 80,
    CONTAINS: 60,
    ALL_WORDS: 50,
    KEYWORD_URL: 45,
    HREF: 40
  };

  // Detect page language
  function detectLanguage() {
    const htmlLang = document.documentElement.lang?.toLowerCase().substring(0, 2);
    if (htmlLang && ['en', 'es', 'fr', 'de', 'nl', 'pt'].includes(htmlLang)) {
      return htmlLang;
    }
    return 'en';
  }

  // Extract all links from the page
  function extractLinks() {
    const links = [];
    document.querySelectorAll('a').forEach(elem => {
      const href = elem.href;
      const text = elem.textContent?.trim() || '';
      const title = elem.title || '';
      const ariaLabel = elem.getAttribute('aria-label') || '';

      if (href) {
        links.push({
          href,
          text,
          title,
          ariaLabel,
          fullText: `${text} ${title} ${ariaLabel}`.trim()
        });
      }
    });
    return links;
  }

  // Find matching link for a category
  function findMatchingLink(links, languagePatterns, detectedLanguage, category = '') {
    const patterns = languagePatterns[detectedLanguage] || [];
    let bestMatch = null;
    let bestScore = 0;
    const isDoNotSell = category === 'doNotSell';

    for (const link of links) {
      const hrefLower = link.href.toLowerCase();
      const textLower = link.fullText.toLowerCase().trim().replace(/\s+/g, ' ');

      for (const pattern of patterns) {
        let score = 0;
        const patternWords = pattern.split(/\s+/);
        const normalizedPattern = pattern.toLowerCase().trim().replace(/\s+/g, ' ');

        // Exact text match
        if (textLower === normalizedPattern) {
          score = SCORES.EXACT;
        }
        // Text starts with pattern
        else if (textLower.startsWith(normalizedPattern)) {
          score = SCORES.STARTS_WITH;
        }
        // Text contains pattern
        else if (textLower.includes(normalizedPattern)) {
          score = SCORES.CONTAINS;
        }
        // For CCPA, check if all pattern words appear
        else if (isDoNotSell && patternWords.length > 1) {
          const allWordsPresent = patternWords.every(word => textLower.includes(word));
          if (allWordsPresent) {
            score = SCORES.ALL_WORDS;
          }
        }
        // Check href
        else {
          const hrefPatterns = [
            pattern.replace(/\s+/g, '-'),
            pattern.replace(/\s+/g, '_'),
            pattern.replace(/\s+/g, '')
          ];

          for (const hrefPattern of hrefPatterns) {
            if (hrefLower.includes(hrefPattern.toLowerCase())) {
              score = SCORES.HREF;
              break;
            }
          }
        }

        // Bonus for relevant URL paths
        if (hrefLower.includes('/privacy') || hrefLower.includes('/legal') || hrefLower.includes('/terms')) {
          score += 20;
        }

        // Special bonus for CCPA-specific hrefs
        if (isDoNotSell && (hrefLower.includes('do-not-sell') || hrefLower.includes('ccpa') || hrefLower.includes('personal-information'))) {
          score += 30;
        }

        if (score > bestScore) {
          bestScore = score;
          bestMatch = {
            found: true,
            url: link.href,
            text: link.text,
            matchedPattern: pattern,
            score: score
          };
        }
      }

      // Keyword + URL indicator fallback
      if (CORE_KEYWORDS[category]) {
        const langKeywords = CORE_KEYWORDS[category][detectedLanguage] || [];
        const allKeywords = [...new Set([...langKeywords, ...Object.values(CORE_KEYWORDS[category]).flat()])];
        const urlIndicators = URL_INDICATORS[category] || [];

        const matchedKeyword = allKeywords.find(kw => textLower.includes(kw.toLowerCase()));
        const matchedUrlIndicator = urlIndicators.find(ind => hrefLower.includes(ind));

        if (matchedKeyword && matchedUrlIndicator) {
          const fallbackScore = SCORES.KEYWORD_URL;
          if (fallbackScore > bestScore) {
            bestScore = fallbackScore;
            bestMatch = {
              found: true,
              url: link.href,
              text: link.text,
              matchedPattern: `${matchedKeyword} (keyword+URL)`,
              score: fallbackScore
            };
          }
        }
      }
    }

    if (bestMatch && bestScore >= SCORES.HREF) {
      return bestMatch;
    }

    // Try all languages as fallback
    for (const [lang, langPatterns] of Object.entries(languagePatterns)) {
      if (lang === detectedLanguage) continue;

      for (const link of links) {
        const hrefLower = link.href.toLowerCase();
        const textLower = link.fullText.toLowerCase().trim().replace(/\s+/g, ' ');

        for (const pattern of langPatterns) {
          let score = 0;
          const normalizedPattern = pattern.toLowerCase().trim().replace(/\s+/g, ' ');

          if (textLower === normalizedPattern) {
            score = SCORES.EXACT;
          } else if (textLower.startsWith(normalizedPattern)) {
            score = SCORES.STARTS_WITH;
          } else if (textLower.includes(normalizedPattern)) {
            score = SCORES.CONTAINS;
          } else {
            const hrefPatterns = [
              pattern.replace(/\s+/g, '-'),
              pattern.replace(/\s+/g, '_'),
              pattern.replace(/\s+/g, '')
            ];

            for (const hrefPattern of hrefPatterns) {
              if (hrefLower.includes(hrefPattern.toLowerCase())) {
                score = SCORES.HREF;
                break;
              }
            }
          }

          if (hrefLower.includes('/privacy') || hrefLower.includes('/legal') || hrefLower.includes('/terms')) {
            score += 20;
          }

          if (score > bestScore) {
            bestScore = score;
            bestMatch = {
              found: true,
              url: link.href,
              text: link.text,
              matchedPattern: pattern,
              matchedLanguage: lang,
              score: score
            };
          }
        }
      }
    }

    if (bestMatch && bestScore >= SCORES.HREF) {
      return bestMatch;
    }

    return { found: false, url: null, text: null };
  }

  // Detect cookie banner
  function detectCookieBanner() {
    const detected = {
      detected: false,
      details: {
        method: null,
        cmp: null,
        elementId: null,
        elementClass: null
      }
    };

    // Check for common IDs
    for (const id of COOKIE_BANNER_PATTERNS.ids) {
      const elem = document.getElementById(id);
      if (elem) {
        detected.detected = true;
        detected.details.method = 'Element ID';
        detected.details.elementId = id;
        return detected;
      }
    }

    // Check for common classes
    for (const className of COOKIE_BANNER_PATTERNS.classes) {
      const elems = document.getElementsByClassName(className);
      if (elems.length > 0) {
        detected.detected = true;
        detected.details.method = 'Element Class';
        detected.details.elementClass = className;
        return detected;
      }
    }

    // Check for CMP scripts
    const scripts = document.querySelectorAll('script[src]');
    const cmpPatterns = ['onetrust', 'cookiebot', 'cookielaw', 'cookieconsent', 'quantcast', 'trustarc', 'usercentrics', 'didomi', 'cookiepro', 'iubenda'];

    for (const script of scripts) {
      const src = script.src.toLowerCase();
      for (const cmp of cmpPatterns) {
        if (src.includes(cmp)) {
          detected.detected = true;
          detected.details.method = 'CMP Script';
          detected.details.cmp = cmp;
          return detected;
        }
      }
    }

    // Check for text patterns
    const bodyText = document.body?.textContent?.toLowerCase() || '';
    for (const [lang, patterns] of Object.entries(COOKIE_BANNER_PATTERNS.textPatterns)) {
      for (const pattern of patterns) {
        if (bodyText.includes(pattern)) {
          detected.detected = true;
          detected.details.method = 'Text Pattern';
          detected.details.matchedText = pattern;
          detected.details.language = lang;
          return detected;
        }
      }
    }

    return detected;
  }

  // Main scan function
  function scanPage() {
    const detectedLanguage = detectLanguage();
    const links = extractLinks();
    const results = {};

    // Check each compliance category
    for (const [category, languagePatterns] of Object.entries(PATTERNS)) {
      results[category] = findMatchingLink(links, languagePatterns, detectedLanguage, category);
    }

    // Check for cookie banner
    const cookieBanner = detectCookieBanner();
    results.cookieBanner = {
      found: cookieBanner.detected,
      details: cookieBanner.details
    };

    return {
      url: window.location.href,
      title: document.title,
      language: detectedLanguage,
      scannedAt: new Date().toISOString(),
      compliance: results
    };
  }

  // Listen for messages from the popup/background
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'scan') {
      try {
        const results = scanPage();
        sendResponse({ success: true, data: results });
      } catch (error) {
        sendResponse({ success: false, error: error.message });
      }
    }
    return true; // Keep the message channel open for async response
  });

  // Expose scan function for testing
  window.__complianceScanner = { scanPage };
})();
