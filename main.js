/* ============================================================
   MALIK IRTEZA – PORTFOLIO  |  main.js
   Three.js hero, tech-sphere, GSAP scroll, all interactivity
============================================================ */

'use strict';

/* ============================================================
   0. WAIT FOR DOM
============================================================ */
document.addEventListener('DOMContentLoaded', () => {

  // ================= MIGRATION MODAL & ANNOUNCEMENT BAR =================
  // Show modal only once per session
  const migrationModal = document.getElementById('migrationModal');
  const migrationCta = document.getElementById('migrationCta');
  const migrationClose = document.getElementById('migrationClose');
  const migrationCountdown = document.getElementById('migrationCountdown');
  const ANNOUNCE_KEY = 'migrationModalShown';
  let countdown = 5;

  function openMigrationModal() {
    migrationModal.classList.add('open');
    document.body.style.overflow = 'hidden';
    if (typeof gsap !== 'undefined') {
      gsap.fromTo('.migration-content', { y: 60, opacity: 0, scale: 0.92 }, { y: 0, opacity: 1, scale: 1, duration: 0.7, ease: 'power3.out' });
      gsap.fromTo('.migration-cta', { boxShadow: '0 0 0 0 transparent' }, { boxShadow: '0 0 40px 8px #a855f7, 0 0 80px 16px #6366f1', duration: 1.2, repeat: -1, yoyo: true, ease: 'power1.inOut' });
    }
    // Countdown
    countdown = 5;
    migrationCountdown.textContent = `Redirecting in ${countdown} seconds...`;
    const timer = setInterval(() => {
      countdown--;
      migrationCountdown.textContent = `Redirecting in ${countdown} seconds...`;
      if (countdown <= 0) {
        clearInterval(timer);
        fadeRedirect();
      }
    }, 1000);
    migrationModal.dataset.timer = timer;
  }

  function closeMigrationModal() {
    migrationModal.classList.remove('open');
    document.body.style.overflow = '';
    migrationCountdown.textContent = '';
    if (migrationModal.dataset.timer) clearInterval(migrationModal.dataset.timer);
    localStorage.setItem(ANNOUNCE_KEY, '1');
  }

  function fadeRedirect() {
    if (typeof gsap !== 'undefined') {
      gsap.to('body', { opacity: 0, duration: 0.7, onComplete: () => { window.location.href = 'https://malikirteza.com'; } });
    } else {
      window.location.href = 'https://malikirteza.com';
    }
  }

  // Open modal if not shown this session
  if (!localStorage.getItem(ANNOUNCE_KEY)) {
    setTimeout(openMigrationModal, 900);
  }

  migrationCta.addEventListener('click', fadeRedirect);
  migrationClose.addEventListener('click', closeMigrationModal);
  migrationModal.querySelector('.migration-backdrop').addEventListener('click', closeMigrationModal);
  document.addEventListener('keydown', e => { if (migrationModal.classList.contains('open') && e.key === 'Escape') closeMigrationModal(); });

  // Announcement bar GSAP entrance
  if (typeof gsap !== 'undefined') {
    gsap.from('.announcement-bar', { y: -40, opacity: 0, duration: 0.8, ease: 'power3.out' });
  }

  // ================= MIGRATION: UPDATE ALL BUTTONS & LINKS =================
  // Utility to update all major CTAs, nav, footer, homepage, and contact buttons
  function updateAllCtas() {
    // Hero section
    const heroCtas = document.querySelectorAll('.hero-ctas .btn, .about-actions .btn-primary, .about-actions .btn-ghost');
    heroCtas.forEach(btn => {
      if (btn.textContent.match(/work|started|visit|learn|talk|contact|hire|open/i)) {
        btn.innerHTML = '<span>Visit New Website</span><i class="fa fa-arrow-up-right-from-square"></i>';
      } else {
        btn.innerHTML = '<span>Open New Website</span><i class="fa fa-arrow-up-right-from-square"></i>';
      }
      btn.onclick = e => { e.preventDefault(); fadeRedirect(); };
    });

    // Navbar CTA
    const navCta = document.querySelector('.nav-cta');
    if (navCta) {
      navCta.innerHTML = '<span>Visit New Website</span><i class="fa fa-arrow-up-right-from-square"></i>';
      navCta.onclick = e => { e.preventDefault(); fadeRedirect(); };
    }

    // Footer links
    document.querySelectorAll('.footer-links-col a, .footer-contact-col a, .footer-socials a').forEach(link => {
      link.onclick = e => { e.preventDefault(); fadeRedirect(); };
      link.setAttribute('href', 'https://malikirteza.com');
      link.setAttribute('target', '_blank');
      link.setAttribute('rel', 'noopener');
    });

    // WhatsApp FAB
    const waFab = document.querySelector('.wa-fab');
    if (waFab) {
      waFab.onclick = e => { e.preventDefault(); fadeRedirect(); };
      waFab.setAttribute('href', 'https://malikirteza.com');
    }

    // Contact section CTAs
    const hireBtn = document.getElementById('hireBtn');
    if (hireBtn) {
      hireBtn.innerHTML = '<span>Visit New Website</span><i class="fa fa-arrow-up-right-from-square"></i>';
      hireBtn.onclick = e => { e.preventDefault(); fadeRedirect(); };
      hireBtn.setAttribute('href', 'https://malikirteza.com');
    }
    const whatsappBtn = document.getElementById('whatsappBtn');
    if (whatsappBtn) {
      whatsappBtn.innerHTML = '<i class="fab fa-whatsapp whatsapp-icon"></i><span>Visit New Website</span><div class="wa-pulse"></div>';
      whatsappBtn.onclick = e => { e.preventDefault(); fadeRedirect(); };
      whatsappBtn.setAttribute('href', 'https://malikirteza.com');
    }

    // Project modal CTA
    const observer = new MutationObserver(() => {
      document.querySelectorAll('.modal-cta a').forEach(a => {
        a.innerHTML = '<span>Visit New Website</span><i class="fa fa-arrow-up-right-from-square"></i>';
        a.onclick = e => { e.preventDefault(); fadeRedirect(); };
        a.setAttribute('href', 'https://malikirteza.com');
        a.setAttribute('target', '_blank');
        a.setAttribute('rel', 'noopener');
      });
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }
  updateAllCtas();

  /* ============================================================
     1. PAGE LOADER
  ============================================================ */
  const loader = document.getElementById('loader');
  const percentEl = document.getElementById('loaderPercent');
  document.body.classList.add('loading');
  let loaderAnimFrame;

  /* ── Animate loader percentage ── */
  let currPct = 0;
  function updateLoaderText() {
    currPct += (100 - currPct) * 0.05;
    if (percentEl) percentEl.textContent = Math.floor(currPct) + '%';
    if (currPct < 99.5) requestAnimationFrame(updateLoaderText);
    else if (percentEl) percentEl.textContent = '100%';
  }
  requestAnimationFrame(updateLoaderText);

  /* ── Three.js loader background ── */
  function initLoaderCanvas() {
    const canvas = document.getElementById('loader-canvas');
    if (!canvas || typeof THREE === 'undefined') return;
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.z = 5;

    // Create energetic particle field
    const ptCount = 400;
    const ptGeo = new THREE.BufferGeometry();
    const pos = new Float32Array(ptCount * 3);
    for (let i = 0; i < ptCount * 3; i++) {
      pos[i] = (Math.random() - 0.5) * 15;
    }
    ptGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const ptMat = new THREE.PointsMaterial({
      size: 0.05,
      color: 0xa855f7,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending
    });
    const pts = new THREE.Points(ptGeo, ptMat);
    scene.add(pts);

    function animateLoader() {
      loaderAnimFrame = requestAnimationFrame(animateLoader);
      pts.rotation.y += 0.002;
      pts.rotation.x += 0.001;
      pts.position.z = Math.sin(performance.now() * 0.001) * 0.5;
      renderer.render(scene, camera);
    }
    animateLoader();

    window.addEventListener('resize', () => {
      if (!loader.classList.contains('hidden')) {
        renderer.setSize(window.innerWidth, window.innerHeight);
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
      }
    });
  }
  initLoaderCanvas();

  /* ── Run reveal + counters immediately, do NOT wait for CDNs ── */
  setTimeout(() => {
    initReveal();
    initCounters();
  }, 400);

  /* ── Safety net: force-reveal EVERYTHING after 3.5 s regardless ── */
  setTimeout(() => {
    document.querySelectorAll('[data-reveal]').forEach(el => el.classList.add('revealed'));
  }, 3500);

  /* ── Loader hide + 3D/GSAP init after window.load ── */
  function startHeavy() {
    loader.classList.add('hidden');
    document.body.classList.remove('loading');
    if (loaderAnimFrame) cancelAnimationFrame(loaderAnimFrame);
    initHeroCanvas();
    initTechSphere();
    initGSAP();
  }
  window.addEventListener('load', () => setTimeout(startHeavy, 2400));
  /* Backup: if window.load never fires (CDN timeout) run after 7 s */
  setTimeout(() => {
    if (!loader.classList.contains('hidden')) startHeavy();
  }, 7000);

  /* ============================================================
     2. CUSTOM CURSOR
  ============================================================ */
  const dot  = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');
  let mx = 0, my = 0, rx = 0, ry = 0;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    dot.style.left = mx + 'px';
    dot.style.top  = my + 'px';
  });

  (function animCursor() {
    rx += (mx - rx) * 0.14;
    ry += (my - ry) * 0.14;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    requestAnimationFrame(animCursor);
  })();

  document.querySelectorAll('a, button, .service-card, .project-card, .filter-btn, .t-btn').forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-expanded'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-expanded'));
  });

  /* ============================================================
     3. NAVBAR SCROLL + ACTIVE
  ============================================================ */
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
    updateActiveNav();
  });

  function updateActiveNav() {
    let current = '';
    sections.forEach(s => {
      if (window.scrollY >= s.offsetTop - 200) current = s.id;
    });
    navLinks.forEach(l => {
      l.classList.toggle('active', l.dataset.section === current);
    });
  }

  /* hamburger */
  const hamburger = document.getElementById('hamburger');
  const navList   = document.getElementById('navLinks');
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navList.classList.toggle('open');
  });
  navList.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navList.classList.remove('open');
  }));

  /* ============================================================
     4. PROJECTS DATA
  ============================================================ */
  const projects = [
    {
      id:1, category:'web', name:'ZaibunTech Digital', emoji:'🚀', color:'#6366f1',
      desc:'Complete digital overhaul for a top Lahore-based marketing agency — bilingual Urdu/English CMS, animated case studies, and WhatsApp lead capture.',
      stack:['Next.js','GSAP','Node.js','MongoDB','WordPress'],
      long:'ZaibunTech needed a world-class digital presence to compete internationally. Delivered a blazing-fast Urdu/English website with custom admin CMS, cinematic scroll animations, WhatsApp lead-capture integration, and SEO-optimised architecture. Organic traffic grew 320% within 60 days of launch, and the client landed 3 major corporate contracts directly from the new site.'
    },
    {
      id:2, category:'web', name:'HalalBazaar PK', emoji:'🛒', color:'#22c55e',
      desc:'Pakistan\'s premier multi-vendor Halal e-commerce platform connecting artisans & vendors across Karachi, Lahore & Islamabad with nationwide buyers.',
      stack:['React','Node.js','MongoDB','JazzCash','Redis'],
      long:'HalalBazaar is built for the Pakistani market with Urdu product listings, JazzCash/Easypaisa/COD payment options, automated SMS order notifications, and a seller dashboard with real-time revenue analytics. 500+ active vendors onboarded within the first quarter, processing over PKR 2 crore in monthly transactions.'
    },
    {
      id:3, category:'software', name:'Dastarkhan POS', emoji:'🍽️', color:'#f97316',
      desc:'All-in-one Point-of-Sale & delivery management system deployed across 12 restaurant branches in Karachi and Lahore.',
      stack:['Electron','React','Node.js','SQLite','Python'],
      long:'Dastarkhan POS replaced chaotic paper-based ordering across a Pakistani restaurant chain. Features include kitchen display system, table & rider management, Urdu receipt printing, FBR tax integration, and automated end-of-day reports. Reduced order errors by 91% and cut customer wait times by 40% across all branches.'
    },
    {
      id:4, category:'security', name:'SecureGov PK', emoji:'🔐', color:'#f43f5e',
      desc:'Full-scope cybersecurity audit and zero-trust infrastructure hardening for a federal government department portal in Islamabad.',
      stack:['Python','Metasploit','OWASP','Nessus','Wireshark'],
      long:'Performed comprehensive penetration testing on a sensitive government web portal handling citizen data. Discovered and patched 23 critical vulnerabilities including SQL injection, CSRF, and exposed admin endpoints. Implemented WAF rules, mandatory HTTPS, rate-limiting, and trained the 15-person IT team on ongoing security hygiene — leaving the portal audit-ready and fully hardened.'
    },
    {
      id:5, category:'ai', name:'UrduGPT Assistant', emoji:'🧠', color:'#a855f7',
      desc:'Custom Urdu-language AI chatbot deployed for a Pakistani telecom — handles 10,000+ customer queries per day in Roman Urdu and Urdu script.',
      stack:['Python','OpenAI','LangChain','FastAPI','PostgreSQL'],
      long:'UrduGPT is a GPT-4 powered assistant fine-tuned on Pakistani telecom knowledge with a RAG pipeline over internal documentation. It handles billing queries, package recommendations, and escalations in both Roman Urdu and native script — reducing human agent workload by 68% and cutting average query resolution time from 8 minutes to 45 seconds.'
    },
    {
      id:6, category:'web', name:'PropPakistan Portal', emoji:'🏠', color:'#06b6d4',
      desc:'Modern real estate listing portal for Karachi, Lahore & Islamabad — featuring map-based search, AI price valuation, and agent CRM dashboards.',
      stack:['Next.js','Google Maps API','Python ML','PostgreSQL','AWS'],
      long:'PropPakistan connects buyers, sellers and real-estate agents across Pakistan\'s three major cities. An ML price-prediction model trained on 50,000+ local listings provides instant property valuations. Integrated Google Maps for neighbourhood insights, walk-score, and nearby amenities. Premium agent portal with lead management, automated follow-up emails, and monthly performance analytics.'
    },
  ];

  const grid = document.getElementById('projectsGrid');
  projects.forEach(p => {
    const card = document.createElement('div');
    card.className = 'project-card';
    card.dataset.category = p.category;
    card.dataset.id = p.id;
    card.innerHTML = `
      <div class="project-thumb" style="background:linear-gradient(135deg,${p.color}22,${p.color}44)">
        ${p.emoji}
        <div class="project-overlay"><span class="project-overlay-btn">View Details</span></div>
      </div>
      <div class="project-body">
        <div class="project-category">${p.category.toUpperCase()}</div>
        <h3 class="project-name">${p.name}</h3>
        <p class="project-desc">${p.desc}</p>
        <div class="project-stack">${p.stack.map(t=>`<span>${t}</span>`).join('')}</div>
      </div>
    `;
    card.addEventListener('click', () => openModal(p));
    grid.appendChild(card);
  });

  /* Filters */
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const f = btn.dataset.filter;
      document.querySelectorAll('.project-card').forEach(c => {
        c.classList.toggle('hidden', f !== 'all' && c.dataset.category !== f);
      });
    });
  });

  /* Modal */
  const modal        = document.getElementById('projectModal');
  const modalBody    = document.getElementById('modalBody');
  const modalClose   = document.getElementById('modalClose');
  const modalBackdrop = document.getElementById('modalBackdrop');

  function openModal(p) {
    modalBody.innerHTML = `
      <div class="modal-emoji">${p.emoji}</div>
      <div class="modal-cat">${p.category.toUpperCase()}</div>
      <h2 class="modal-title">${p.name}</h2>
      <p class="modal-desc">${p.long}</p>
      <div class="modal-stack">${p.stack.map(t=>`<span>${t}</span>`).join('')}</div>
      <div class="modal-cta">
        <a href="https://wa.me/923162905672?text=I want a project like ${encodeURIComponent(p.name)}" target="_blank" class="btn btn-primary"><span>Build Similar</span><i class="fa fa-arrow-right"></i></a>
      </div>
    `;
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeModal() { modal.classList.remove('open'); document.body.style.overflow = ''; }
  modalClose.addEventListener('click', closeModal);
  modalBackdrop.addEventListener('click', closeModal);
  document.addEventListener('keydown', e => { if(e.key === 'Escape') closeModal(); });

  /* ============================================================
     5. TESTIMONIALS DATA + SLIDER
  ============================================================ */
  const testimonials = [
    { name:'James Whitmore', role:'CEO, TechVenture UK', init:'JW', stars:5, quote:'Malik delivered an absolutely stunning website in record time. The animations and 3D effects blew our whole team away. Best investment we\'ve made.' },
    { name:'Sara Al-Rashid',  role:'Founder, DubaiDesign', init:'SA', stars:5, quote:'I\'ve worked with many developers, but Malik\'s attention to detail and creative vision is unmatched. He turned a rough idea into a masterpiece.' },
    { name:'Daniel Chen',     role:'CTO, SingularityAI',  init:'DC', stars:5, quote:'The AI integration Malik built increased our user engagement by 340%. Clean code, perfect documentation, and exceptional communication.' },
    { name:'Amara Okonkwo',   role:'Marketing Dir, LagosMedia', init:'AO', stars:5, quote:'Our new website has won 3 awards since launch. Malik\'s UI/UX sensibility and technical depth are on another level entirely.' },
    { name:'Lena Müller',     role:'Product Lead, BerlinTech', init:'LM', stars:5, quote:'Malik refactored our entire security stack. Zero downtime, zero vulnerabilities found after audit. Absolutely elite-level work.' },
    { name:'Ahmed Khalil',    role:'Entrepreneur, Riyadh', init:'AK', stars:5, quote:'From concept to launch in 3 weeks. The mobile experience is flawless and our conversion rate doubled within the first month.' },
  ];

  const track = document.getElementById('testimonialsTrack');
  const dotsContainer = document.getElementById('tDots');
  let tIndex = 0;
  let tVisible = getVisibleTestimonials();
  let autoTimer;

  function getVisibleTestimonials() {
    if (window.innerWidth <= 768) return 1;
    if (window.innerWidth <= 1024) return 2;
    return 3;
  }

  testimonials.forEach(t => {
    const stars = '★'.repeat(t.stars);
    const card = document.createElement('div');
    card.className = 'testimonial-card';
    card.innerHTML = `
      <div class="t-stars">${stars}</div>
      <p class="t-quote">${t.quote}</p>
      <div class="t-author">
        <div class="t-avatar">${t.init}</div>
        <div><div class="t-name">${t.name}</div><div class="t-role">${t.role}</div></div>
      </div>
    `;
    track.appendChild(card);
  });

  const totalSlides = Math.ceil(testimonials.length / tVisible);
  for (let i = 0; i < totalSlides; i++) {
    const dot = document.createElement('div');
    dot.className = 't-dot' + (i === 0 ? ' active' : '');
    dot.addEventListener('click', () => goToSlide(i));
    dotsContainer.appendChild(dot);
  }

  function goToSlide(i) {
    tIndex = Math.max(0, Math.min(i, totalSlides - 1));
    const firstCard = track.querySelector('.testimonial-card');
    if (!firstCard) return;
    const cardWidth = firstCard.offsetWidth + 24;
    track.style.transform = `translateX(-${tIndex * tVisible * cardWidth}px)`;
    document.querySelectorAll('.t-dot').forEach((d,idx) => d.classList.toggle('active', idx === tIndex));
    resetAutoPlay();
  }

  document.getElementById('tNext').addEventListener('click', () => goToSlide((tIndex + 1) % totalSlides));
  document.getElementById('tPrev').addEventListener('click', () => goToSlide((tIndex - 1 + totalSlides) % totalSlides));

  function resetAutoPlay() { clearInterval(autoTimer); autoTimer = setInterval(() => goToSlide((tIndex + 1) % totalSlides), 4500); }
  resetAutoPlay();

  window.addEventListener('resize', () => {
    tVisible = getVisibleTestimonials();
    goToSlide(0);
  });

  /* ============================================================
     6. TECH BADGES
  ============================================================ */
  const techs = [
    { name:'HTML5',      icon:'🌐' }, { name:'CSS3',       icon:'🎨' },
    { name:'JavaScript', icon:'⚡' }, { name:'TypeScript',  icon:'🔷' },
    { name:'React',      icon:'⚛️' }, { name:'Next.js',     icon:'▲' },
    { name:'Three.js',   icon:'🔮' }, { name:'Node.js',     icon:'🟢' },
    { name:'Python',     icon:'🐍' }, { name:'FastAPI',     icon:'🚀' },
    { name:'Django',     icon:'🎯' }, { name:'PostgreSQL',  icon:'🐘' },
    { name:'MongoDB',    icon:'🍃' }, { name:'Docker',      icon:'🐳' },
    { name:'AWS',        icon:'☁️' }, { name:'Figma',       icon:'✏️' },
    { name:'GSAP',       icon:'🎬' }, { name:'Linux',       icon:'🐧' },
  ];
  const tList = document.querySelector('.tech-list');
  techs.forEach(t => {
    const badge = document.createElement('div');
    badge.className = 'tech-badge';
    badge.innerHTML = `<span>${t.icon}</span>${t.name}`;
    tList.appendChild(badge);
  });

  /* ============================================================
     7. CONTACT FORM
  ============================================================ */
  const form    = document.getElementById('contactForm');
  const success = document.getElementById('formSuccess');
  form.addEventListener('submit', e => {
    e.preventDefault();
    const btn = document.getElementById('formSubmit');
    btn.innerHTML = '<span>Sending…</span><i class="fa fa-spinner fa-spin"></i>';
    setTimeout(() => {
      form.reset();
      btn.innerHTML = '<span>Send Message</span><i class="fa fa-paper-plane"></i>';
      success.classList.add('show');
      setTimeout(() => success.classList.remove('show'), 5000);
    }, 1500);
  });

  /* ============================================================
     8. TILT EFFECT (3D cards on mouse move)
  ============================================================ */
  function initTilt() {
    document.querySelectorAll('[data-tilt]').forEach(card => {
      card.addEventListener('mousemove', e => {
        const r = card.getBoundingClientRect();
        const x = e.clientX - r.left - r.width  / 2;
        const y = e.clientY - r.top  - r.height / 2;
        const rotX = -(y / (r.height/2)) * 8;
        const rotY =  (x / (r.width /2)) * 8;
        card.style.transform = `perspective(1000px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateZ(8px)`;
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  }
  initTilt();

  /* ============================================================
     9. SCROLL REVEAL (IntersectionObserver)
  ============================================================ */
  function initReveal() {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.transitionDelay = (entry.target.dataset.delay || 0) + 'ms';
          entry.target.classList.add('revealed');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.05, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('[data-reveal]').forEach((el, i) => {
      el.dataset.delay = i % 4 * 100;
      io.observe(el);
    });
  }

  /* ============================================================
     10. ANIMATED COUNTERS
  ============================================================ */
  function initCounters() {
    const counters = document.querySelectorAll('.stat-number');
    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = +el.dataset.count;
        let current = 0;
        const step = target / 60;
        const timer = setInterval(() => {
          current = Math.min(current + step, target);
          el.textContent = Math.floor(current);
          if (current >= target) clearInterval(timer);
        }, 16);
        io.unobserve(el);
      });
    }, { threshold: 0.5 });
    counters.forEach(c => io.observe(c));
  }

  /* ============================================================
     11. THREE.JS — HERO CANVAS (stars + floating geometry)
  ============================================================ */
  function initHeroCanvas() {
    const canvas = document.getElementById('hero-canvas');
    if (!canvas || typeof THREE === 'undefined') return;

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);

    const scene  = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
    camera.position.set(0, 0, 5);

    /* — Stars / particle field — */
    const starCount = 2000;
    const starGeo   = new THREE.BufferGeometry();
    const positions  = new Float32Array(starCount * 3);
    const colors     = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i++) {
      positions[i*3]   = (Math.random() - 0.5) * 40;
      positions[i*3+1] = (Math.random() - 0.5) * 40;
      positions[i*3+2] = (Math.random() - 0.5) * 20 - 5;
      const t = Math.random();
      colors[i*3]   = 0.4 + t * 0.6;
      colors[i*3+1] = 0.3 + t * 0.3;
      colors[i*3+2] = 0.9 + t * 0.1;
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    starGeo.setAttribute('color',    new THREE.BufferAttribute(colors, 3));
    const starMat = new THREE.PointsMaterial({ size: 0.06, vertexColors: true, transparent: true, opacity: 0.85, sizeAttenuation: true });
    const stars    = new THREE.Points(starGeo, starMat);
    scene.add(stars);

    /* — Floating wireframe geometries — */
    const geoShapes = [];
    const geoDefs = [
      { geo: new THREE.IcosahedronGeometry(0.6, 1), pos: [2.5,  1.2, -2], speed: 0.003 },
      { geo: new THREE.OctahedronGeometry(0.5, 0),  pos: [-3,   0.5, -3], speed: 0.005 },
      { geo: new THREE.TorusGeometry(0.45, 0.15, 8, 24), pos: [3.5, -1.2, -2], speed: 0.004 },
      { geo: new THREE.TetrahedronGeometry(0.5, 0), pos: [-2.5,-1.5, -3], speed: 0.006 },
    ];
    geoDefs.forEach(def => {
      const mat  = new THREE.MeshBasicMaterial({ color: 0x6366f1, wireframe: true, transparent: true, opacity: 0.5 });
      const mesh = new THREE.Mesh(def.geo, mat);
      mesh.position.set(...def.pos);
      mesh.userData.speed = def.speed;
      mesh.userData.initY = def.pos[1];
      scene.add(mesh);
      geoShapes.push(mesh);
    });

    /* — Ambient light ring (glowing torus) — */
    const ringGeo = new THREE.TorusGeometry(1.6, 0.01, 4, 80);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0xa855f7, transparent: true, opacity: 0.3 });
    const ring3d   = new THREE.Mesh(ringGeo, ringMat);
    ring3d.rotation.x = Math.PI / 2.5;
    ring3d.position.z = -4;
    scene.add(ring3d);

    /* — Mouse parallax — */
    let mouseX = 0, mouseY = 0;
    document.addEventListener('mousemove', e => {
      mouseX = (e.clientX / window.innerWidth  - 0.5) * 2;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    });

    let scrollY = 0;
    window.addEventListener('scroll', () => { scrollY = window.scrollY; });

    function animate() {
      requestAnimationFrame(animate);
      const t = performance.now() * 0.001;

      stars.rotation.y  = t * 0.02  + mouseX * 0.05;
      stars.rotation.x  = t * 0.01  + mouseY * 0.03;

      geoShapes.forEach(m => {
        m.rotation.x += m.userData.speed;
        m.rotation.y += m.userData.speed * 1.3;
        m.position.y  = m.userData.initY + Math.sin(t + m.userData.speed * 100) * 0.3;
      });

      ring3d.rotation.z += 0.004;

      camera.position.x += (mouseX * 0.4 - camera.position.x) * 0.05;
      camera.position.y += (-mouseY * 0.3 - camera.position.y) * 0.05;
      camera.position.z  = 5 + scrollY * 0.003;
      camera.lookAt(scene.position);

      renderer.render(scene, camera);
    }
    animate();

    window.addEventListener('resize', () => {
      renderer.setSize(canvas.clientWidth, canvas.clientHeight);
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
    });
  }

  /* ============================================================
     12. THREE.JS — TECH SPHERE (orbiting tech labels)
  ============================================================ */
  function initTechSphere() {
    const canvas = document.getElementById('tech-canvas');
    if (!canvas || typeof THREE === 'undefined') return;

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);

    const scene  = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, canvas.clientWidth / canvas.clientHeight, 0.1, 100);
    camera.position.z = 5;

    const radius = 2.0;
    const spherePoints = [];
    const pointCount = 180;

    /* — Distribute points on sphere surface (Fibonacci) — */
    for (let i = 0; i < pointCount; i++) {
      const phi   = Math.acos(1 - 2 * (i + 0.5) / pointCount);
      const theta = Math.PI * (1 + Math.sqrt(5)) * i;
      spherePoints.push(new THREE.Vector3(
        radius * Math.sin(phi) * Math.cos(theta),
        radius * Math.cos(phi),
        radius * Math.sin(phi) * Math.sin(theta)
      ));
    }

    /* — Dots on sphere — */
    const dotGeo = new THREE.BufferGeometry().setFromPoints(spherePoints);
    const dotMat = new THREE.PointsMaterial({ size: 0.04, color: 0x6366f1, transparent: true, opacity: 0.7 });
    const dotCloud = new THREE.Points(dotGeo, dotMat);
    scene.add(dotCloud);

    /* — Wireframe sphere — */
    const wireMesh = new THREE.Mesh(
      new THREE.SphereGeometry(radius, 18, 18),
      new THREE.MeshBasicMaterial({ color: 0x6366f1, wireframe: true, transparent: true, opacity: 0.08 })
    );
    scene.add(wireMesh);

    /* — Tech label sprites (use canvas texture) — */
    const techNames = ['HTML', 'CSS', 'JS', 'React', 'Next', 'Node', 'Python', 'AI', 'AWS', 'Docker', 'Figma', 'GSAP', 'SQL', 'Three.js', 'Linux', 'Cyber'];
    const techMeshes = [];
    const pickedPoints = [];
    for (let i = 0; i < techNames.length; i++) {
      pickedPoints.push(spherePoints[Math.floor(i * pointCount / techNames.length)]);
    }

    techNames.forEach((name, i) => {
      const cvs = document.createElement('canvas');
      cvs.width = 160; cvs.height = 48;
      const ctxC = cvs.getContext('2d');
      ctxC.fillStyle = 'rgba(99,102,241,0.15)';
      roundRect(ctxC, 0, 0, 160, 48, 12);
      ctxC.fill();
      ctxC.strokeStyle = 'rgba(99,102,241,0.6)';
      ctxC.lineWidth = 1.5;
      roundRect(ctxC, 0, 0, 160, 48, 12);
      ctxC.stroke();
      ctxC.fillStyle = '#c7d2fe';
      ctxC.font = 'bold 22px Inter,sans-serif';
      ctxC.textAlign = 'center';
      ctxC.textBaseline = 'middle';
      ctxC.fillText(name, 80, 24);

      const tex = new THREE.CanvasTexture(cvs);
      const mat = new THREE.SpriteMaterial({ map: tex, transparent: true });
      const sprite = new THREE.Sprite(mat);
      sprite.scale.set(0.7, 0.21, 1);
      sprite.position.copy(pickedPoints[i]);
      scene.add(sprite);
      techMeshes.push(sprite);
    });

    function roundRect(ctx, x, y, w, h, r) {
      ctx.beginPath();
      ctx.moveTo(x + r, y);
      ctx.lineTo(x + w - r, y);
      ctx.quadraticCurveTo(x + w, y, x + w, y + r);
      ctx.lineTo(x + w, y + h - r);
      ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
      ctx.lineTo(x + r, y + h);
      ctx.quadraticCurveTo(x, y + h, x, y + h - r);
      ctx.lineTo(x, y + r);
      ctx.quadraticCurveTo(x, y, x + r, y);
      ctx.closePath();
    }

    let mxT = 0, myT = 0;
    canvas.closest('.tech-universe').addEventListener('mousemove', e => {
      const r = canvas.getBoundingClientRect();
      mxT = (e.clientX - r.left)  / r.width  - 0.5;
      myT = (e.clientY - r.top)   / r.height - 0.5;
    });

    let targetRotX = 0, targetRotY = 0, curRotX = 0, curRotY = 0;

    function animTech() {
      requestAnimationFrame(animTech);
      const t = performance.now() * 0.0005;
      targetRotY = t + mxT * 1.5;
      targetRotX = myT * 1.0;
      curRotX += (targetRotX - curRotX) * 0.04;
      curRotY += (targetRotY - curRotY) * 0.04;
      dotCloud.rotation.y = curRotY;
      dotCloud.rotation.x = curRotX;
      wireMesh.rotation.y = curRotY;
      wireMesh.rotation.x = curRotX;
      techMeshes.forEach((sprite, i) => {
        const p = pickedPoints[i].clone();
        p.applyEuler(new THREE.Euler(curRotX, curRotY, 0));
        sprite.position.copy(p);
        const depth = (p.z + radius) / (2 * radius);
        sprite.material.opacity = 0.3 + depth * 0.7;
      });
      renderer.render(scene, camera);
    }
    animTech();

    window.addEventListener('resize', () => {
      renderer.setSize(canvas.clientWidth, canvas.clientHeight);
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
    });
  }

  /* ============================================================
     13. GSAP SCROLL ANIMATIONS
  ============================================================ */
  function initGSAP() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
    gsap.registerPlugin(ScrollTrigger);

    /* Hero entrance */
    const tl = gsap.timeline({ delay: 2.8 });
    tl.from('.hero-badge',    { opacity:0, y:30, duration:0.8, ease:'power3.out' })
      .from('.hero-greeting', { opacity:0, y:20, duration:0.6, ease:'power3.out' }, '-=0.4')
      .from('.hero-name',     { opacity:0, y:40, duration:0.9, skewX:-4, ease:'power4.out' }, '-=0.3')
      .from('.hero-subtitle', { opacity:0, y:25, duration:0.7, ease:'power3.out' }, '-=0.3')
      .from('.htag',          { opacity:0, y:15, stagger:0.1, duration:0.5, ease:'power2.out' }, '-=0.3')
      .from('.hero-ctas .btn',{ opacity:0, y:20, stagger:0.15, duration:0.5, ease:'power2.out' }, '-=0.2')
      .from('.glass-panel',   { opacity:0, scale:0.8, stagger:0.2, duration:0.7, ease:'back.out(1.7)' }, '-=0.4')
      .from('.scroll-indicator', { opacity:0, y:20, duration:0.6 }, '-=0.2');

    /* Services cards stagger — no opacity:0 since data-reveal controls it */
    gsap.from('.service-card', {
      scrollTrigger: { trigger: '.services-grid', start: 'top 85%' },
      y: 50, stagger: 0.1, duration: 0.7, ease: 'power3.out'
    });

    /* Project cards stagger — only translate, not opacity */
    gsap.from('.project-card', {
      scrollTrigger: { trigger: '.projects-grid', start: 'top 85%' },
      y: 50, stagger: 0.08, duration: 0.6, ease: 'power3.out'
    });

    /* About section parallax */
    gsap.to('.about-avatar-wrap', {
      scrollTrigger: { trigger: '#about', scrub: true, start: 'top bottom', end: 'bottom top' },
      y: -60,
    });

    /* Tech universe float */
    gsap.to('.tech-universe', {
      scrollTrigger: { trigger: '#techstack', scrub: true, start: 'top bottom', end: 'bottom top' },
      y: -30,
    });

    /* Footer reveal */
    gsap.from('.footer-grid > *', {
      scrollTrigger: { trigger: '.footer', start: 'top 85%' },
      opacity:0, y:40, stagger:0.15, duration:0.7, ease:'power3.out'
    });
  }

  /* ============================================================
     14. INIT ALL (after loader done)
  ============================================================ */
  function initAnimations() {
    /* initReveal + initCounters already called early — only 3D here */
    initHeroCanvas();
    initTechSphere();
    initGSAP();
  }

  /* smooth anchor clicks */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth' }); }
    });
  });

}); /* END DOMContentLoaded */
