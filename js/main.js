/**
 * PT Sekawan Tunggal Jaya (STJ) - Interactive Engine
 * Handling Calculator, Filters, Modals, FAQs, Stats Animation & WhatsApp Linker
 */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initMobileNav();
  initUnitFilter();
  initCalculator();
  initUnitModals();
  initConsultationModal();
  initFaqAccordion();
  initStatsCounter();
  initScrollSpy();
});

// ==========================================
// 1. THEME SWITCHER (Light / Dark)
// ==========================================
function initTheme() {
  const themeToggle = document.getElementById('theme-toggle');
  const savedTheme = localStorage.getItem('stj-theme') || 'light';
  
  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme);

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('stj-theme', newTheme);
      updateThemeIcon(newTheme);
      showToast(`Mode ${newTheme === 'dark' ? 'Gelap' : 'Terang'} diaktifkan`);
    });
  }
}

function updateThemeIcon(theme) {
  const toggle = document.getElementById('theme-toggle');
  if (!toggle) return;
  if (theme === 'dark') {
    toggle.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`;
  } else {
    toggle.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>`;
  }
}

// ==========================================
// 2. MOBILE NAVIGATION
// ==========================================
function initMobileNav() {
  const mobileBtn = document.getElementById('mobile-toggle');
  const drawer = document.getElementById('mobile-drawer');
  const navLinks = document.querySelectorAll('.mobile-nav-link');

  if (mobileBtn && drawer) {
    mobileBtn.addEventListener('click', () => {
      drawer.classList.toggle('active');
    });

    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        drawer.classList.remove('active');
      });
    });
  }
}

// ==========================================
// 3. UNIT USAHA CATEGORY FILTER
// ==========================================
function initUnitFilter() {
  const filterBtns = document.querySelectorAll('.filter-tab');
  const unitCards = document.querySelectorAll('.unit-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      unitCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 20);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(15px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 250);
        }
      });
    });
  });
}

// ==========================================
// 4. INTERACTIVE INVESTMENT CALCULATOR
// ==========================================
const UNIT_ROI = {
  ac: { name: 'Sekawan Teknik Jaya AC', rate: 0.16, risk: 'Rendah - Terukur' },
  trans: { name: 'Sekawan Teknik Jaya Trans', rate: 0.19, risk: 'Moderat' },
  laundry: { name: 'Enjoy Laundry', rate: 0.175, risk: 'Rendah - Stabil' },
  syariah: { name: 'Enjoy Syariah', rate: 0.165, risk: 'Rendah - Syariah' },
  teh: { name: 'Teh Tarik Enjoy', rate: 0.215, risk: 'Moderat - High Growth' },
  campuran: { name: 'Portofolio Diversifikasi', rate: 0.18, risk: 'Tersebar Seimbang' }
};

function formatIDR(val) {
  return 'Rp ' + Math.round(val).toLocaleString('id-ID');
}

function initCalculator() {
  const amountInput = document.getElementById('calc-amount');
  const amountRange = document.getElementById('calc-range');
  const durationSelect = document.getElementById('calc-duration');
  const unitSelect = document.getElementById('calc-unit');
  const chips = document.querySelectorAll('.calc-chip');
  
  const resModal = document.getElementById('res-modal');
  const resModalLive = document.getElementById('res-modal-live');
  const resReturn = document.getElementById('res-return');
  const resMonthly = document.getElementById('res-monthly');
  const resTotal = document.getElementById('res-total');
  const resRateBadge = document.getElementById('res-rate-badge');
  const calcWaBtn = document.getElementById('calc-wa-btn');

  function calculate() {
    let principal = parseFloat(amountInput.value) || 10000000;
    if (principal < 1000000) principal = 1000000;
    
    // Sync range slider if within range
    if (amountRange && principal <= 100000000) {
      amountRange.value = principal;
    }

    const durationYears = parseFloat(durationSelect ? durationSelect.value : 1) || 1;
    const selectedKey = unitSelect ? unitSelect.value : 'ac';
    const unitConfig = UNIT_ROI[selectedKey] || UNIT_ROI.ac;
    const annualRate = unitConfig.rate;

    // Projected simple profit over duration
    const totalProfit = principal * annualRate * durationYears;
    const monthlyProfit = (principal * annualRate) / 12;
    const grandTotal = principal + totalProfit;

    if (resModalLive) resModalLive.textContent = formatIDR(principal);
    if (resModal) resModal.textContent = formatIDR(principal);
    if (resReturn) resReturn.textContent = formatIDR(totalProfit);
    if (resMonthly) resMonthly.textContent = formatIDR(monthlyProfit);
    if (resTotal) resTotal.textContent = formatIDR(grandTotal);
    if (resRateBadge) resRateBadge.textContent = `${(annualRate * 100).toFixed(1)}% p.a.`;

    // WhatsApp Direct Link with Pre-filled Calculation
    if (calcWaBtn) {
      const durText = durationSelect ? durationSelect.options[durationSelect.selectedIndex].text : `${durationYears} Tahun`;
      const waMessage = `Halo Admin PT Sekawan Tunggal Jaya, saya ingin konsultasi simulasi investasi:
- Unit Usaha: ${unitConfig.name}
- Modal Awal: ${formatIDR(principal)}
- Durasi: ${durText}
- Estimasi Hasil: ${formatIDR(totalProfit)} (±${(annualRate * 100).toFixed(1)}% per tahun)
- Total Estimasi Akhir: ${formatIDR(grandTotal)}

Mohon informasi ketersediaan slot & prospektus lengkap. Terima kasih.`;
      calcWaBtn.href = `https://wa.me/628775211123?text=${encodeURIComponent(waMessage)}`;
    }
  }

  // Event Listeners for calculator
  if (amountInput) {
    amountInput.addEventListener('input', () => {
      calculate();
      updateChipActive(amountInput.value);
    });
  }

  if (amountRange) {
    amountRange.addEventListener('input', () => {
      if (amountInput) amountInput.value = amountRange.value;
      calculate();
      updateChipActive(amountRange.value);
    });
  }

  if (durationSelect) durationSelect.addEventListener('change', calculate);
  if (unitSelect) unitSelect.addEventListener('change', calculate);

  // Chips click handlers
  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      chips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      const val = chip.getAttribute('data-val');
      if (amountInput) amountInput.value = val;
      if (amountRange && parseFloat(val) <= 100000000) amountRange.value = val;
      calculate();
    });
  });

  function updateChipActive(currentVal) {
    chips.forEach(chip => {
      if (chip.getAttribute('data-val') === String(currentVal)) {
        chip.classList.add('active');
      } else {
        chip.classList.remove('active');
      }
    });
  }

  // Initial run
  calculate();
}

// ==========================================
// 5. UNIT MODALS & DETAILS
// ==========================================
const UNIT_DETAILS_DATA = {
  ac: {
    logo: 'img/logo-ac.png',
    title: 'Sekawan Teknik Jaya AC',
    category: 'Teknik, Servis & Pengadaan',
    roi: '14% - 18% / tahun',
    risk: 'Rendah - Terukur',
    minInvest: 'Rp 5.000.000',
    tenor: '12 - 36 Bulan',
    payout: 'Bulanan (Setiap Tanggal 5)',
    desc: 'Sekawan Teknik Jaya AC melayani pengadaan, instalasi, dan pemeliharaan pendingin ruangan (HVAC) untuk sektor residensial, perkantoran komersial, rumah sakit, serta pabrik industri. Kontrak pemeliharaan berkala tahunan (B2B maintenance contract) memberikan arus kas stabil dan prediktif.',
    highlights: [
      'Memiliki lebih dari 120+ mitra kontrak korporat aktif',
      'Tim teknisi bersertifikasi BNSP & standar operasional ketat',
      'Permintaan perawatan AC konsisten tinggi sepanjang tahun di iklim tropis',
      'Margin operasional sehat dengan perputaran spare parts cepat'
    ]
  },
  trans: {
    logo: 'img/logo-trans.png',
    title: 'Sekawan Teknik Jaya Trans (STJ Trans)',
    category: 'Transportasi & Logistik Armada',
    roi: '16% - 22% / tahun',
    risk: 'Moderat',
    minInvest: 'Rp 10.000.000',
    tenor: '12 - 48 Bulan',
    payout: 'Bulanan / Kuartalan',
    desc: 'STJ Trans mengoperasikan unit armada transportasi pariwisata eksekutif, sewa kendaraan dinas korporasi jangka panjang, dan jasa kargo logistik intercity. Dilengkapi sistem fleet GPS telemetry canggih dan asuransi komprehensif.',
    highlights: [
      'Armada modern terawat dengan rute strategis Jawa - Bali',
      'Kontrak sewa armada jangka panjang dengan instansi & korporasi B2B',
      'Proteksi aset dengan asuransi all-risk dan monitoring GPS 24/7',
      'Tingkat okupansi pariwisata dan charter di atas 75% per tahun'
    ]
  },
  laundry: {
    logo: 'img/logo-laundry.png',
    title: 'Enjoy Laundry',
    category: 'Lifestyle & Retail Service',
    roi: '15% - 20% / tahun',
    risk: 'Rendah - Stabil',
    minInvest: 'Rp 5.000.000',
    tenor: '12 - 24 Bulan',
    payout: 'Bulanan',
    desc: 'Enjoy Laundry menghadirkan layanan binatu modern, ramah lingkungan, higienis, dan cepat untuk perumahan padat, kos-kosan, serta seragam industri/klinik. Menggunakan mesin komersial heavy-duty dengan efisiensi energi tinggi.',
    highlights: [
      'Model bisnis cash flow harian dengan repeat order konsumen tinggi',
      'Sistem POS digital terintegrasi mempermudah audit omzet harian',
      'Deterjen ramah lingkungan dengan standar sanitasi higienis',
      'Peluang ekspansi outlet di titik residensial prime Jabodetabek & Banten'
    ]
  },
  syariah: {
    logo: 'img/logo-syariah.png',
    title: 'Enjoy Syariah',
    category: 'Pembiayaan Syariah & Akad Berkah',
    roi: 'Bagi Hasil 14% - 19% (Nisbah Adil)',
    risk: 'Rendah - Syariah Verified',
    minInvest: 'Rp 10.000.000',
    tenor: '12 - 36 Bulan',
    payout: 'Bulanan',
    desc: 'Layanan kemitraan usaha dengan akad Mudharabah / Musyarakah murni tanpa riba, gharar, atau maysir. Keuntungan dibagi secara proporsional sesuai realisasi laba riil usaha yang telah diaudit oleh dewan pengawas syariah.',
    highlights: [
      'Akad transparan berlandaskan syariat Islam yang mengikat secara hukum',
      'Tanpa bunga tetap (riba), mengedepankan asas keadilan & keberkahan',
      'Unit usaha yang didanai 100% halal dan produktif',
      'Laporan pembagian laba riil bulanan yang sangat terbuka'
    ]
  },
  teh: {
    logo: 'img/logo-teh.png',
    title: 'Teh Tarik Enjoy',
    category: 'Food & Beverage Modern',
    roi: '18% - 25% / tahun',
    risk: 'Moderat - High Growth',
    minInvest: 'Rp 5.000.000',
    tenor: '12 - 24 Bulan',
    payout: 'Bulanan',
    desc: 'Gerai minuman teh tarik otentik dengan resep khas racikan teh pilihan, susu lembut, dan berbagai topping kekinian. Memiliki basis pelanggan setia yang kuat dengan margin keuntungan kotor F&B di atas 50%.',
    highlights: [
      'Perputaran modal harian sangat cepat dengan BEP outlet relatif singkat',
      'Standardisasi bahan baku terpusat (central kitchen supply chain)',
      'Brand identitas modern disukai kalangan muda dan keluarga',
      'Pangsa pasar minuman ready-to-drink terus tumbuh signifikan'
    ]
  }
};

function initUnitModals() {
  const modal = document.getElementById('unit-modal');
  const closeBtn = document.getElementById('unit-modal-close');
  const detailButtons = document.querySelectorAll('.open-unit-detail');

  const modalTitle = document.getElementById('modal-unit-title');
  const modalLogo = document.getElementById('modal-unit-logo');
  const modalBadge = document.getElementById('modal-unit-category');
  const modalRoi = document.getElementById('modal-unit-roi');
  const modalRisk = document.getElementById('modal-unit-risk');
  const modalMin = document.getElementById('modal-unit-min');
  const modalTenor = document.getElementById('modal-unit-tenor');
  const modalPayout = document.getElementById('modal-unit-payout');
  const modalDesc = document.getElementById('modal-unit-desc');
  const modalHighlights = document.getElementById('modal-unit-highlights');
  const modalActionBtn = document.getElementById('modal-unit-select-btn');

  let activeUnitKey = 'ac';

  detailButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const key = btn.getAttribute('data-unit') || 'ac';
      activeUnitKey = key;
      const data = UNIT_DETAILS_DATA[key];
      if (!data) return;

      if (modalLogo && data.logo) modalLogo.src = data.logo;
      if (modalTitle) modalTitle.textContent = data.title;
      if (modalBadge) modalBadge.textContent = data.category;
      if (modalRoi) modalRoi.textContent = data.roi;
      if (modalRisk) modalRisk.textContent = data.risk;
      if (modalMin) modalMin.textContent = data.minInvest;
      if (modalTenor) modalTenor.textContent = data.tenor;
      if (modalPayout) modalPayout.textContent = data.payout;
      if (modalDesc) modalDesc.textContent = data.desc;

      if (modalHighlights) {
        modalHighlights.innerHTML = data.highlights
          .map(h => `<li style="display:flex; gap:0.5rem; align-items:flex-start; margin-bottom:0.5rem; font-size:0.88rem; color:var(--text-muted);"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#d49b28" stroke-width="2.5" style="flex-shrink:0; margin-top:2px;"><polyline points="20 6 9 17 4 12"></polyline></svg> <span>${h}</span></li>`)
          .join('');
      }

      if (modal) modal.classList.add('active');
    });
  });

  if (closeBtn && modal) {
    closeBtn.addEventListener('click', () => modal.classList.remove('active'));
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.classList.remove('active');
    });
  }

  if (modalActionBtn) {
    modalActionBtn.addEventListener('click', () => {
      if (modal) modal.classList.remove('active');
      openConsultationWithUnit(activeUnitKey);
    });
  }
}

// ==========================================
// 6. CONSULTATION MODAL & WHATSAPP GENERATOR
// ==========================================
function initConsultationModal() {
  const consultModal = document.getElementById('consult-modal');
  const closeBtn = document.getElementById('consult-modal-close');
  const consultTriggers = document.querySelectorAll('.open-consult-modal');
  const form = document.getElementById('consult-form');

  consultTriggers.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      if (consultModal) consultModal.classList.add('active');
    });
  });

  if (closeBtn && consultModal) {
    closeBtn.addEventListener('click', () => consultModal.classList.remove('active'));
    consultModal.addEventListener('click', (e) => {
      if (e.target === consultModal) consultModal.classList.remove('active');
    });
  }

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('consult-name').value.trim();
      const phone = document.getElementById('consult-phone').value.trim();
      const unit = document.getElementById('consult-unit').value;
      const budget = document.getElementById('consult-budget').value;
      const notes = document.getElementById('consult-notes').value.trim();

      if (!name || !phone) {
        alert('Mohon isi nama dan nomor WhatsApp Anda.');
        return;
      }

      const waMsg = `Halo Tim Advisor PT Sekawan Tunggal Jaya,
Saya ingin berkonsultasi mengenai peluang investasi:
- Nama: ${name}
- No. WhatsApp: ${phone}
- Peminatan Unit: ${unit}
- Rencana Investasi: ${budget}
- Catatan: ${notes || 'Mohon info syarat dan jadwal konsultasi.'}

Terima kasih.`;

      // Redirect to WhatsApp
      const waUrl = `https://wa.me/628775211123?text=${encodeURIComponent(waMsg)}`;
      
      showToast('Membuka WhatsApp untuk konsultasi langsung...');
      if (consultModal) consultModal.classList.remove('active');
      
      setTimeout(() => {
        window.open(waUrl, '_blank');
      }, 400);
    });
  }
}

function openConsultationWithUnit(unitKey) {
  const consultModal = document.getElementById('consult-modal');
  const unitSelect = document.getElementById('consult-unit');
  
  if (unitSelect) {
    const keyMap = {
      ac: 'Sekawan Teknik Jaya AC',
      trans: 'Sekawan Teknik Jaya Trans (STJ Trans)',
      laundry: 'Enjoy Laundry',
      syariah: 'Enjoy Syariah',
      teh: 'Teh Tarik Enjoy'
    };
    if (keyMap[unitKey]) {
      unitSelect.value = keyMap[unitKey];
    }
  }

  if (consultModal) consultModal.classList.add('active');
}

// ==========================================
// 7. FAQ ACCORDION
// ==========================================
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const trigger = item.querySelector('.faq-trigger');
    const content = item.querySelector('.faq-content');

    if (trigger && content) {
      trigger.addEventListener('click', () => {
        const isActive = item.classList.contains('active');

        // Close others for clean accordion experience
        faqItems.forEach(other => {
          other.classList.remove('active');
          const otherContent = other.querySelector('.faq-content');
          if (otherContent) otherContent.style.maxHeight = null;
        });

        if (!isActive) {
          item.classList.add('active');
          content.style.maxHeight = content.scrollHeight + 'px';
        }
      });
    }
  });

  // Open first FAQ by default
  if (faqItems.length > 0) {
    const firstContent = faqItems[0].querySelector('.faq-content');
    faqItems[0].classList.add('active');
    if (firstContent) firstContent.style.maxHeight = firstContent.scrollHeight + 'px';
  }
}

// ==========================================
// 8. STATS COUNTER ANIMATION
// ==========================================
function initStatsCounter() {
  const statElements = document.querySelectorAll('.counter-val');
  let animated = false;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !animated) {
        animated = true;
        statElements.forEach(el => {
          const target = parseFloat(el.getAttribute('data-target'));
          const prefix = el.getAttribute('data-prefix') || '';
          const suffix = el.getAttribute('data-suffix') || '';
          const decimals = parseInt(el.getAttribute('data-decimals') || '0', 10);
          
          let start = 0;
          const duration = 1800;
          const startTime = performance.now();

          function updateNumber(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out cubic
            const easeProgress = 1 - Math.pow(1 - progress, 3);
            const currentVal = start + (target - start) * easeProgress;

            el.textContent = `${prefix}${currentVal.toFixed(decimals)}${suffix}`;

            if (progress < 1) {
              requestAnimationFrame(updateNumber);
            } else {
              el.textContent = `${prefix}${target.toFixed(decimals)}${suffix}`;
            }
          }
          requestAnimationFrame(updateNumber);
        });
      }
    });
  }, { threshold: 0.3 });

  const trackSection = document.getElementById('kinerja');
  if (trackSection) observer.observe(trackSection);
}

// ==========================================
// 9. SCROLL SPY FOR NAVIGATION
// ==========================================
function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    let current = '';
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop - 120;
      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });
}

// ==========================================
// 10. TOAST NOTIFICATION UTILITY
// ==========================================
function showToast(message) {
  let toast = document.getElementById('toast-notice');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast-notice';
    toast.className = 'toast-notice';
    document.body.appendChild(toast);
  }

  toast.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#d49b28" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg> <span>${message}</span>`;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 3200);
}
