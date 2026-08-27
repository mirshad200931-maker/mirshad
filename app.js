/**
 * MUHAMMED MIRSHAD - APPLE PRO SUITE & FRAME MOTION ENGINE
 * Interactive Systems, Pricing Calculator, and Global Utilities
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Apple Frame Motion Scroll Reveal Engine
  initFrameMotion();

  // 2. Animated Number Counters
  initNumberCounters();

  // 3. Scroll Progress & Sticky Header
  initScrollHeader();

  // 4. Pricing Category Tabs
  initPricingTabs();

  // 5. Currency Toggle (INR / USD)
  initCurrencyToggle();

  // 6. Interactive Scope & Price Calculator
  initPriceCalculator();

  // 7. Live Clock in Footer (IST)
  initLiveClock();

  // 8. Clipboard Copy Handlers
  initClipboardButtons();

  // 9. vCard (.vcf) Generator & Download
  initVCardDownload();

  // 10. QR Code Modal & Generator
  initQrModal();

  // 11. Native / Fallback Share
  initShareAction();

  // 12. Dynamic Year
  const yearSpan = document.getElementById('current-year');
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }
});

/* ==========================================================================
   1. APPLE FRAME MOTION SCROLL REVEAL ENGINE
   ========================================================================== */
function initFrameMotion() {
  const revealElements = document.querySelectorAll('.reveal-elem');
  
  if (!('IntersectionObserver' in window)) {
    revealElements.forEach(el => el.classList.add('revealed'));
    return;
  }

  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -60px 0px',
    threshold: 0.12
  };

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        obs.unobserve(entry.target);
      }
    });
  }, observerOptions);

  revealElements.forEach(el => observer.observe(el));
}

/* ==========================================================================
   2. ANIMATED NUMBER COUNTERS
   ========================================================================== */
function initNumberCounters() {
  const counters = document.querySelectorAll('[data-counter]');
  if (!counters.length) return;

  const counterObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const targetVal = parseInt(el.getAttribute('data-counter'), 10) || 0;
        const suffix = el.getAttribute('data-suffix') || '';
        animateValue(el, 0, targetVal, 1600, suffix);
        obs.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(c => counterObserver.observe(c));
}

function animateValue(obj, start, end, duration, suffix = '') {
  let startTimestamp = null;
  const step = (timestamp) => {
    if (!startTimestamp) startTimestamp = timestamp;
    const progress = Math.min((timestamp - startTimestamp) / duration, 1);
    // Apple ease-out cubic
    const easeProgress = 1 - Math.pow(1 - progress, 3);
    const currentVal = Math.floor(easeProgress * (end - start) + start);
    obj.textContent = currentVal + suffix;
    if (progress < 1) {
      window.requestAnimationFrame(step);
    } else {
      obj.textContent = end + suffix;
    }
  };
  window.requestAnimationFrame(step);
}

/* ==========================================================================
   3. SCROLL PROGRESS & STICKY NAVBAR
   ========================================================================== */
function initScrollHeader() {
  const progressBar = document.getElementById('scroll-progress');
  const nav = document.getElementById('main-nav');

  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    
    // Progress Bar
    if (progressBar && scrollHeight > 0) {
      const scrollPercent = (scrollTop / scrollHeight) * 100;
      progressBar.style.width = scrollPercent + '%';
    }

    // Sticky Nav Shifting
    if (nav) {
      if (scrollTop > 40) {
        nav.classList.add('scrolled');
      } else {
        nav.classList.remove('scrolled');
      }
    }
  }, { passive: true });
}

/* ==========================================================================
   4. PRICING CATEGORY TABS
   ========================================================================== */
function initPricingTabs() {
  const tabs = document.querySelectorAll('.cat-tab');
  const panes = document.querySelectorAll('.pricing-tab-pane');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      panes.forEach(p => p.classList.remove('active'));

      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');
      const targetPane = document.getElementById(tab.getAttribute('data-target'));
      if (targetPane) {
        targetPane.classList.add('active');
      }
    });
  });
}

/* ==========================================================================
   5. CURRENCY TOGGLE (INR / USD)
   ========================================================================== */
let currentCurrency = 'INR';

function initCurrencyToggle() {
  const btnInr = document.getElementById('curr-inr');
  const btnUsd = document.getElementById('curr-usd');

  if (!btnInr || !btnUsd) return;

  const setCurrency = (curr) => {
    currentCurrency = curr;
    btnInr.classList.toggle('active', curr === 'INR');
    btnUsd.classList.toggle('active', curr === 'USD');

    // Update all price tags with data-inr and data-usd
    const priceElements = document.querySelectorAll('.price-val');
    priceElements.forEach(el => {
      const val = curr === 'INR' ? el.getAttribute('data-inr') : el.getAttribute('data-usd');
      if (val) {
        el.textContent = val;
      }
    });

    // Recalculate dynamic scope calculator
    calculateTotal();
  };

  btnInr.addEventListener('click', () => setCurrency('INR'));
  btnUsd.addEventListener('click', () => setCurrency('USD'));
}

/* ==========================================================================
   6. INTERACTIVE SCOPE & PRICE CALCULATOR
   ========================================================================== */
function initPriceCalculator() {
  const sliderReels = document.getElementById('slider-reels');
  const sliderLongform = document.getElementById('slider-longform');
  const valReels = document.getElementById('val-reels');
  const valLongform = document.getElementById('val-longform');

  const chkMotion = document.getElementById('chk-motion');
  const chkAds = document.getElementById('chk-ads');
  const chkSound = document.getElementById('chk-sound');
  const chkRush = document.getElementById('chk-rush');

  if (!sliderReels || !sliderLongform) return;

  const updateSliderDisplays = () => {
    valReels.textContent = `${sliderReels.value} Reel${sliderReels.value == 1 ? '' : 's'}`;
    valLongform.textContent = `${sliderLongform.value} Min${sliderLongform.value == 1 ? '' : 's'}`;
    calculateTotal();
  };

  sliderReels.addEventListener('input', updateSliderDisplays);
  sliderLongform.addEventListener('input', updateSliderDisplays);

  [chkMotion, chkAds, chkSound, chkRush].forEach(chk => {
    if (chk) chk.addEventListener('change', calculateTotal);
  });

  // Initial Calculation
  calculateTotal();
}

function calculateTotal() {
  const sliderReels = document.getElementById('slider-reels');
  const sliderLongform = document.getElementById('slider-longform');
  if (!sliderReels || !sliderLongform) return;

  const reelsCount = parseInt(sliderReels.value, 10);
  const longformMins = parseInt(sliderLongform.value, 10);

  const chkMotion = document.getElementById('chk-motion')?.checked;
  const chkAds = document.getElementById('chk-ads')?.checked;
  const chkSound = document.getElementById('chk-sound')?.checked;
  const chkRush = document.getElementById('chk-rush')?.checked;

  // Rate Cards
  // INR Base Rates: Reel = ₹2,400, Longform Min = ₹1,000
  // USD Base Rates: Reel = $32, Longform Min = $14
  const rateReel = currentCurrency === 'INR' ? 2400 : 32;
  const rateLongform = currentCurrency === 'INR' ? 1000 : 14;

  const rateMotion = currentCurrency === 'INR' ? 5000 : 65;
  const rateAds = currentCurrency === 'INR' ? 15000 : 195;
  const rateSound = currentCurrency === 'INR' ? 3500 : 45;

  const costReels = reelsCount * rateReel;
  const costLongform = longformMins * rateLongform;

  let costAddons = 0;
  if (chkMotion) costAddons += rateMotion;
  if (chkAds) costAddons += rateAds;
  if (chkSound) costAddons += rateSound;

  let subtotal = costReels + costLongform + costAddons;
  if (chkRush) {
    subtotal = Math.round(subtotal * 1.25);
  }

  // Format Currencies
  const symbol = currentCurrency === 'INR' ? '₹' : '$';
  const formatNum = (num) => symbol + num.toLocaleString();

  // Update UI Elements
  const totalDisplay = document.getElementById('calc-total-display');
  const breakReels = document.getElementById('break-reels');
  const breakLong = document.getElementById('break-long');
  const breakAddons = document.getElementById('break-addons');
  const waBtn = document.getElementById('calc-whatsapp-btn');

  if (totalDisplay) totalDisplay.textContent = formatNum(subtotal);
  if (breakReels) breakReels.textContent = formatNum(costReels);
  if (breakLong) breakLong.textContent = formatNum(costLongform);
  if (breakAddons) breakAddons.textContent = formatNum(costAddons);

  // Generate Dynamic WhatsApp Message with Scope Details
  if (waBtn) {
    const addonsList = [];
    if (chkMotion) addonsList.push("2.5D Motion Graphics");
    if (chkAds) addonsList.push("Meta Ads Setup");
    if (chkSound) addonsList.push("Sound Master");
    if (chkRush) addonsList.push("24h Rush Priority");

    const addonsText = addonsList.length ? addonsList.join(", ") : "Standard";
    const waText = encodeURIComponent(
      `Hi Muhammed Mirshad, I customized a project package on your portfolio:\n\n` +
      `📹 Reels: ${reelsCount}x\n` +
      `🎬 Long-form: ${longformMins} mins\n` +
      `⚡ Addons: ${addonsText}\n` +
      `💰 Estimated Scope: ${formatNum(subtotal)}\n\n` +
      `Let's discuss timelines and deliverables!`
    );
    waBtn.href = `https://wa.me/917510713036?text=${waText}`;
  }
}

/* ==========================================================================
   7. LIVE CLOCK (KERALA, INDIA - IST)
   ========================================================================== */
function initLiveClock() {
  const clockElem = document.getElementById('live-ist-time');
  if (!clockElem) return;

  function updateClock() {
    const now = new Date();
    const options = {
      timeZone: 'Asia/Kolkata',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    };
    const timeStr = new Intl.DateTimeFormat('en-US', options).format(now);
    clockElem.textContent = `${timeStr} IST • Kerala, India`;
  }

  updateClock();
  setInterval(updateClock, 1000);
}

/* ==========================================================================
   8. TOAST NOTIFICATION SYSTEM & CLIPBOARD HELPERS
   ========================================================================== */
function showToast(message, icon = 'fa-check') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<i class="fa-solid ${icon}"></i> <span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(15px)';
    setTimeout(() => toast.remove(), 300);
  }, 2500);
}

function initClipboardButtons() {
  const copyButtons = document.querySelectorAll('.copy-btn');
  copyButtons.forEach(btn => {
    btn.addEventListener('click', async () => {
      const textToCopy = btn.getAttribute('data-copy');
      if (!textToCopy) return;

      try {
        await navigator.clipboard.writeText(textToCopy);
        showToast(`Copied to clipboard: ${textToCopy}`);
      } catch (err) {
        const textarea = document.createElement('textarea');
        textarea.value = textToCopy;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        showToast(`Copied: ${textToCopy}`);
      }
    });
  });
}

/* ==========================================================================
   9. VCARD (.VCF) GENERATOR & DOWNLOAD
   ========================================================================== */
function initVCardDownload() {
  const saveBtn = document.getElementById('btn-save-contact');
  if (!saveBtn) return;

  saveBtn.addEventListener('click', () => {
    const vCardData = [
      'BEGIN:VCARD',
      'VERSION:3.0',
      'N:Mirshad;Muhammed;;;',
      'FN:Muhammed Mirshad',
      'NICKNAME:Mirshad',
      'ORG:KKL;KAE Production;KAE Advertise;Foreignbites India',
      'TITLE:Managing Director / Founder',
      'BDAY:2009-03-31',
      'EMAIL;type=INTERNET;type=pref:muhammedmirshad31032009@gmail.com',
      'EMAIL;type=INTERNET:mirshad310320092@gmail.com',
      'TEL;type=CELL;type=pref:+917510713036',
      'TEL;type=CELL:+917510910260',
      'URL:https://www.linkedin.com/in/mirshad2009',
      'NOTE:Managing Director of KKL | Founder of KAE Production, KAE Advertise, and Foreignbites India. Electrical & Electronics Engineering Student @ Ma\'din College.',
      'END:VCARD'
    ].join('\r\n');

    const blob = new Blob([vCardData], { type: 'text/vcard;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'Muhammed_Mirshad.vcf');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    showToast('Contact card downloaded! Open to save.');
  });
}

/* ==========================================================================
   10. QR CODE MODAL & GENERATOR
   ========================================================================== */
function initQrModal() {
  const qrBtn = document.getElementById('btn-qr');
  const qrBtnOpen = document.getElementById('btn-qr-open');
  const modal = document.getElementById('qr-modal');
  const closeBtn = document.getElementById('modal-close');
  const copyUrlBtn = document.getElementById('btn-copy-page-url');
  const qrContainer = document.getElementById('qrcode-container');

  if (!modal) return;

  const openModal = () => {
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    renderQRCode(qrContainer);
  };

  const closeModal = () => {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
  };

  if (qrBtn) qrBtn.addEventListener('click', openModal);
  if (qrBtnOpen) qrBtnOpen.addEventListener('click', openModal);
  if (closeBtn) closeBtn.addEventListener('click', closeModal);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  if (copyUrlBtn) {
    copyUrlBtn.addEventListener('click', async () => {
      const url = window.location.href || 'https://www.linkedin.com/in/mirshad2009';
      try {
        await navigator.clipboard.writeText(url);
        showToast('Profile link copied!');
      } catch (e) {
        showToast('Link ready to share!');
      }
    });
  }
}

function renderQRCode(container) {
  if (!container) return;
  const currentUrl = encodeURIComponent(window.location.href && window.location.href.startsWith('http') ? window.location.href : 'https://www.linkedin.com/in/mirshad2009');
  
  container.innerHTML = `
    <img src="https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${currentUrl}&margin=4&color=050608" 
         alt="QR Code to Muhammed Mirshad Profile" 
         style="width:100%; height:100%; object-fit:contain; border-radius: 6px;" 
         onerror="this.onerror=null; this.src='https://chart.googleapis.com/chart?chs=180x180&cht=qr&chl=${currentUrl}&choe=UTF-8';" />
  `;
}

/* ==========================================================================
   11. NATIVE WEB SHARE & FALLBACK
   ========================================================================== */
function initShareAction() {
  const shareBtn = document.getElementById('btn-share');
  if (!shareBtn) return;

  shareBtn.addEventListener('click', async () => {
    const shareData = {
      title: 'Muhammed Mirshad - Creative & Growth Suite',
      text: 'Muhammed Mirshad | Managing Director @ KKL | Founder @ KAE Production, KAE Advertise & Foreignbites India:',
      url: window.location.href && window.location.href.startsWith('http') ? window.location.href : 'https://www.linkedin.com/in/mirshad2009'
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        if (err.name !== 'AbortError') {
          copyDirectProfileLink();
        }
      }
    } else {
      copyDirectProfileLink();
    }
  });
}

function copyDirectProfileLink() {
  const currentUrl = window.location.href;
  navigator.clipboard.writeText(currentUrl).then(() => {
    showToast('Profile link copied to clipboard!');
  }).catch(() => {
    showToast('Link ready to share!');
  });
}
