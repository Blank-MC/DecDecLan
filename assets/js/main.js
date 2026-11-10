/* =========================================================
   DECLAN — interactions
   ========================================================= */
(() => {
  'use strict';

  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  const body = document.body;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  /* ---------------- Preloader ---------------- */
  const preloader = $('#preloader');
  const startedAt = performance.now();
  const MIN_SPLASH = 1500;
  let booted = false;

  function boot() {
    if (booted) return;
    booted = true;

    const wait = Math.max(0, MIN_SPLASH - (performance.now() - startedAt));
    window.setTimeout(() => {
      body.classList.add('is-ready');
      if (!preloader) return;
      window.setTimeout(() => preloader.classList.add('is-done'), 620);
      window.setTimeout(() => preloader.remove(), 1400);
    }, wait);
  }

  window.addEventListener('load', boot, { once: true });
  // failsafe if the load event is delayed by a slow asset
  window.setTimeout(boot, 3200);

  /* ---------------- Year ---------------- */
  const year = $('#year');
  if (year) year.textContent = String(new Date().getFullYear());

  /* ---------------- Header, progress, parallax ---------------- */
  const header = $('#siteHeader');
  const progressBar = $('.progress span');
  const toTop = $('#toTop');
  const heroImg = $('.hero-media img');
  let ticking = false;

  function onScroll() {
    const y = window.scrollY || window.pageYOffset;
    if (header) header.classList.toggle('is-scrolled', y > 30);
    if (toTop) toTop.classList.toggle('is-on', y > 720);

    if (progressBar) {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const value = max > 0 ? Math.min(y / max, 1) : 0;
      progressBar.style.transform = `scaleX(${value})`;
    }

    if (heroImg && !reduced) {
      const shift = Math.min(y * 0.16, 170);
      heroImg.style.transform = `translate3d(0, ${shift}px, 0) scale(1.08)`;
    }

    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      ticking = true;
      window.requestAnimationFrame(onScroll);
    }
  }, { passive: true });

  onScroll();

  /* ---------------- Mobile menu ---------------- */
  const navToggle = $('#navToggle');
  const mobileMenu = $('#mobileMenu');
  const menuRegions = ['#main', '.site-footer', '#toTop']
    .map((selector) => $(selector))
    .filter(Boolean);

  function setMenu(open) {
    if (!navToggle || !mobileMenu) return;
    navToggle.setAttribute('aria-expanded', String(open));
    navToggle.setAttribute('aria-label', open ? 'Tutup menu' : 'Buka menu');
    mobileMenu.classList.toggle('is-open', open);
    mobileMenu.setAttribute('aria-hidden', String(!open));
    mobileMenu.toggleAttribute('inert', !open);
    menuRegions.forEach((region) => { region.inert = open; });
    body.classList.toggle('is-locked', open);
    if (open) {
      const firstLink = $('a.mm-link', mobileMenu);
      if (firstLink) {
        window.setTimeout(() => {
          if (mobileMenu.classList.contains('is-open')) {
            firstLink.focus({ preventScroll: true });
          }
        }, 0);
      }
    }
  }

  if (navToggle && mobileMenu) {
    navToggle.addEventListener('click', () => {
      setMenu(navToggle.getAttribute('aria-expanded') !== 'true');
    });

    $$('a', mobileMenu).forEach((link) => {
      link.addEventListener('click', () => setMenu(false));
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && mobileMenu.classList.contains('is-open')) {
        setMenu(false);
        navToggle.focus({ preventScroll: true });
        return;
      }

      if (event.key === 'Tab' && mobileMenu.classList.contains('is-open')) {
        const focusables = $$('a[href], button:not([disabled])', mobileMenu)
          .filter((el) => el.getClientRects().length);
        if (!focusables.length) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        const inside = mobileMenu.contains(document.activeElement);
        if (event.shiftKey && (!inside || document.activeElement === first)) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && (!inside || document.activeElement === last)) {
          event.preventDefault();
          first.focus();
        }
      }
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth > 1024 && mobileMenu.classList.contains('is-open')) {
        setMenu(false);
      }
    });
  }

  /* ---------------- Active nav link ---------------- */
  const navLinks = $$('.nav-link');
  const sections = $$('main section[id]');

  if ('IntersectionObserver' in window && navLinks.length && sections.length) {
    const spy = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const id = `#${entry.target.id}`;
        navLinks.forEach((link) => {
          link.classList.toggle('is-active', link.getAttribute('href') === id);
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });

    sections.forEach((section) => spy.observe(section));
  }

  /* ---------------- Reveal on scroll ---------------- */
  const revealEls = $$('[data-reveal]');

  if (!reduced && 'IntersectionObserver' in window) {
    const revealer = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('in');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });

    revealEls.forEach((el) => revealer.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('in'));
  }

  /* ---------------- Counters ---------------- */
  const counters = $$('[data-count]');

  function formatNumber(value, decimals) {
    return value.toLocaleString('id-ID', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    });
  }

  function animateCounter(el) {
    const target = parseFloat(el.dataset.count || '0');
    const decimals = parseInt(el.dataset.decimals || '0', 10);
    const suffix = el.dataset.suffix || '';
    const duration = 1600;

    if (reduced) {
      el.textContent = formatNumber(target, decimals) + suffix;
      return;
    }

    let startTime = null;
    const step = (now) => {
      if (startTime === null) startTime = now;
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      el.textContent = formatNumber(target * eased, decimals) + suffix;
      if (progress < 1) window.requestAnimationFrame(step);
    };

    el.textContent = formatNumber(0, decimals) + suffix;
    window.requestAnimationFrame(step);
  }

  if (counters.length) {
    if ('IntersectionObserver' in window && !reduced) {
      const counterObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        });
      }, { threshold: 0.55 });

      counters.forEach((counter) => counterObserver.observe(counter));
    } else {
      counters.forEach((counter) => animateCounter(counter));
    }
  }

  /* ---------------- Card tilt ---------------- */
  if (finePointer && !reduced) {
    $$('[data-tilt]').forEach((card) => {
      card.addEventListener('pointermove', (event) => {
        const rect = card.getBoundingClientRect();
        const px = (event.clientX - rect.left) / rect.width - 0.5;
        const py = (event.clientY - rect.top) / rect.height - 0.5;
        card.style.transform = `perspective(1000px) rotateX(${(-py * 5).toFixed(2)}deg) rotateY(${(px * 5).toFixed(2)}deg) translateY(-4px)`;
      });

      card.addEventListener('pointerleave', () => {
        card.style.transform = '';
      });
    });
  }

  /* ---------------- Merch: jacket depan/belakang ---------------- */
  $$('[data-flip]').forEach((media) => {
    const flipBtn = $('.m-flip', media);
    if (!flipBtn) return;

    flipBtn.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation();
      const isBack = media.classList.toggle('is-back');
      flipBtn.setAttribute('aria-pressed', String(isBack));
      const front = $('.m-front', media);
      const back = $('.m-back', media);
      if (front) front.setAttribute('aria-hidden', String(isBack));
      if (back) back.setAttribute('aria-hidden', String(!isBack));
      const label = $('span', flipBtn);
      if (label) label.textContent = isBack ? 'Lihat depan' : 'Lihat belakang';
    });
  });

  /* ---------------- Custom cursor ---------------- */
  if (finePointer && !reduced) {
    const dot = $('.cursor-dot');
    const ring = $('.cursor-ring');

    if (dot && ring) {
      let mouseX = window.innerWidth / 2;
      let mouseY = window.innerHeight / 2;
      let ringX = mouseX;
      let ringY = mouseY;
      let visible = false;

      window.addEventListener('pointermove', (event) => {
        mouseX = event.clientX;
        mouseY = event.clientY;
        dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
        if (!visible) {
          visible = true;
          dot.style.opacity = '1';
          ring.style.opacity = '1';
        }
      }, { passive: true });

      const loop = () => {
        ringX += (mouseX - ringX) * 0.16;
        ringY += (mouseY - ringY) * 0.16;
        ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;
        window.requestAnimationFrame(loop);
      };
      loop();

      $$('a, button, input, select, textarea, .pcard, .g-item').forEach((el) => {
        el.addEventListener('mouseenter', () => ring.classList.add('is-hover'));
        el.addEventListener('mouseleave', () => ring.classList.remove('is-hover'));
      });

      document.addEventListener('mouseleave', () => {
        dot.style.opacity = '0';
        ring.style.opacity = '0';
        visible = false;
      });
    }
  }

  /* ---------------- Lightbox ---------------- */
  const lightbox = $('#lightbox');
  const lbImg = $('#lbImg');
  const lbCap = $('#lbCap');
  const lbCount = $('#lbCount');
  const lbClose = $('#lbClose');
  const lbPrev = $('#lbPrev');
  const lbNext = $('#lbNext');
  const triggers = $$('[data-lightbox]');
  const pageRegions = ['#siteHeader', '#main', '.site-footer', '#toTop']
    .map((selector) => $(selector))
    .filter(Boolean);
  let current = 0;
  let lastFocus = null;

  function showSlide(index) {
    if (!triggers.length || !lbImg) return;
    current = (index + triggers.length) % triggers.length;
    const trigger = triggers[current];
    const img = trigger.querySelector('img');

    lbImg.src = trigger.dataset.full || (img ? img.src : '');
    lbImg.alt = img ? img.alt : '';
    if (lbCap) lbCap.textContent = trigger.dataset.caption || '';
    if (lbCount) lbCount.textContent = `${current + 1} / ${triggers.length}`;
  }

  function openLightbox(index) {
    if (!lightbox) return;
    lastFocus = document.activeElement;
    showSlide(index);
    lightbox.classList.add('is-open');
    lightbox.setAttribute('aria-hidden', 'false');
    lightbox.removeAttribute('inert');
    pageRegions.forEach((region) => { region.inert = true; });
    body.classList.add('is-locked');
    if (lbClose) {
      // The dialog flips from inert to interactive one frame after the
      // attribute is removed; focusing earlier is silently refused.
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          if (lightbox.classList.contains('is-open')) {
            lbClose.focus({ preventScroll: true });
          }
        });
      });
    }
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove('is-open');
    lightbox.setAttribute('aria-hidden', 'true');
    lightbox.setAttribute('inert', '');
    pageRegions.forEach((region) => { region.inert = false; });
    body.classList.remove('is-locked');
    if (lastFocus && typeof lastFocus.focus === 'function') {
      lastFocus.focus({ preventScroll: true });
    }
  }

  if (lightbox && triggers.length) {
    triggers.forEach((trigger, index) => {
      trigger.addEventListener('click', () => openLightbox(index));
    });

    if (lbClose) lbClose.addEventListener('click', closeLightbox);
    if (lbPrev) lbPrev.addEventListener('click', () => showSlide(current - 1));
    if (lbNext) lbNext.addEventListener('click', () => showSlide(current + 1));

    lightbox.addEventListener('click', (event) => {
      if (event.target === lightbox) closeLightbox();
    });

    document.addEventListener('keydown', (event) => {
      if (!lightbox.classList.contains('is-open')) return;
      if (event.key === 'Escape') closeLightbox();
      if (event.key === 'ArrowLeft') showSlide(current - 1);
      if (event.key === 'ArrowRight') showSlide(current + 1);

      if (event.key === 'Tab') {
        const focusables = [lbClose, lbPrev, lbNext].filter(
          (el) => el && !el.disabled && el.getClientRects().length
        );
        if (!focusables.length) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        const inside = lightbox.contains(document.activeElement);
        if (event.shiftKey && (!inside || document.activeElement === first)) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && (!inside || document.activeElement === last)) {
          event.preventDefault();
          first.focus();
        }
      }
    });
  }

  /* ---------------- Form ---------------- */
  const form = $('#joinForm');
  const toast = $('#toast');
  let toastTimer = null;

  if (form && toast) {
    form.addEventListener('submit', (event) => {
      event.preventDefault();

      const nameInput = form.querySelector('#nama');
      const firstName = nameInput && nameInput.value.trim()
        ? nameInput.value.trim().split(/\s+/)[0]
        : 'Sedulur';

      const text = toast.querySelector('span');
      if (text) {
        text.textContent = `Ini masih formulir demo, ${firstName} — datamu belum terkirim. Hubungi halo@declan.team untuk mendaftar.`;
      }

      toast.classList.add('is-on');

      window.clearTimeout(toastTimer);
      toastTimer = window.setTimeout(() => toast.classList.remove('is-on'), 5000);
    });
  }

  /* ---------------- Back to top ---------------- */
  if (toTop) {
    toTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' });
    });
  }

  /* ---------------- Anchor focus management ---------------- */
  $$('a[href^="#"]').forEach((link) => {
    const target = link.getAttribute('href');
    if (target === '#') {
      link.addEventListener('click', (event) => event.preventDefault());
      return;
    }
    link.addEventListener('click', () => {
      if (!target) return;
      const node = document.querySelector(target);
      if (node && !node.hasAttribute('tabindex')) {
        node.setAttribute('tabindex', '-1');
      }
    });
  });
})();
