/**
 * LUMINA CLEAN — Interactive JavaScript
 * Canvas particles, animations, magnetic buttons, counters, carousels
 */

(function () {
  'use strict';

  /* ── Utility ──────────────────────────────────────────────── */
  const qs = (s, p = document) => p.querySelector(s);
  const qsa = (s, p = document) => [...p.querySelectorAll(s)];
  const lerp = (a, b, t) => a + (b - a) * t;
  const clamp = (v, min, max) => Math.min(Math.max(v, min), max);

  /* ── Loader ──────────────────────────────────────────────── */
  function initLoader() {
    const loader = qs('#loader');
    if (!loader) return;
    setTimeout(() => loader.classList.add('hidden'), 2000);
  }

  /* ── Custom Cursor ───────────────────────────────────────── */
  function initCursor() {
    if (window.matchMedia('(max-width: 640px)').matches) return;
    const dot = qs('#cursor-dot');
    const ring = qs('#cursor-ring');
    if (!dot || !ring) return;

    let mx = -100, my = -100;
    let rx = -100, ry = -100;

    document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

    function updateCursor() {
      dot.style.left = mx + 'px';
      dot.style.top = my + 'px';
      rx = lerp(rx, mx, 0.14);
      ry = lerp(ry, my, 0.14);
      ring.style.left = rx + 'px';
      ring.style.top = ry + 'px';
      requestAnimationFrame(updateCursor);
    }
    updateCursor();

    // Hover effect on interactive elements
    const hoverEls = qsa('a, button, .service-card, .pricing-card, .team-card, .t-btn, .ba-handle');
    hoverEls.forEach(el => {
      el.addEventListener('mouseenter', () => ring.classList.add('hovered'));
      el.addEventListener('mouseleave', () => ring.classList.remove('hovered'));
    });
  }

  /* ── Scroll Progress ─────────────────────────────────────── */
  function initScrollProgress() {
    const bar = qs('#scroll-progress');
    if (!bar) return;
    window.addEventListener('scroll', () => {
      const pct = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight) * 100;
      bar.style.width = pct + '%';
    }, { passive: true });
  }

  /* ── Navbar ──────────────────────────────────────────────── */
  function initNavbar() {
    const nav = qs('#navbar');
    if (!nav) return;
    window.addEventListener('scroll', () => {
      nav.classList.toggle('scrolled', window.scrollY > 40);
    }, { passive: true });

    // Smooth scroll
    qsa('#navbar a[href^="#"]').forEach(a => {
      a.addEventListener('click', e => {
        e.preventDefault();
        const target = qs(a.getAttribute('href'));
        if (target) target.scrollIntoView({ behavior: 'smooth' });
      });
    });
  }

  /* ── Hero Particle Canvas ────────────────────────────────── */
  function initCanvas() {
    const canvas = qs('#hero-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let W, H, particles;
    let mouse = { x: -1000, y: -1000 };

    function resize() {
      W = canvas.width = canvas.offsetWidth;
      H = canvas.height = canvas.offsetHeight;
    }
    resize();
    window.addEventListener('resize', resize, { passive: true });

    canvas.addEventListener('mousemove', e => {
      const r = canvas.getBoundingClientRect();
      mouse.x = e.clientX - r.left;
      mouse.y = e.clientY - r.top;
    });
    canvas.addEventListener('mouseleave', () => { mouse.x = -1000; mouse.y = -1000; });

    const COLORS = ['#00d4ff', '#7c3aed', '#fbbf24', '#ffffff'];

    function createParticles(n) {
      return Array.from({ length: n }, () => ({
        x: Math.random() * W,
        y: Math.random() * H,
        r: Math.random() * 2 + 0.5,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        opacity: Math.random() * 0.6 + 0.1,
        pulse: Math.random() * Math.PI * 2,
      }));
    }

    particles = createParticles(120);

    function draw() {
      ctx.clearRect(0, 0, W, H);

      particles.forEach(p => {
        p.pulse += 0.012;
        p.opacity = 0.15 + Math.sin(p.pulse) * 0.12;

        // Mouse repulsion
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          const force = (120 - dist) / 120 * 0.8;
          p.x += (dx / dist) * force;
          p.y += (dy / dist) * force;
        }

        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = W;
        if (p.x > W) p.x = 0;
        if (p.y < 0) p.y = H;
        if (p.y > H) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r + Math.sin(p.pulse) * 0.4, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.opacity;
        ctx.fill();
        ctx.globalAlpha = 1;
      });

      // Draw connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < 100) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = '#00d4ff';
            ctx.globalAlpha = (1 - d / 100) * 0.08;
            ctx.lineWidth = 0.5;
            ctx.stroke();
            ctx.globalAlpha = 1;
          }
        }
      }

      requestAnimationFrame(draw);
    }
    draw();
  }

  /* ── Scroll Reveal ───────────────────────────────────────── */
  function initReveal() {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('active');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

    qsa('.reveal').forEach(el => io.observe(el));
  }

  /* ── Counter Animation ───────────────────────────────────── */
  function animateCounter(el) {
    const target = parseFloat(el.dataset.target);
    const suffix = el.dataset.suffix || '';
    const decimals = el.dataset.decimals ? parseInt(el.dataset.decimals) : 0;
    const duration = 2000;
    const start = performance.now();

    function step(now) {
      const elapsed = now - start;
      const progress = clamp(elapsed / duration, 0, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = target * eased;
      el.textContent = (decimals ? value.toFixed(decimals) : Math.round(value)) + suffix;
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  function initCounters() {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          animateCounter(e.target);
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.5 });

    qsa('[data-target]').forEach(el => io.observe(el));
  }

  /* ── Process Timeline Fill ───────────────────────────────── */
  function initProcessLine() {
    const fill = qs('.process-line-fill');
    if (!fill) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          fill.style.height = '100%';
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.2 });
    const timeline = qs('.process-timeline');
    if (timeline) io.observe(timeline);
  }

  /* ── Testimonials Carousel ───────────────────────────────── */
  function initTestimonials() {
    const slider = qs('.testimonials-slider');
    if (!slider) return;
    const cards = qsa('.testimonial-card', slider);
    const dots = qsa('.t-dot');
    const prevBtn = qs('#t-prev');
    const nextBtn = qs('#t-next');
    let current = 0;
    let interval;

    const cardW = () => {
      const c = cards[0];
      if (!c) return 444;
      const gap = parseFloat(getComputedStyle(slider).gap) || 24;
      return c.offsetWidth + gap;
    };

    function goTo(idx) {
      current = (idx + cards.length) % cards.length;
      slider.style.transform = `translateX(-${current * cardW()}px)`;
      dots.forEach((d, i) => d.classList.toggle('active', i === current));
    }

    if (prevBtn) prevBtn.addEventListener('click', () => { goTo(current - 1); resetInterval(); });
    if (nextBtn) nextBtn.addEventListener('click', () => { goTo(current + 1); resetInterval(); });

    dots.forEach((d, i) => d.addEventListener('click', () => { goTo(i); resetInterval(); }));

    function resetInterval() {
      clearInterval(interval);
      interval = setInterval(() => goTo(current + 1), 5000);
    }
    resetInterval();

    // Touch/drag
    let startX = 0;
    slider.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
    slider.addEventListener('touchend', e => {
      const diff = startX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 40) { goTo(current + (diff > 0 ? 1 : -1)); resetInterval(); }
    });
  }

  /* ── Before/After Slider ─────────────────────────────────── */
  function initBeforeAfter() {
    qsa('.before-after-card').forEach(card => {
      const after = qs('.ba-after', card);
      const divider = qs('.ba-divider', card);
      const handle = qs('.ba-handle', card);
      if (!after || !divider || !handle) return;

      let active = false;

      function setPosition(pct) {
        const p = clamp(pct, 5, 95);
        after.style.clipPath = `inset(0 ${100 - p}% 0 0)`;
        divider.style.left = p + '%';
        handle.style.left = p + '%';
      }

      setPosition(50);

      function onMove(clientX) {
        const rect = card.getBoundingClientRect();
        const pct = (clientX - rect.left) / rect.width * 100;
        setPosition(pct);
      }

      card.addEventListener('mousedown', e => { active = true; onMove(e.clientX); });
      window.addEventListener('mousemove', e => { if (active) onMove(e.clientX); });
      window.addEventListener('mouseup', () => { active = false; });

      card.addEventListener('touchstart', e => { active = true; onMove(e.touches[0].clientX); }, { passive: true });
      window.addEventListener('touchmove', e => { if (active) onMove(e.touches[0].clientX); }, { passive: true });
      window.addEventListener('touchend', () => { active = false; });
    });
  }

  /* ── Pricing Toggle ──────────────────────────────────────── */
  function initPricingToggle() {
    const toggle = qs('.pricing-toggle');
    const amounts = qsa('.pricing-amount');
    const monthlyPrices = ['89', '179', '299'];
    const yearlyPrices = ['71', '143', '239'];
    let isYearly = false;

    if (!toggle) return;

    toggle.addEventListener('click', () => {
      isYearly = !isYearly;
      toggle.classList.toggle('active', isYearly);
      amounts.forEach((el, i) => {
        el.style.transition = 'opacity 0.3s';
        el.style.opacity = '0';
        setTimeout(() => {
          el.textContent = isYearly ? yearlyPrices[i] : monthlyPrices[i];
          el.style.opacity = '1';
        }, 150);
      });
    });
  }

  /* ── Magnetic Buttons ────────────────────────────────────── */
  function initMagnetic() {
    if (window.matchMedia('(max-width: 640px)').matches) return;
    qsa('.btn-primary, .btn-secondary, .nav-cta').forEach(btn => {
      btn.addEventListener('mousemove', e => {
        const rect = btn.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = (e.clientX - cx) * 0.2;
        const dy = (e.clientY - cy) * 0.2;
        btn.style.transform = `translate(${dx}px, ${dy}px)`;
      });
      btn.addEventListener('mouseleave', () => {
        btn.style.transform = '';
      });
    });
  }

  /* ── Ripple Effect ───────────────────────────────────────── */
  function initRipple() {
    qsa('.btn-primary, .btn-secondary, .form-submit, .pricing-btn').forEach(btn => {
      btn.addEventListener('click', e => {
        const rect = btn.getBoundingClientRect();
        const r = document.createElement('span');
        r.className = 'ripple';
        const size = Math.max(rect.width, rect.height);
        r.style.cssText = `width:${size}px;height:${size}px;left:${e.clientX - rect.left - size / 2}px;top:${e.clientY - rect.top - size / 2}px`;
        btn.appendChild(r);
        setTimeout(() => r.remove(), 700);
      });
    });
  }

  /* ── Service Card Tilt ───────────────────────────────────── */
  function initCardTilt() {
    if (window.matchMedia('(max-width: 640px)').matches) return;
    qsa('.service-card').forEach(card => {
      let rafId = null;
      let pendingX = 0, pendingY = 0;
      card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        pendingX = (e.clientX - rect.left) / rect.width - 0.5;
        pendingY = (e.clientY - rect.top) / rect.height - 0.5;
        if (!rafId) {
          rafId = requestAnimationFrame(() => {
            card.style.transform = `translateY(-8px) rotateY(${pendingX * 10}deg) rotateX(${-pendingY * 10}deg)`;
            rafId = null;
          });
        }
      });
      card.addEventListener('mouseleave', () => {
        if (rafId) { cancelAnimationFrame(rafId); rafId = null; }
        card.style.transform = '';
      });
    });
  }

  /* ── Typewriter Hero ─────────────────────────────────────── */
  function initTypewriter() {
    const el = qs('.typewriter-target');
    if (!el) return;
    const texts = el.dataset.texts ? JSON.parse(el.dataset.texts) : [];
    if (!texts.length) return;

    let ti = 0, ci = 0, deleting = false;

    function tick() {
      const current = texts[ti];
      if (!deleting) {
        el.textContent = current.slice(0, ci + 1);
        ci++;
        if (ci === current.length) {
          deleting = true;
          setTimeout(tick, 1800);
          return;
        }
        setTimeout(tick, 75);
      } else {
        el.textContent = current.slice(0, ci - 1);
        ci--;
        if (ci === 0) {
          deleting = false;
          ti = (ti + 1) % texts.length;
          setTimeout(tick, 400);
          return;
        }
        setTimeout(tick, 40);
      }
    }
    setTimeout(tick, 2500);
  }

  /* ── Floating CTA ────────────────────────────────────────── */
  function initFloatingCTA() {
    const btn = qs('#floating-cta');
    if (!btn) return;
    window.addEventListener('scroll', () => {
      btn.classList.toggle('visible', window.scrollY > 500);
    }, { passive: true });
    btn.addEventListener('click', () => {
      qs('#contact')?.scrollIntoView({ behavior: 'smooth' });
    });
  }

  /* ── Form Submission ─────────────────────────────────────── */
  function initForm() {
    const form = qs('#contact-form');
    if (!form) return;
    form.addEventListener('submit', e => {
      e.preventDefault();

      // Basic validation
      const email = form.querySelector('#email');
      const fname = form.querySelector('#fname');
      const service = form.querySelector('#service');

      if (fname && !fname.value.trim()) {
        fname.focus();
        fname.style.borderColor = '#ff4d6d';
        setTimeout(() => { fname.style.borderColor = ''; }, 2000);
        return;
      }
      if (email && !email.value.includes('@')) {
        email.focus();
        email.style.borderColor = '#ff4d6d';
        setTimeout(() => { email.style.borderColor = ''; }, 2000);
        return;
      }
      if (service && !service.value) {
        service.focus();
        service.style.borderColor = '#ff4d6d';
        setTimeout(() => { service.style.borderColor = ''; }, 2000);
        return;
      }

      showToast('✅', 'Message Sent!', 'We\'ll get back to you within 24 hours.');
      form.reset();
    });
  }

  /* ── Toast ───────────────────────────────────────────────── */
  function showToast(icon, title, msg) {
    const existing = qs('.toast');
    if (existing) existing.remove();

    const t = document.createElement('div');
    t.className = 'toast';
    t.innerHTML = `<span class="toast-icon">${icon}</span>
      <div class="toast-text"><strong>${title}</strong>${msg}</div>`;
    document.body.appendChild(t);
    requestAnimationFrame(() => { requestAnimationFrame(() => t.classList.add('show')); });
    setTimeout(() => { t.classList.remove('show'); setTimeout(() => t.remove(), 600); }, 4000);
  }

  /* ── Parallax on Hero ────────────────────────────────────── */
  function initParallax() {
    const hero = qs('#hero');
    if (!hero) return;
    window.addEventListener('scroll', () => {
      const y = window.scrollY;
      const content = qs('.hero-content', hero);
      if (content) content.style.transform = `translateY(${y * 0.28}px)`;
    }, { passive: true });
  }

  /* ── Smooth hover underline for nav active ───────────────── */
  function initNavHighlight() {
    const sections = qsa('section[id]');
    const links = qsa('#navbar .nav-links a[href^="#"]');

    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          const id = e.target.id;
          links.forEach(l => {
            l.classList.toggle('active-nav', l.getAttribute('href') === '#' + id);
          });
        }
      });
    }, { rootMargin: '-40% 0px -40% 0px' });

    sections.forEach(s => io.observe(s));
  }

  /* ── Staggered card reveals ──────────────────────────────── */
  function initStaggeredReveal() {
    const grids = qsa('.services-grid, .team-grid, .pricing-grid');
    grids.forEach(grid => {
      const children = qsa(':scope > *', grid);
      children.forEach((c, i) => {
        c.classList.add('reveal');
        c.style.transitionDelay = (i * 0.1) + 's';
      });
    });
  }

  /* ── Init All ────────────────────────────────────────────── */
  function init() {
    initLoader();
    initScrollProgress();
    initNavbar();
    initCanvas();
    initCursor();
    initReveal();
    initCounters();
    initProcessLine();
    initTestimonials();
    initBeforeAfter();
    initPricingToggle();
    initMagnetic();
    initRipple();
    initCardTilt();
    initTypewriter();
    initFloatingCTA();
    initForm();
    initParallax();
    initNavHighlight();
    initStaggeredReveal();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
