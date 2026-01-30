// Multi-language patterns for detecting compliance links
export const PATTERNS = {
  // ===== PRIVACY & DATA PROTECTION =====
  privacyPolicy: {
    en: ['privacy policy', 'privacy notice', 'privacy statement', 'data protection', 'privacy center', 'privacy centre', 'your privacy', 'your privacy rights', 'data privacy policy', 'privacy information'],
    es: ['política de privacidad', 'aviso de privacidad', 'protección de datos', 'central de privacidad', 'centro de privacidad', 'privacidad', 'derechos de privacidad', 'datos personales', 'política de datos'],
    fr: ['politique de confidentialité', 'politique de vie privée', 'protection des données', 'confidentialité', 'centre de confidentialité', 'vie privée', 'données personnelles'],
    de: ['datenschutzerklärung', 'datenschutz', 'datenschutzrichtlinie', 'datenschutzzentrum', 'datenschutzhinweis', 'datenschutzinformation', 'privatsphäre'],
    nl: ['privacyverklaring', 'privacybeleid', 'gegevensbescherming', 'privacycentrum', 'privacy', 'uw privacy'],
    pt: ['política de privacidade', 'aviso de privacidade', 'proteção de dados', 'central de privacidade', 'centro de privacidade', 'privacidade', 'dados pessoais']
  },
  doNotSell: {
    en: ['do not sell or share my personal information', 'do not sell my personal information', 'do not share my personal information', 'do not sell', 'do not share', 'do not sell or share', 'do not sell my info', 'opt out of sale', 'your privacy choices', 'limit the use', 'ccpa opt-out', 'ccpa opt out', 'personal information', 'do-not-sell'],
    es: ['no vender ni compartir mi información personal', 'no vender mi información personal', 'no vender', 'no compartir', 'no vender ni compartir', 'opciones de privacidad'],
    fr: ['ne vendez pas ou ne partagez pas mes informations personnelles', 'ne pas vendre', 'ne pas partager', 'ne vendez pas mes informations personnelles', 'choix de confidentialité'],
    de: ['verkaufen oder teilen sie meine daten nicht', 'nicht verkaufen', 'nicht teilen', 'verkaufen sie meine daten nicht', 'datenschutzoptionen'],
    nl: ['verkoop of deel mijn gegevens niet', 'niet verkopen', 'niet delen', 'verkoop mijn gegevens niet', 'privacykeuzes'],
    pt: ['não venda ou compartilhe minhas informações pessoais', 'não vender', 'não compartilhar', 'não venda minhas informações pessoais', 'opções de privacidade']
  },
  dataRequest: {
    en: ['data subject request', 'dsar', 'access my data', 'request my data', 'download my data', 'data access request', 'right to access', 'data request', 'request your data', 'access your data', 'download your data', 'data portability', 'export my data'],
    es: ['solicitud de acceso a datos', 'acceder a mis datos', 'descargar mis datos', 'solicitud de datos', 'derecho de acceso'],
    fr: ['demande d\'accès aux données', 'accéder à mes données', 'télécharger mes données', 'droit d\'accès', 'portabilité des données'],
    de: ['auskunftsrecht', 'datenzugang', 'meine daten anfordern', 'daten herunterladen', 'datenportabilität'],
    nl: ['gegevensverzoek', 'toegang tot mijn gegevens', 'download mijn gegevens', 'recht op inzage'],
    pt: ['solicitação de dados', 'acessar meus dados', 'baixar meus dados', 'direito de acesso']
  },

  // ===== COOKIE COMPLIANCE =====
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

  // ===== LEGAL DISCLOSURES =====
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
    en: ['dispute resolution', 'arbitration', 'complaints', 'dispute', 'online dispute resolution', 'odr'],
    es: ['resolución de disputas', 'arbitraje', 'reclamaciones'],
    fr: ['règlement des litiges', 'arbitrage', 'réclamations'],
    de: ['streitbeilegung', 'schlichtung', 'beschwerden'],
    nl: ['geschillenbeslechting', 'arbitrage', 'klachten'],
    pt: ['resolução de disputas', 'arbitragem', 'reclamações']
  },
  contact: {
    en: ['contact us', 'contact information', 'get in touch', 'reach us', 'contact details', 'how to contact'],
    es: ['contáctenos', 'contacto', 'información de contacto', 'ponerse en contacto'],
    fr: ['contactez-nous', 'nous contacter', 'coordonnées', 'informations de contact'],
    de: ['kontakt', 'kontaktieren sie uns', 'kontaktinformationen'],
    nl: ['contact', 'neem contact op', 'contactgegevens'],
    pt: ['contate-nos', 'fale conosco', 'informações de contato', 'entre em contato']
  },

  // ===== CONSUMER PROTECTION =====
  refundPolicy: {
    en: ['refund policy', 'return policy', 'returns', 'refunds', 'money back', 'cancellation policy', 'return and refund', 'returns & refunds', 'exchange policy'],
    es: ['política de devolución', 'política de reembolso', 'devoluciones', 'reembolsos', 'política de cancelación'],
    fr: ['politique de remboursement', 'politique de retour', 'retours', 'remboursements', 'politique d\'annulation'],
    de: ['rückgaberecht', 'erstattungsrichtlinie', 'rückgabe', 'widerrufsrecht', 'stornierungsrichtlinie'],
    nl: ['retourbeleid', 'restitutiebeleid', 'retourneren', 'terugbetalingen'],
    pt: ['política de devolução', 'política de reembolso', 'devoluções', 'reembolsos']
  },
  shippingPolicy: {
    en: ['shipping policy', 'shipping information', 'delivery policy', 'delivery information', 'shipping & delivery', 'shipping rates'],
    es: ['política de envío', 'información de envío', 'política de entrega', 'información de entrega'],
    fr: ['politique de livraison', 'informations de livraison', 'politique d\'expédition'],
    de: ['versandrichtlinie', 'versandinformationen', 'lieferinformationen', 'lieferbedingungen'],
    nl: ['verzendbeleid', 'verzendinformatie', 'leveringsinformatie', 'bezorginformatie'],
    pt: ['política de envio', 'informações de envio', 'política de entrega']
  },
  ageVerification: {
    en: ['age verification', 'age gate', 'must be 18', 'must be 21', 'verify your age', 'coppa', 'children\'s privacy', 'age restricted', 'adults only', 'parental consent'],
    es: ['verificación de edad', 'mayores de 18', 'mayores de 21', 'privacidad de menores'],
    fr: ['vérification de l\'âge', 'réservé aux adultes', 'plus de 18 ans', 'confidentialité des enfants'],
    de: ['altersverifikation', 'altersüberprüfung', 'ab 18', 'jugendschutz'],
    nl: ['leeftijdsverificatie', '18+', 'alleen voor volwassenen'],
    pt: ['verificação de idade', 'maiores de 18', 'privacidade infantil']
  },

  // ===== ACCESSIBILITY =====
  accessibility: {
    en: ['accessibility', 'accessibility statement', 'wcag', 'ada compliance', 'a11y', 'screen reader', 'accessibility policy', 'accessible', 'accessibility help'],
    es: ['accesibilidad', 'declaración de accesibilidad', 'cumplimiento ada'],
    fr: ['accessibilité', 'déclaration d\'accessibilité', 'politique d\'accessibilité'],
    de: ['barrierefreiheit', 'erklärung zur barrierefreiheit', 'barrierefreie'],
    nl: ['toegankelijkheid', 'toegankelijkheidsverklaring', 'toegankelijkheidsbeleid'],
    pt: ['acessibilidade', 'declaração de acessibilidade', 'política de acessibilidade']
  },
  sitemap: {
    en: ['sitemap', 'site map', 'site index', 'html sitemap'],
    es: ['mapa del sitio', 'mapa web'],
    fr: ['plan du site', 'carte du site'],
    de: ['sitemap', 'seitenübersicht', 'inhaltsverzeichnis'],
    nl: ['sitemap', 'site-overzicht'],
    pt: ['mapa do site', 'mapa do website']
  },

  // ===== CONTENT & IP =====
  dmca: {
    en: ['dmca', 'copyright', 'copyright policy', 'intellectual property', 'copyright notice', 'ip policy'],
    es: ['dmca', 'derechos de autor', 'propiedad intelectual'],
    fr: ['dmca', 'droits d\'auteur', 'propriété intellectuelle'],
    de: ['dmca', 'urheberrecht', 'geistiges eigentum'],
    nl: ['dmca', 'auteursrecht', 'intellectueel eigendom'],
    pt: ['dmca', 'direitos autorais', 'propriedade intelectual']
  },
  reportAbuse: {
    en: ['report abuse', 'report violation', 'report content', 'abuse', 'report illegal content', 'flag content'],
    es: ['reportar abuso', 'denunciar', 'reportar contenido'],
    fr: ['signaler un abus', 'signaler une violation', 'signaler'],
    de: ['missbrauch melden', 'verstoß melden', 'melden'],
    nl: ['misbruik melden', 'schending melden', 'rapporteren'],
    pt: ['denunciar abuso', 'reportar violação', 'denunciar']
  },
  affiliateDisclosure: {
    en: ['affiliate disclosure', 'affiliate links', 'ftc disclosure', 'sponsored', 'material connection', 'advertising disclosure', 'sponsored content'],
    es: ['divulgación de afiliados', 'enlaces de afiliados', 'contenido patrocinado'],
    fr: ['divulgation d\'affiliation', 'liens d\'affiliation', 'contenu sponsorisé'],
    de: ['affiliate-offenlegung', 'affiliate-links', 'gesponserte inhalte', 'werbung'],
    nl: ['affiliate disclosure', 'affiliate links', 'gesponsorde inhoud'],
    pt: ['divulgação de afiliados', 'links de afiliados', 'conteúdo patrocinado']
  },
  adChoices: {
    en: ['ad choices', 'adchoices', 'interest-based ads', 'personalized ads', 'targeted advertising', 'advertising preferences', 'ad preferences'],
    es: ['opciones de anuncios', 'anuncios personalizados', 'preferencias de publicidad'],
    fr: ['choix de publicité', 'publicités personnalisées', 'préférences publicitaires'],
    de: ['anzeigeneinstellungen', 'personalisierte werbung', 'werbeeinstellungen'],
    nl: ['advertentiekeuzes', 'gepersonaliseerde advertenties', 'advertentievoorkeuren'],
    pt: ['escolhas de anúncios', 'anúncios personalizados', 'preferências de publicidade']
  },

  // ===== CORPORATE RESPONSIBILITY =====
  modernSlavery: {
    en: ['modern slavery', 'slavery statement', 'human trafficking', 'supply chain transparency', 'modern slavery statement', 'anti-slavery'],
    es: ['esclavitud moderna', 'declaración contra la esclavitud', 'tráfico humano'],
    fr: ['esclavage moderne', 'déclaration sur l\'esclavage', 'traite des êtres humains'],
    de: ['moderne sklaverei', 'erklärung zur modernen sklaverei', 'menschenhandel'],
    nl: ['moderne slavernij', 'verklaring moderne slavernij', 'mensenhandel'],
    pt: ['escravidão moderna', 'declaração sobre escravidão', 'tráfico humano']
  },
  sustainability: {
    en: ['sustainability', 'environmental policy', 'carbon footprint', 'climate', 'esg', 'green policy', 'environmental statement', 'sustainability report', 'carbon neutral'],
    es: ['sostenibilidad', 'política ambiental', 'huella de carbono', 'clima', 'informe de sostenibilidad'],
    fr: ['durabilité', 'politique environnementale', 'empreinte carbone', 'climat', 'rapport de durabilité'],
    de: ['nachhaltigkeit', 'umweltpolitik', 'co2-fußabdruck', 'klima', 'nachhaltigkeitsbericht'],
    nl: ['duurzaamheid', 'milieubeleid', 'co2-voetafdruk', 'klimaat', 'duurzaamheidsrapport'],
    pt: ['sustentabilidade', 'política ambiental', 'pegada de carbono', 'clima', 'relatório de sustentabilidade']
  },
  securityPolicy: {
    en: ['security policy', 'vulnerability disclosure', 'responsible disclosure', 'bug bounty', 'security.txt', 'security', 'report vulnerability', 'security contact'],
    es: ['política de seguridad', 'divulgación de vulnerabilidades', 'recompensa por errores'],
    fr: ['politique de sécurité', 'divulgation de vulnérabilités', 'prime aux bugs'],
    de: ['sicherheitsrichtlinie', 'schwachstellenoffenlegung', 'bug-bounty', 'sicherheit'],
    nl: ['beveiligingsbeleid', 'kwetsbaarheidsmeldingen', 'bug bounty'],
    pt: ['política de segurança', 'divulgação de vulnerabilidades', 'recompensa por bugs']
  },

  // ===== ICANN & REGISTRY COMPLIANCE =====
  whoisRdap: {
    en: ['whois', 'rdap', 'domain lookup', 'registration data', 'domain registration', 'registrant information', 'domain owner', 'registrant contact'],
    es: ['whois', 'consulta de dominio', 'datos de registro', 'registro de dominio', 'titular del dominio'],
    fr: ['whois', 'recherche de domaine', 'données d\'enregistrement', 'enregistrement de domaine', 'titulaire du domaine'],
    de: ['whois', 'domain-abfrage', 'registrierungsdaten', 'domain-registrierung', 'domaininhaber'],
    nl: ['whois', 'domein opzoeken', 'registratiegegevens', 'domeinregistratie', 'domeineigenaar'],
    pt: ['whois', 'consulta de domínio', 'dados de registro', 'registro de domínio', 'titular do domínio']
  },
  domainAbuse: {
    en: ['domain abuse', 'abuse contact', 'report domain abuse', 'dns abuse', 'abuse@', 'report phishing', 'report malware', 'abusive domain'],
    es: ['abuso de dominio', 'contacto de abuso', 'reportar abuso', 'abuso dns'],
    fr: ['abus de domaine', 'contact abus', 'signaler un abus', 'abus dns'],
    de: ['domain-missbrauch', 'missbrauchskontakt', 'missbrauch melden', 'dns-missbrauch'],
    nl: ['domein misbruik', 'misbruik contact', 'misbruik melden', 'dns misbruik'],
    pt: ['abuso de domínio', 'contato de abuso', 'reportar abuso', 'abuso dns']
  },
  udrp: {
    en: ['udrp', 'domain dispute', 'domain name dispute', 'cybersquatting', 'domain arbitration', 'wipo', 'uniform domain-name dispute-resolution', 'icann dispute'],
    es: ['udrp', 'disputa de dominio', 'resolución de disputas de dominio', 'ciberocupación'],
    fr: ['udrp', 'litige de domaine', 'résolution des litiges', 'cybersquattage'],
    de: ['udrp', 'domain-streit', 'domain-streitbeilegung', 'cybersquatting'],
    nl: ['udrp', 'domein geschil', 'domein geschillenbeslechting', 'cybersquatting'],
    pt: ['udrp', 'disputa de domínio', 'resolução de disputas', 'ciberocupação']
  },
  registrarInfo: {
    en: ['registrar', 'domain registrar', 'accredited registrar', 'icann accredited', 'registration agreement', 'registrar of record', 'authorized registrar'],
    es: ['registrador', 'registrador de dominio', 'registrador acreditado', 'acreditado icann'],
    fr: ['registrar', 'bureau d\'enregistrement', 'registraire accrédité', 'accrédité icann'],
    de: ['registrar', 'domain-registrar', 'akkreditierter registrar', 'icann-akkreditiert'],
    nl: ['registrar', 'domein registrar', 'geaccrediteerde registrar', 'icann geaccrediteerd'],
    pt: ['registrador', 'registrador de domínio', 'registrador credenciado', 'credenciado icann']
  },
  transferPolicy: {
    en: ['domain transfer', 'transfer policy', 'auth code', 'epp code', 'transfer lock', 'domain transfer policy', 'authorization code', 'transfer away'],
    es: ['transferencia de dominio', 'política de transferencia', 'código de autorización', 'código epp'],
    fr: ['transfert de domaine', 'politique de transfert', 'code d\'autorisation', 'code epp'],
    de: ['domain-transfer', 'transferrichtlinie', 'auth-code', 'epp-code', 'transfer-sperre'],
    nl: ['domein overdracht', 'overdrachtsbeleid', 'autorisatiecode', 'epp code'],
    pt: ['transferência de domínio', 'política de transferência', 'código de autorização', 'código epp']
  }
};

// Core keywords for fallback matching
export const CORE_KEYWORDS = {
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
  },
  accessibility: {
    en: ['accessibility', 'a11y'],
    es: ['accesibilidad'],
    fr: ['accessibilité'],
    de: ['barrierefreiheit'],
    nl: ['toegankelijkheid'],
    pt: ['acessibilidade']
  },
  refundPolicy: {
    en: ['refund', 'return'],
    es: ['devolución', 'reembolso'],
    fr: ['remboursement', 'retour'],
    de: ['rückgabe', 'erstattung'],
    nl: ['retour', 'restitutie'],
    pt: ['devolução', 'reembolso']
  }
};

// URL path indicators
export const URL_INDICATORS = {
  privacyPolicy: ['privacy', 'privacidad', 'privacidade', 'confidentialite', 'datenschutz', 'privatsphare', 'datos-personales', 'data-protection'],
  cookiePolicy: ['cookie', 'cookies'],
  termsOfService: ['terms', 'tos', 'condiciones', 'conditions', 'termos', 'nutzungsbedingungen', 'voorwaarden'],
  legal: ['legal', 'impressum', 'mentions-legales'],
  doNotSell: ['do-not-sell', 'ccpa', 'opt-out', 'personal-information', 'no-vender'],
  accessibility: ['accessibility', 'a11y', 'wcag', 'ada'],
  refundPolicy: ['refund', 'return', 'returns', 'devolucion'],
  shippingPolicy: ['shipping', 'delivery', 'envio', 'livraison'],
  contact: ['contact', 'contacto', 'kontakt'],
  sustainability: ['sustainability', 'environment', 'esg', 'climate'],
  securityPolicy: ['security', 'vulnerability', 'bug-bounty'],
  whoisRdap: ['whois', 'rdap', 'domain-lookup', 'registration-data'],
  domainAbuse: ['abuse', 'domain-abuse', 'report-abuse', 'dns-abuse'],
  udrp: ['udrp', 'domain-dispute', 'dispute-resolution', 'wipo'],
  registrarInfo: ['registrar', 'accredited', 'icann'],
  transferPolicy: ['transfer', 'domain-transfer', 'auth-code']
};

// Cookie banner detection patterns
export const COOKIE_BANNER_PATTERNS = {
  ids: [
    'cookie-banner', 'cookie-notice', 'cookie-consent', 'cookiebanner',
    'cookienotice', 'gdpr-banner', 'privacy-banner', 'onetrust-banner',
    'cookiebot', 'consent-banner', 'CybotCookiebotDialog'
  ],
  classes: [
    'cookie-banner', 'cookie-notice', 'cookie-consent', 'gdpr-banner',
    'privacy-notice', 'consent-overlay', 'cookie-popup', 'cookie-bar',
    'cc-banner', 'cookiealert', 'cmp-container'
  ],
  scripts: [
    'onetrust', 'cookiebot', 'cookielaw', 'cookieconsent',
    'quantcast', 'trustarc', 'usercentrics', 'didomi', 'cookiepro', 'iubenda'
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
export const SCORES = {
  EXACT: 100,
  STARTS_WITH: 80,
  CONTAINS: 60,
  ALL_WORDS: 50,
  KEYWORD_URL: 45,
  HREF: 40
};

// Default compliance weights for scoring (used as fallback)
// Note: These are now managed via training settings in options.js
export const COMPLIANCE_WEIGHTS = {
  // Privacy & Data Protection
  privacyPolicy: 22,
  doNotSell: 15,
  dataRequest: 8,
  // Cookie Compliance
  cookieBanner: 18,
  cookiePolicy: 13,
  cookieSettings: 10,
  // Legal Disclosures
  termsOfService: 9,
  legal: 8,
  dispute: 3,
  contact: 5,
  // Consumer Protection
  refundPolicy: 7,
  shippingPolicy: 5,
  ageVerification: 6,
  // Accessibility
  accessibility: 10,
  sitemap: 2,
  // Content & IP
  dmca: 1,
  reportAbuse: 1,
  affiliateDisclosure: 3,
  adChoices: 2,
  // Corporate Responsibility
  modernSlavery: 4,
  sustainability: 3,
  securityPolicy: 4,
  // ICANN & Registry Compliance
  whoisRdap: 5,
  domainAbuse: 4,
  udrp: 3,
  registrarInfo: 3,
  transferPolicy: 2
};

// Human-readable names for compliance items
export const COMPLIANCE_LABELS = {
  // Privacy & Data Protection
  privacyPolicy: 'Privacy Policy',
  doNotSell: 'Do Not Sell (CCPA)',
  dataRequest: 'Data Subject Request',
  // Cookie Compliance
  cookieBanner: 'Cookie Banner',
  cookiePolicy: 'Cookie Policy',
  cookieSettings: 'Cookie Settings',
  // Legal Disclosures
  termsOfService: 'Terms of Service',
  legal: 'Legal Notice / Impressum',
  dispute: 'Dispute Resolution',
  contact: 'Contact Information',
  // Consumer Protection
  refundPolicy: 'Refund / Return Policy',
  shippingPolicy: 'Shipping Policy',
  ageVerification: 'Age Verification',
  // Accessibility
  accessibility: 'Accessibility Statement',
  sitemap: 'Sitemap',
  // Content & IP
  dmca: 'DMCA / Copyright',
  reportAbuse: 'Report Abuse',
  affiliateDisclosure: 'Affiliate Disclosure',
  adChoices: 'Ad Choices / Interest-Based Ads',
  // Corporate Responsibility
  modernSlavery: 'Modern Slavery Statement',
  sustainability: 'Environmental / Sustainability',
  securityPolicy: 'Security / Vulnerability Disclosure',
  // ICANN & Registry Compliance
  whoisRdap: 'WHOIS / RDAP Lookup',
  domainAbuse: 'Domain Abuse Contact',
  udrp: 'UDRP / Domain Disputes',
  registrarInfo: 'Registrar Information',
  transferPolicy: 'Domain Transfer Policy'
};
