/* ═══════════════════════════════════════
   FLAVOUR FEAST — Enhanced main.js
   ═══════════════════════════════════════ */

/* ── Navbar: scroll-aware ── */
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
}, { passive: true });

/* ── Mobile menu toggle ── */
/* ── Mobile fullscreen menu ── */
const menuBtn     = document.getElementById('menu-btn');
const mobileMenu  = document.getElementById('mobile-menu');
const menuClose   = document.getElementById('mobile-menu-close');
const menuBtnIcon = menuBtn.querySelector('i');

function openMenu() {
  mobileMenu.classList.add('open');
  mobileMenu.setAttribute('aria-hidden', 'false');
  menuBtnIcon.className = 'ri-close-line';
  document.body.classList.add('menu-open');
}

function closeMenu() {
  // if focus is currently inside the menu (e.g. the close button),
  // move it out BEFORE applying aria-hidden, otherwise assistive tech
  // throws "aria-hidden on element with focused descendant"
  if (mobileMenu.contains(document.activeElement)) {
    document.activeElement.blur();
    menuBtn.focus();
  }

  mobileMenu.classList.remove('open');
  mobileMenu.setAttribute('aria-hidden', 'true');
  menuBtnIcon.className = 'ri-menu-3-line';
  document.body.classList.remove('menu-open');
}

menuBtn.addEventListener('click', () => {
  mobileMenu.classList.contains('open') ? closeMenu() : openMenu();
});

menuClose.addEventListener('click', closeMenu);

mobileMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', closeMenu);
});

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeMenu();
});

/* ── Active nav link on scroll ── */
const sections  = document.querySelectorAll('section[id], header[id]');
const navAnchors = document.querySelectorAll('.nav__links a');

const mobileNavItems = document.querySelectorAll('.mobile-menu__item');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navAnchors.forEach(a => a.classList.remove('active'));
      const active = document.querySelector(`.nav__links a[href="#${entry.target.id}"]`);
      if (active) active.classList.add('active');

      mobileNavItems.forEach(item => item.classList.remove('active'));
      const activeMobileLink = document.querySelector(`.mobile-menu__link[href="#${entry.target.id}"]`);
      if (activeMobileLink) activeMobileLink.closest('.mobile-menu__item').classList.add('active');
    }
  });
}, { rootMargin: '-40% 0px -55% 0px' });

sections.forEach(s => sectionObserver.observe(s));

/* ── Cinematic scroll reveal system — set up after GSAP loads below ── */

/* ── Menu Swiper ── */
const menuSwiper = new Swiper('.myMenuSwiper', {
  loop: true,
  loopAdditionalSlides: 4,
  initialSlide: 0,
  speed: 680,
  grabCursor: true,
  centeredSlides: false,
  autoplay: {
    delay: 3200,
    disableOnInteraction: false,
    pauseOnMouseEnter: true,
    reverseDirection: false,
  },
  pagination: {
    el: '.swiper-pagination',
    clickable: true,
  },
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },
  breakpoints: {
    0:    { slidesPerView: 1.2,  spaceBetween: 16 },
    540:  { slidesPerView: 1.6,  spaceBetween: 20 },
    768:  { slidesPerView: 2.2,  spaceBetween: 24 },
    1024: { slidesPerView: 3,    spaceBetween: 28 },
  },
});

/* ── Gallery: simple click-to-zoom (lightbox-lite) ── */
const galleryItems = document.querySelectorAll('.gallery-item');

galleryItems.forEach(item => {
  item.addEventListener('click', () => {
    const src = item.querySelector('img').src;
    const overlay = document.createElement('div');
    overlay.style.cssText = `
      position:fixed;inset:0;z-index:9999;
      background:rgba(10,5,0,0.92);
      display:flex;align-items:center;justify-content:center;
      cursor:zoom-out;backdrop-filter:blur(8px);
      animation:fadeIn 0.25s ease;
    `;
    const img = document.createElement('img');
    img.src = src;
    img.style.cssText = `
      max-width:90vw;max-height:90vh;object-fit:contain;
      border-radius:12px;box-shadow:0 32px 80px rgba(0,0,0,0.6);
    `;
    overlay.appendChild(img);
    overlay.addEventListener('click', () => overlay.remove());
    document.body.appendChild(overlay);
  });
});

/* ── Smooth scroll offset for fixed navbar ── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = navbar.offsetHeight + 16;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});
/* ═══════════════════════════════════════
   GSAP + SCROLLTRIGGER PREMIUM EFFECTS
   ═══════════════════════════════════════ */
gsap.registerPlugin(ScrollTrigger);

/* ════════════════════════════════
   CINEMATIC SCROLL REVEAL SYSTEM
   — element-type motion + center-out stagger + parallax
════════════════════════════════ */
(function () {
  const isMobile = window.innerWidth < 768;

  // ── 1. Section labels/eyebrows — quick slide from left ──
  document.querySelectorAll('.section-label, .about-panel-tag, .book-eyebrow, .blog-eyebrow').forEach(el => {
    gsap.fromTo(el,
      { opacity: 0, x: -24 },
      {
        opacity: 1, x: 0,
        duration: 0.6, ease: 'power2.out',
        scrollTrigger: { trigger: el, start: 'top 88%', once: true },
      }
    );
  });

  // ── 2. Section titles — focus-pull (slide + blur on desktop) ──
  document.querySelectorAll('.section-title, .about-panel-headline, .book-headline, .blog-title').forEach(el => {
    const fromVars = isMobile
      ? { opacity: 0, y: 36 }
      : { opacity: 0, y: 44, filter: 'blur(6px)' };
    const toVars = isMobile
      ? { opacity: 1, y: 0, duration: 0.8, ease: 'expo.out' }
      : { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.9, ease: 'expo.out' };

    gsap.fromTo(el, fromVars, {
      ...toVars,
      scrollTrigger: { trigger: el, start: 'top 88%', once: true },
    });
  });

  // ── 3. Body copy / paragraphs — quick subtle fade ──
  document.querySelectorAll('.section-copy, .about-panel-body, .book-sub, .blog-excerpt').forEach((el, i) => {
    gsap.fromTo(el,
      { opacity: 0, y: 18 },
      {
        opacity: 1, y: 0,
        duration: 0.55, ease: 'power2.out',
        delay: (i % 3) * 0.05,
        scrollTrigger: { trigger: el, start: 'top 92%', once: true },
      }
    );
  });

  // ── 4. Cards — alternating left/right slide + scale, center-out stagger ──
  function revealCardGroup(selector) {
    const cards = document.querySelectorAll(selector);
    if (!cards.length) return;

    cards.forEach((card, i) => {
      const fromLeft = i % 2 === 0;
      gsap.fromTo(card,
        {
          opacity: 0,
          x: fromLeft ? -50 : 50,
          scale: 0.94,
        },
        {
          opacity: 1, x: 0, scale: 1,
          duration: 0.7,
          ease: 'power3.out',
          scrollTrigger: { trigger: card, start: 'top 90%', once: true },
        }
      );
    });
  }

  revealCardGroup('.menu-card');
  revealCardGroup('.footer-col');

  // footer-brand — simple fade up
  document.querySelectorAll('.footer-brand').forEach(el => {
    gsap.fromTo(el,
      { opacity: 0, y: 30 },
      {
        opacity: 1, y: 0,
        duration: 0.75, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 92%', once: true },
      }
    );
  });

  // ── 5. Parallax drift on images ──
  if (!isMobile) {
    document.querySelectorAll('.about-img-wrap img').forEach(img => {
      gsap.fromTo(img,
        { y: -40, scale: 1.08 },
        {
          y: 0, scale: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: img,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 0.6,
          },
        }
      );
    });
  }
})();

/* ════════════════════════════════
   1. HERO ENTRANCE — clean stagger, no DOM manipulation
════════════════════════════════ */
const heroTitle   = document.querySelector('.hero-title');
const heroKicker  = document.querySelector('.hero-kicker');
const heroText    = document.querySelector('.hero-text');
const heroActions = document.querySelector('.hero-actions');
const heroScroll  = document.querySelector('.hero-scroll');
const heroBg      = document.querySelector('.hero');

// set initial states explicitly before timeline runs
gsap.set([heroKicker, heroTitle, heroText, heroScroll], { opacity: 0, y: 30 });
gsap.set([...heroActions.children], { opacity: 0, y: 20, scale: 0.95 });

gsap.timeline({ delay: 0.1 })
  .to(heroKicker, {
    opacity: 1, y: 0,
    duration: 0.7, ease: 'power3.out',
  })
  .to(heroTitle, {
    opacity: 1, y: 0,
    duration: 0.9, ease: 'expo.out',
  }, '-=0.4')
  .to(heroText, {
    opacity: 1, y: 0,
    duration: 0.7, ease: 'power3.out',
  }, '-=0.5')
  .to([...heroActions.children], {
    opacity: 1, y: 0, scale: 1,
    duration: 0.6,
    stagger: 0.12,
    ease: 'back.out(1.4)',
  }, '-=0.4')
  .to(heroScroll, {
    opacity: 1, y: 0,
    duration: 0.6, ease: 'power2.out',
  }, '-=0.3');

/* ════════════════════════════════
   2. PARALLAX — overlay drifts so bg appears slower
════════════════════════════════ */
gsap.to('.hero-overlay', {
  y: '25%',
  ease: 'none',
  scrollTrigger: {
    trigger: heroBg,
    start: 'top top',
    end: 'bottom top',
    scrub: true,
  },
});

gsap.to('.hero-content', {
  y: -80,
  ease: 'none',
  scrollTrigger: {
    trigger: heroBg,
    start: 'top top',
    end: 'bottom top',
    scrub: 0.6,
  },
});

/* ════════════════════════════════
   3. NAV — desktop cinematic entrance only
   Mobile stagger handled by CSS animation
════════════════════════════════ */
const gsapNavLinks = document.getElementById('nav-links');
const gsapNavItems = gsapNavLinks ? gsapNavLinks.querySelectorAll('li') : [];
const gsapMenuBtn  = document.getElementById('menu-btn');

if (window.innerWidth >= 1025) {
  const navLogo = document.querySelector('.nav__logo');
  const navCta  = document.querySelector('.nav__cta');

  gsap.set([navLogo, ...gsapNavItems, navCta], { opacity: 0 });
  gsap.set(navLogo, { x: -24, filter: 'blur(6px)' });
  gsap.set([...gsapNavItems], { y: -20, filter: 'blur(4px)' });
  gsap.set(navCta, { scale: 0.8, filter: 'blur(4px)' });

  gsap.timeline({ delay: 0.6 })
    .to(navLogo, {
      opacity: 1, x: 0,
      filter: 'blur(0px)',
      duration: 1.1,
      ease: 'expo.out',
    })
    .to([...gsapNavItems], {
      opacity: 1, y: 0,
      filter: 'blur(0px)',
      duration: 0.7,
      stagger: 0.1,
      ease: 'expo.out',
    }, '-=0.6')
    // CTA button scales up with a spring
    .to(navCta, {
      opacity: 1, scale: 1,
      filter: 'blur(0px)',
      duration: 0.6,
      ease: 'back.out(2)',
    }, '-=0.3');
}

/* ════════════════════════════════
   4. SECTION REVEAL — text elements only, never cards
════════════════════════════════ */
const safeRevealTargets = [
  '.section-label', '.section-title', '.section-copy',
  '.gallery-item',
  '.about-image', '.about-content > *',
  '.footer-brand', '.footer-col',
];

document.querySelectorAll(safeRevealTargets.join(', ')).forEach((el, i) => {
  gsap.fromTo(el,
    { opacity: 0, y: 28, scale: 0.98 },
    {
      opacity: 1, y: 0, scale: 1,
      duration: 0.7,
      delay: (i % 4) * 0.07,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 90%',
        once: true,
      },
    }
  );
});

/* ════════════════════════════════
   5. MENU SECTION SCROLL ENTRANCE — header text only
════════════════════════════════ */
const menuIntroEls = document.querySelectorAll('.menu-section .section-label, .menu-section .section-title, .menu-section .section-copy');

gsap.set(menuIntroEls, { opacity: 0, y: 40 });

ScrollTrigger.create({
  trigger: '.menu-section',
  start: 'top 75%',
  once: true,
  onEnter: () => {
    gsap.to(menuIntroEls, {
      opacity: 1, y: 0,
      duration: 0.85,
      stagger: 0.15,
      ease: 'expo.out',
    });
  },
});

/* ════════════════════════════════
   6. MENU CARD 3D TILT — Swiper-safe
════════════════════════════════ */
document.querySelectorAll('.menu-card').forEach(card => {
  let isSwiping = false;

  // Disable tilt during Swiper drag/transition
  menuSwiper.on('sliderMove', () => { isSwiping = true; });
  menuSwiper.on('transitionEnd', () => { isSwiping = false; });

  card.addEventListener('mousemove', (e) => {
    if (isSwiping) return;
    const rect = card.getBoundingClientRect();
    const rotY =  ((e.clientX - rect.left  - rect.width  / 2) / (rect.width  / 2)) * 6;
    const rotX = -((e.clientY - rect.top   - rect.height / 2) / (rect.height / 2)) * 4;
    gsap.to(card, {
      rotateX: rotX,
      rotateY: rotY,
      y: -8,
      transformPerspective: 900,
      duration: 0.35,
      ease: 'power2.out',
    });
  });

  card.addEventListener('mouseleave', () => {
    gsap.to(card, {
      rotateX: 0,
      rotateY: 0,
      y: 0,
      duration: 0.65,
      ease: 'elastic.out(1, 0.5)',
    });
  });
});

/* ═══════════════════════════════════════
   CINEMATIC GALLERY — gc3 interactions
   ═══════════════════════════════════════ */
(function () {
  const thumbs       = document.querySelectorAll('.gc3-thumb');
  const mainImg      = document.getElementById('gc3-main-img');
  const mainVideo    = document.getElementById('gc3-main-video');
  const titleEl      = document.getElementById('gc3-title');
  const descEl       = document.getElementById('gc3-desc');
  const counterEl    = document.getElementById('gc3-current');
  const progressFill = document.getElementById('gc3-progress-fill');
  const progressDot  = document.getElementById('gc3-progress-dot');
  const prevBtn      = document.getElementById('gc3-prev');
  const nextBtn      = document.getElementById('gc3-next');
  const expandBtn    = document.getElementById('gc3-expand');

  if (!thumbs.length) return;

  let current = 0;
  const total = thumbs.length;

  function updateProgress(index) {
    const pct = ((index + 1) / total) * 100;
    progressFill.style.width = pct + '%';
    progressDot.style.left   = pct + '%';
  }

  function switchTo(index) {
    const thumb = thumbs[index];
    const type  = thumb.dataset.type;
    const src   = thumb.dataset.src;
    const title = thumb.dataset.title;
    const desc  = thumb.dataset.desc;

    // update active thumb
    thumbs.forEach(t => t.classList.remove('active'));
    thumb.classList.add('active');

    // fade out featured
    gsap.to([mainImg, mainVideo], { opacity: 0, duration: 0.3, ease: 'power2.in',
      onComplete: () => {
        if (type === 'video') {
          mainImg.style.display = 'none';
          mainVideo.style.display = 'block';
          mainVideo.src = src;
          mainVideo.load();
          mainVideo.play();
          expandBtn.textContent = 'Now playing';
        } else {
          mainVideo.pause();
          mainVideo.style.display = 'none';
          mainImg.style.display = 'block';
          mainImg.src = src;
          expandBtn.textContent = 'View full image';
        }

        titleEl.innerHTML = title;
        descEl.textContent = desc;
        counterEl.textContent = String(index + 1).padStart(2, '0');
        updateProgress(index);

        gsap.to(type === 'video' ? mainVideo : mainImg, {
          opacity: 1, duration: 0.5, ease: 'power2.out',
        });

        // animate title in
        gsap.fromTo(titleEl,
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.6, ease: 'expo.out' }
        );
      }
    });

    current = index;
  }

  // thumbnail click
  thumbs.forEach((thumb, i) => {
    thumb.addEventListener('click', () => switchTo(i));
  });

  // nav buttons
  prevBtn.addEventListener('click', () => {
    switchTo((current - 1 + total) % total);
  });

  nextBtn.addEventListener('click', () => {
    switchTo((current + 1) % total);
  });

  // expand / lightbox
  expandBtn.addEventListener('click', () => {
    const thumb = thumbs[current];
    if (thumb.dataset.type === 'video') return;
    const overlay = document.createElement('div');
    overlay.style.cssText = 'position:fixed;inset:0;z-index:9999;background:rgba(5,2,0,0.95);display:flex;align-items:center;justify-content:center;cursor:zoom-out;backdrop-filter:blur(10px);';
    const img = document.createElement('img');
    img.src = mainImg.src;
    img.style.cssText = 'max-width:90vw;max-height:90vh;object-fit:contain;border-radius:10px;box-shadow:0 40px 100px rgba(0,0,0,0.7);';
    overlay.appendChild(img);
    overlay.addEventListener('click', () => overlay.remove());
    document.body.appendChild(overlay);
    gsap.from(img, { opacity: 0, scale: 0.92, duration: 0.45, ease: 'expo.out' });
  });

  // keyboard nav
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft')  switchTo((current - 1 + total) % total);
    if (e.key === 'ArrowRight') switchTo((current + 1) % total);
  });

  // init progress
  updateProgress(0);

  // GSAP entrance
  ScrollTrigger.create({
    trigger: '.gc3',
    start: 'top 80%',
    once: true,
    onEnter: () => {
      gsap.from('.gc3', {
        opacity: 0,
        y: 50,
        scale: 0.97,
        duration: 1,
        ease: 'expo.out',
      });
      gsap.from('.gc3-thumb', {
        opacity: 0,
        y: 20,
        duration: 0.5,
        stagger: 0.08,
        ease: 'power3.out',
        delay: 0.4,
      });
    },
  });
})();



/* ════════════════════════════════
   BOOKING MOBILE FEATURES STRIP
════════════════════════════════ */
(function () {
  if (window.innerWidth > 1024) return;
  const bookSection = document.querySelector('.book-section');
  if (!bookSection) return;

  const strip = document.createElement('div');
  strip.className = 'book-mobile-strip';
  strip.innerHTML = `
    <div class="book-strip-feat"><span class="book-strip-num">01</span><span class="book-strip-title">Fresh made to order</span></div>
    <div class="book-strip-feat"><span class="book-strip-num">02</span><span class="book-strip-title">Same-day delivery</span></div>
    <div class="book-strip-feat"><span class="book-strip-num">03</span><span class="book-strip-title">Custom flavours</span></div>
  `;
  bookSection.appendChild(strip);
})();

/* ════════════════════════════════
   BOOKING SECTION ENTRANCE
   — IntersectionObserver only, never touches panels
════════════════════════════════ */
(function () {
  const els = [
    ...document.querySelectorAll(
      '.book-eyebrow, .book-headline, .book-sub, .book-feat, ' +
      '.book-form-label, .book-form-title, .book-form-rule, ' +
      '.book-form .form-row, .book-submit-btn, .book-form-note'
    )
  ];

  if (!els.length) return;

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('book-visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.05, rootMargin: '0px 0px -10px 0px' });

  els.forEach((el, i) => {
    el.style.transitionDelay = (i * 0.055) + 's';
    io.observe(el);
  });
})();

/* ════════════════════════════════
   ABOUT STATS — count-up, starts 2s after load
════════════════════════════════ */
(function () {
  const statNums = document.querySelectorAll('.about-stat-num[data-target]');
  if (!statNums.length) return;

  function easeOutQuart(t) {
    return 1 - Math.pow(1 - t, 4);
  }

  function countUp(el) {
    const display  = el.dataset.display;
    const target   = parseInt(el.dataset.target, 10);
    const suffix   = el.dataset.suffix || '';
    const duration = 1800;
    const start    = performance.now();

    // 2k+ counts 0→2 then adds "k+"
    const countTo    = display ? 2 : target;
    const dispSuffix = display ? 'k+' : suffix;

    function frame(now) {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased    = easeOutQuart(progress);
      const current  = Math.floor(eased * countTo);
      el.textContent = current + dispSuffix;

      if (progress < 1) {
        requestAnimationFrame(frame);
      } else {
        el.textContent = display || (target + suffix);
        el.closest('.about-stat').classList.add('counted');
      }
    }

    requestAnimationFrame(frame);
  }

  // trigger when stats section enters viewport
  ScrollTrigger.create({
    trigger: '.about-stats',
    start: 'top 85%',
    once: true,
    onEnter: () => {
      statNums.forEach((el, i) => {
        setTimeout(() => countUp(el), i * 200);
      });
    },
  });
})();

/* ════════════════════════════════
   BLOG SECTION ENTRANCE
════════════════════════════════ */
ScrollTrigger.create({
  trigger: '.blog-section',
  start: 'top 78%',
  once: true,
  onEnter: () => {
    gsap.from('.blog-eyebrow, .blog-title, .blog-all-link', {
      opacity: 0, y: 24,
      duration: 0.75,
      stagger: 0.12,
      ease: 'expo.out',
    });
    gsap.from('.blog-card', {
      opacity: 0, y: 40,
      duration: 0.8,
      stagger: 0.14,
      ease: 'power3.out',
      delay: 0.25,
    });
  },
});
/* ════════════════════════════════
   BLOG SCROLL STRIP — dot indicators
════════════════════════════════ */
(function () {
  if (window.innerWidth > 1024) return;

  const grid = document.querySelector('.blog-grid');
  const dots = document.querySelectorAll('.blog-dot');
  const cards = document.querySelectorAll('.blog-card');

  if (!grid || !dots.length) return;

  // dot click — scroll to card
  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      const card = cards[i];
      if (!card) return;
      grid.scrollTo({ left: card.offsetLeft - 20, behavior: 'smooth' });
    });
  });

  // sync dots on scroll
  let scrollTimer;
  grid.addEventListener('scroll', () => {
    clearTimeout(scrollTimer);
    scrollTimer = setTimeout(() => {
      const scrollLeft = grid.scrollLeft;
      const cardWidth = cards[0]?.offsetWidth + 14 || 274;
      const active = Math.round(scrollLeft / cardWidth);
      dots.forEach((d, i) => d.classList.toggle('active', i === active));
    }, 50);
  }, { passive: true });
})();
/* ════════════════════════════════
   BACK TO TOP — appears near footer
════════════════════════════════ */
(function () {
  const btn = document.getElementById('back-to-top');
  const footer = document.getElementById('footer');
  if (!btn || !footer) return;

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      btn.classList.toggle('visible', entry.isIntersecting);
    });
  }, { threshold: 0.05 });

  io.observe(footer);

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();
/* ════════════════════════════════
   BOOKING FORM — EmailJS submission
════════════════════════════════ */
(function () {
  // ⚠️ Replace these three with your actual EmailJS credentials
  const EMAILJS_PUBLIC_KEY  = 'zVZmcWHgiJAISEYUj';
  const EMAILJS_SERVICE_ID  = 'service_mkrcwt5';
  const EMAILJS_TEMPLATE_ID = 'template_8xme259';

  const form       = document.getElementById('book-form');
  const submitBtn  = document.getElementById('book-submit-btn');
  const submitText = submitBtn ? submitBtn.querySelector('.book-submit-text') : null;
  const noteEl     = document.getElementById('book-form-note');

  if (!form || !submitBtn || !submitText || !noteEl) return;

  // default note text — restored after success/error messages clear
  const defaultNote = noteEl.textContent;
  let resetTimer = null;

  emailjs.init(EMAILJS_PUBLIC_KEY);

  function setNote(text, state) {
    noteEl.textContent = text;
    noteEl.classList.remove('success', 'error');
    if (state) noteEl.classList.add(state);
  }

  function resetNoteAfterDelay() {
    clearTimeout(resetTimer);
    resetTimer = setTimeout(() => {
      setNote(defaultNote, null);
    }, 5000);
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // loading state
    submitBtn.disabled = true;
    submitText.textContent = 'Sending...';
    setNote('Sending your order request…', null);

    emailjs.sendForm(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, form)
      .then(() => {
        submitText.textContent = 'Place My Order';
        submitBtn.disabled = false;
        setNote('✓ Order request sent! We\u2019ll confirm shortly.', 'success');
        form.reset();
        resetNoteAfterDelay();
      })
      .catch((err) => {
        console.error('EmailJS error:', err);
        submitText.textContent = 'Place My Order';
        submitBtn.disabled = false;
        setNote('✗ Something went wrong. Please try again.', 'error');
        resetNoteAfterDelay();
      });
  });
})();