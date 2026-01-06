// script.js - language toggle, improved stable service activation, smooth anchors, WhatsApp links

// ============ Configuration ============
const WHATSAPP_NUMBER = "213550665537"; // WhatsApp number (intl format, no +)
const WHATSAPP_MESSAGE = encodeURIComponent("Bonjour TRANS PROSIM PLANAT - مرحبا شركة بروسيم");
const FACEBOOK_URL = "https://www.facebook.com/profile.php?id=61584903862629";
// =======================================================

// Build WhatsApp URLs and set links
function setWhatsAppLinks() {
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MESSAGE}`;
  const headerWa = document.getElementById('whatsapp-header');
  const ctaWa = document.getElementById('cta-whatsapp');
  const wa2 = document.getElementById('whatsapp-link-2');

  if(headerWa) headerWa.setAttribute('href', url);
  if(ctaWa) ctaWa.setAttribute('href', url);
  if(wa2) wa2.setAttribute('href', url);
}

// Language toggle (reads data-fr/data-ar attributes)
function applyLang(lang) {
  const html = document.documentElement;
  if(lang === 'ar'){
    html.setAttribute('dir','rtl');
    html.setAttribute('lang','ar');
    document.body.style.fontFamily = "'Cairo', Inter, system-ui, -apple-system, 'Segoe UI', Roboto, Arial";
  } else {
    html.setAttribute('dir','ltr');
    html.setAttribute('lang','fr');
    document.body.style.fontFamily = "'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, Arial";
  }

  // fill all text nodes from data attributes
  document.querySelectorAll('[data-fr]').forEach(el => {
    const fr = el.getAttribute('data-fr') || "";
    const ar = el.getAttribute('data-ar') || "";
    el.textContent = (lang === 'ar') ? ar : fr;
  });

  // fill service card titles from data-*title attributes
  document.querySelectorAll('.service-card').forEach(card => {
    const titleEl = card.querySelector('.service-title');
    const frT = card.getAttribute('data-fr-title') || "";
    const arT = card.getAttribute('data-ar-title') || "";
    if(titleEl) titleEl.textContent = (lang === 'ar') ? arT : frT;
  });

  // button active styles
  document.getElementById('btn-fr').classList.toggle('active', lang === 'fr');
  document.getElementById('btn-ar').classList.toggle('active', lang === 'ar');
  document.getElementById('btn-fr').setAttribute('aria-pressed', String(lang === 'fr'));
  document.getElementById('btn-ar').setAttribute('aria-pressed', String(lang === 'ar'));
}

// Attach language buttons
document.getElementById('btn-fr').addEventListener('click', ()=> applyLang('fr'));
document.getElementById('btn-ar').addEventListener('click', ()=> applyLang('ar'));

// Initialize
applyLang('fr');
setWhatsAppLinks();
document.getElementById('year').textContent = new Date().getFullYear();

// Smooth anchor scrolling for internal links
document.querySelectorAll('a[href^="#"]').forEach(a=>{
  a.addEventListener('click', function(e){
    const href = this.getAttribute('href');
    if(href.length > 1){
      e.preventDefault();
      const target = document.querySelector(href);
      if(target) target.scrollIntoView({behavior:'smooth', block:'start'});
    }
  });
});

// Reveal general elements (hero text and headings)
const revealEls = document.querySelectorAll('.reveal-up');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if(entry.isIntersecting) entry.target.classList.add('in-view');
  });
}, { threshold: 0.18 });
revealEls.forEach(el => revealObserver.observe(el));

// ======= Stable services logic =======
// Make services "stable": only the card that is centered (large intersection) becomes active.
// This requires stronger intersection threshold so slight scroll doesn't flip the active card.

const serviceCards = Array.from(document.querySelectorAll('.service-card'));

const servicesObserver = new IntersectionObserver((entries) => {
  // find the observed entry with largest intersectionRatio
  let best = null;
  entries.forEach(e => {
    if(!best || e.intersectionRatio > best.intersectionRatio) best = e;
  });

  if(best){
    // require a majority of central view to activate
    const required = 0.55; // 55% of the card must be visible in the root area (center-focused)
    serviceCards.forEach(card => {
      if(card === best.target && best.intersectionRatio >= required){
        card.classList.add('active');
        // ensure other cards are not active
      } else {
        card.classList.remove('active');
      }
    });
  }
}, {
  threshold: [0.25, 0.4, 0.55, 0.75],
  rootMargin: '-20% 0px -20% 0px' // focuses on center area; tweak if you want stricter center
});

// Observe each service card
serviceCards.forEach(card => servicesObserver.observe(card));

// On load ensure the first card is active if none meet threshold
window.addEventListener('load', () => {
  const anyActive = serviceCards.some(c => c.classList.contains('active'));
  if(!anyActive && serviceCards[0]) {
    serviceCards[0].classList.add('active');
    // scroll the first into view to ensure consistent starting position
    setTimeout(()=> { serviceCards[0].scrollIntoView({behavior:'smooth', block:'start'}); }, 150);
  }
});
