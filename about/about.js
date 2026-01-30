// OSCAR About Page - Cookie Feature

const OSCAR_PUNS = [
  // Cookie Policy Puns
  "I hereby acknowledge receipt of this treat pursuant to the EU Cookie Directive. Consent: enthusiastically given! 🍪",
  "This treat complies with my personal Cookie Policy: accept all, reject none. *nom nom*",
  "I've reviewed your cookie banner thoroughly. My finding: needs more actual cookies.",

  // GDPR Puns
  "Under GDPR (Good Dogs Require Pastries), I exercise my right to access this treat!",
  "Article 17 says I have the right to erasure... and I will erase this treat completely.",
  "Data minimization? Never heard of it. Treat maximization is my policy!",
  "I'm the Data Paw-tection Officer around here, and I approve this treat.",

  // CCPA Puns
  "California dogs have the right to know what treats are being collected. I see a bone!",
  "I'm exercising my CCPA right to opt-IN to all available treats.",
  "Do Not Sell My Personal Information... but DO give me that treat!",

  // Terms of Service Puns
  "Per Section 4.2 of the Good Boy Agreement, belly rubs are mandatory after treats.",
  "These terms are binding and non-refundable. The treat goes in, it doesn't come out.",
  "I accept these Terms of Service. TL;DR: You give treats, I wag tail.",

  // Privacy Policy Puns
  "Your privacy is important to me. I won't tell anyone about this treat. *wink*",
  "I've read your Privacy Policy. It says nothing about sharing treats with dogs. Loophole!",

  // Legal Notice Puns
  "This treat has been duly executed and delivered. To my mouth. Case closed.",
  "I move to accept this treat into evidence. Motion granted! *gavel sound*",
  "Force majeure? More like force ma-YUM! *happy bark*",

  // Compliance Puns
  "Compliance check complete: This treat is 100% compliant with my tummy regulations.",
  "I've conducted a thorough treat audit. Results: insufficient quantity. More please!",
  "Due diligence complete. Treat approved for immediate consumption.",
  "This treat meets all 10 OSCAR compliance standards. Bone-appetit!",

  // DMCA Puns
  "I'm filing a DMCA takedown... of this treat. Into my mouth.",
  "Copyright notice: This treat is now intellectual paw-perty of Oscar.",

  // Dispute Resolution
  "Any disputes about this treat shall be settled by additional treats.",
  "I'm wagging my tail, which constitutes binding arbitration in dog law."
];

const COOKIE_EMOJIS = ['🍪', '🦴', '🥠', '🐾', '🎂'];

// DOM Elements
let treatBtn;
let cookieLightbox;
let oscarPunEl;
let closeCookieLightboxBtn;
let flyingCookiesContainer;
let oscarBanner;

document.addEventListener('DOMContentLoaded', init);

function init() {
  treatBtn = document.getElementById('give-cookie');
  cookieLightbox = document.getElementById('cookie-lightbox');
  oscarPunEl = document.getElementById('oscar-pun');
  closeCookieLightboxBtn = document.getElementById('close-cookie-lightbox');
  flyingCookiesContainer = document.getElementById('flying-cookies');
  oscarBanner = document.querySelector('.oscar-banner');

  if (treatBtn) {
    treatBtn.addEventListener('click', giveCookie);
  }
  if (closeCookieLightboxBtn) {
    closeCookieLightboxBtn.addEventListener('click', closeCookieLightbox);
  }
  if (cookieLightbox) {
    const backdrop = cookieLightbox.querySelector('.cookie-lightbox-backdrop');
    if (backdrop) {
      backdrop.addEventListener('click', closeCookieLightbox);
    }
  }

  // Escape key to close lightbox
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && cookieLightbox.classList.contains('visible')) {
      closeCookieLightbox();
    }
  });
}

function giveCookie() {
  // Show random pun
  const randomPun = OSCAR_PUNS[Math.floor(Math.random() * OSCAR_PUNS.length)];
  oscarPunEl.textContent = randomPun;

  // Show lightbox
  cookieLightbox.classList.remove('hidden');
  setTimeout(() => {
    cookieLightbox.classList.add('visible');
  }, 10);

  // Wiggle Oscar
  if (oscarBanner) {
    oscarBanner.classList.add('wiggle');
    setTimeout(() => oscarBanner.classList.remove('wiggle'), 600);
  }

  // Launch flying cookies
  launchFlyingCookies();
}

function closeCookieLightbox() {
  cookieLightbox.classList.remove('visible');
  setTimeout(() => {
    cookieLightbox.classList.add('hidden');
  }, 300);
}

function launchFlyingCookies() {
  // Clear previous cookies
  flyingCookiesContainer.innerHTML = '';

  // Create 25 flying cookies (more for bigger page)
  for (let i = 0; i < 25; i++) {
    const cookie = document.createElement('span');
    cookie.className = 'flying-cookie';
    cookie.textContent = COOKIE_EMOJIS[Math.floor(Math.random() * COOKIE_EMOJIS.length)];

    // Random positioning and timing
    const left = Math.random() * 100;
    const delay = Math.random() * 0.6;
    const duration = 1.2 + Math.random() * 1.0;
    const size = 24 + Math.random() * 28;
    const wobble = -40 + Math.random() * 80;

    cookie.style.left = `${left}%`;
    cookie.style.fontSize = `${size}px`;
    cookie.style.setProperty('--delay', `${delay}s`);
    cookie.style.setProperty('--duration', `${duration}s`);
    cookie.style.setProperty('--wobble', `${wobble}px`);

    flyingCookiesContainer.appendChild(cookie);
  }

  // Clean up after animation
  setTimeout(() => {
    flyingCookiesContainer.innerHTML = '';
  }, 2500);
}
