/**
 * HAIDAR ALI — PORTFOLIO JAVASCRIPT
 * Features:
 *  - Custom cursor with blend mode
 *  - Scroll progress bar
 *  - Intersection Observer 3D scroll reveals
 *  - Magnetic button effect
 *  - 3D tilt on work cards
 *  - Mobile navigation
 *  - Footer year
 */

'use strict';

/* ============================================================
   1. DOM READY
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  initCursor();
  initScrollProgress();
  initScrollReveal();
  initMagneticButtons();
  initTiltCards();
  initMobileNav();
  initSmoothNavLinks();
  initFooterYear();
  initWorkCardColors();
  initFormEnhancements();
});

/* ============================================================
   2. CUSTOM CURSOR
   ============================================================ */
function initCursor() {
  const cursor   = document.getElementById('cursor');
  const follower = document.getElementById('cursor-follower');
  if (!cursor || !follower) return;

  // Check for touch/pointer-less devices
  if (window.matchMedia('(pointer: coarse)').matches) {
    cursor.style.display   = 'none';
    follower.style.display = 'none';
    document.body.style.cursor = 'auto';
    return;
  }

  let mouseX = -100, mouseY = -100;
  let followerX = -100, followerY = -100;
  let rafId;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = mouseX + 'px';
    cursor.style.top  = mouseY + 'px';
  });

  // Follower with smooth lag
  function animateFollower() {
    followerX += (mouseX - followerX) * 0.18;
    followerY += (mouseY - followerY) * 0.18;
    follower.style.left = followerX + 'px';
    follower.style.top  = followerY + 'px';
    rafId = requestAnimationFrame(animateFollower);
  }
  animateFollower();

  // Hover states
  const hoverTargets = document.querySelectorAll(
    'a, button, [data-magnetic], .work-card, .pricing-card, .service-item, .why-card'
  );

  hoverTargets.forEach(el => {
    el.addEventListener('mouseenter', () => {
      if (el.matches('a, button, [data-magnetic]')) {
        cursor.classList.add('cursor-link');
      } else {
        cursor.classList.add('cursor-hover');
      }
    });
    el.addEventListener('mouseleave', () => {
      cursor.classList.remove('cursor-hover', 'cursor-link');
    });
  });

  // Hide on leave, show on enter
  document.addEventListener('mouseleave', () => {
    cursor.style.opacity = '0';
    follower.style.opacity = '0';
  });
  document.addEventListener('mouseenter', () => {
    cursor.style.opacity = '1';
    follower.style.opacity = '1';
  });
}

/* ============================================================
   3. SCROLL PROGRESS BAR
   ============================================================ */
function initScrollProgress() {
  const bar = document.getElementById('scroll-progress');
  if (!bar) return;

  function updateProgress() {
    const scrollTop    = window.scrollY;
    const docHeight    = document.documentElement.scrollHeight - window.innerHeight;
    const progress     = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    bar.style.width    = progress + '%';
  }

  window.addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();
}

/* ============================================================
   4. INTERSECTION OBSERVER — 3D SCROLL REVEALS
   ============================================================ */
function initScrollReveal() {
  const elements = document.querySelectorAll('.scroll-reveal');
  if (!elements.length) return;

  const observerOptions = {
    root:       null,
    rootMargin: '0px 0px -80px 0px',
    threshold:  0.1,
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        // Unobserve to avoid re-triggering
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  elements.forEach(el => observer.observe(el));
}

/* ============================================================
   5. MAGNETIC BUTTON EFFECT
   ============================================================ */
function initMagneticButtons() {
  const magneticBtns = document.querySelectorAll('[data-magnetic]');

  magneticBtns.forEach(btn => {
    const strength = 0.35;

    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const cx   = rect.left + rect.width  / 2;
      const cy   = rect.top  + rect.height / 2;
      const dx   = (e.clientX - cx) * strength;
      const dy   = (e.clientY - cy) * strength;
      btn.style.transform = `translate(${dx}px, ${dy}px)`;
    });

    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
      btn.style.transition = 'transform 0.5s cubic-bezier(0.19, 1, 0.22, 1)';
      setTimeout(() => { btn.style.transition = ''; }, 500);
    });
  });
}

/* ============================================================
   6. 3D TILT EFFECT ON WORK CARDS
   ============================================================ */
function initTiltCards() {
  const cards = document.querySelectorAll('[data-tilt]');

  cards.forEach(card => {
    const maxTilt    = 8; // degrees
    const perspective = 800;

    card.addEventListener('mousemove', (e) => {
      const rect  = card.getBoundingClientRect();
      const cx    = rect.left + rect.width  / 2;
      const cy    = rect.top  + rect.height / 2;
      const dx    = (e.clientX - cx) / (rect.width  / 2);
      const dy    = (e.clientY - cy) / (rect.height / 2);

      const rotateX = -dy * maxTilt;
      const rotateY =  dx * maxTilt;

      card.style.transform = `perspective(${perspective}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.01)`;
      card.style.transition = 'transform 0.05s linear';
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform  = 'perspective(800px) rotateX(0deg) rotateY(0deg) scale(1)';
      card.style.transition = 'transform 0.5s cubic-bezier(0.19, 1, 0.22, 1)';
    });
  });
}

/* ============================================================
   7. MOBILE NAVIGATION
   ============================================================ */
function initMobileNav() {
  const hamburger  = document.getElementById('nav-hamburger');
  const mobileMenu = document.getElementById('mobile-menu');
  if (!hamburger || !mobileMenu) return;

  let isOpen = false;

  function toggleMenu() {
    isOpen = !isOpen;
    hamburger.classList.toggle('open', isOpen);
    mobileMenu.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
    mobileMenu.setAttribute('aria-hidden',   String(!isOpen));
  }

  hamburger.addEventListener('click', toggleMenu);

  // Close on mobile link click
  const mobileLinks = mobileMenu.querySelectorAll('.mobile-link');
  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (isOpen) toggleMenu();
    });
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (isOpen && !mobileMenu.contains(e.target) && !hamburger.contains(e.target)) {
      toggleMenu();
    }
  });
}

/* ============================================================
   8. SMOOTH NAVIGATION LINKS (active highlight + offset)
   ============================================================ */
function initSmoothNavLinks() {
  const navHeight = 68; // px

  // Offset scroll for fixed nav
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - navHeight;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  // Active nav link on scroll
  const sections  = document.querySelectorAll('section[id]');
  const navLinks  = document.querySelectorAll('.nav-link');

  const activateLink = () => {
    const scrollY = window.scrollY + navHeight + 50;
    sections.forEach(section => {
      const sTop  = section.offsetTop;
      const sBot  = sTop + section.offsetHeight;
      const id    = section.getAttribute('id');

      if (scrollY >= sTop && scrollY < sBot) {
        navLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  };

  window.addEventListener('scroll', activateLink, { passive: true });
  activateLink();
}

/* ============================================================
   9. FOOTER YEAR
   ============================================================ */
function initFooterYear() {
  const el = document.getElementById('footer-year');
  if (el) el.textContent = new Date().getFullYear();
}

/* ============================================================
   10. WORK CARD COLOR REVEAL
       Use CSS data-attributes: grayscale default → color on hover
       The CSS already handles filter transitions, but we add
       subtle canvas-based overlay for extra richness.
   ============================================================ */
function initWorkCardColors() {
  // The CSS handles grayscale filter + gradient colors.
  // This JS adds an SVG noise texture overlay to each card for tactile depth.
  const workImgs = document.querySelectorAll('.work-card-img');

  workImgs.forEach(img => {
    // Create subtle dot pattern overlay
    const overlay = document.createElement('div');
    overlay.style.cssText = `
      position: absolute;
      inset: 0;
      background-image: radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px);
      background-size: 24px 24px;
      pointer-events: none;
      z-index: 1;
      opacity: 0;
      transition: opacity 0.6s ease;
    `;
    img.style.position = 'relative';

    const wrap = img.parentElement;
    wrap.style.position = 'relative';
    wrap.appendChild(overlay);

    const card = img.closest('.work-card');
    card.addEventListener('mouseenter', () => { overlay.style.opacity = '1'; });
    card.addEventListener('mouseleave', () => { overlay.style.opacity = '0'; });
  });
}

/* ============================================================
   11. FORM ENHANCEMENTS
   ============================================================ */
function initFormEnhancements() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  // Animate submit button
  const submitBtn = document.getElementById('form-submit-btn');

  if (submitBtn) {
    form.addEventListener('submit', (e) => {
      // Let FormSubmit handle the actual POST; just add visual feedback
      const btnText  = submitBtn.querySelector('.btn-text');
      const btnArrow = submitBtn.querySelector('.btn-arrow');

      if (btnText) btnText.textContent = 'Sending...';
      if (btnArrow) btnArrow.textContent = '⏳';
      submitBtn.style.pointerEvents = 'none';
      submitBtn.style.opacity = '0.75';

      // Re-enable after 3s (in case of redirect delay)
      setTimeout(() => {
        if (btnText) btnText.textContent = 'Send Message';
        if (btnArrow) btnArrow.textContent = '→';
        submitBtn.style.pointerEvents = '';
        submitBtn.style.opacity = '';
      }, 3000);
    });
  }

  // Floating label effect on filled inputs
  const inputs = form.querySelectorAll('.form-input, .form-textarea');
  inputs.forEach(input => {
    const label = input.parentElement.querySelector('.form-label');
    if (!label) return;

    function updateLabel() {
      if (input.value.trim()) {
        label.style.color = 'var(--silver-light)';
      } else {
        label.style.color = '';
      }
    }

    input.addEventListener('input', updateLabel);
    updateLabel();
  });
}

/* ============================================================
   12. NAVBAR SCROLL SHRINK
   ============================================================ */
(function initNavbarScroll() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
      navbar.style.padding = '0 clamp(20px, 4vw, 60px)';
      navbar.style.borderBottomColor = 'rgba(255,255,255,0.12)';
    } else {
      navbar.style.padding = '';
      navbar.style.borderBottomColor = '';
    }
  }, { passive: true });
})();

/* ============================================================
   13. PARALLAX HERO HEADLINE (Subtle mouse parallax)
   ============================================================ */
(function initParallax() {
  const headline = document.querySelector('.hero-headline');
  const tagline  = document.querySelector('.hero-tagline');
  if (!headline) return;
  if (window.matchMedia('(pointer: coarse)').matches) return;

  let lastX = 0, lastY = 0;

  document.addEventListener('mousemove', (e) => {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const nx = (e.clientX / vw - 0.5) * 2; // -1 to 1
    const ny = (e.clientY / vh - 0.5) * 2;

    // Smooth with lerp
    lastX += (nx - lastX) * 0.06;
    lastY += (ny - lastY) * 0.06;

    headline.style.transform = `translate(${lastX * 12}px, ${lastY * 6}px)`;
    if (tagline) tagline.style.transform = `translate(${lastX * 6}px, ${lastY * 3}px)`;
  });
})();

/* ============================================================
   14. STAT NUMBER COUNT-UP ANIMATION
   ============================================================ */
(function initCountUp() {
  const statNumbers = document.querySelectorAll('.stat-number');
  if (!statNumbers.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el   = entry.target;
      const text = el.textContent.trim();

      // Extract numeric part
      const match = text.match(/^(\d+)/);
      if (!match) return;

      const target  = parseInt(match[1], 10);
      const suffix  = text.slice(match[0].length); // "+", "%", etc.
      const duration = 1800;
      const start    = performance.now();

      function easeOut(t) { return 1 - Math.pow(1 - t, 3); }

      function tick(now) {
        const elapsed  = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const current  = Math.round(easeOut(progress) * target);
        el.textContent = current + suffix;
        if (progress < 1) requestAnimationFrame(tick);
      }

      requestAnimationFrame(tick);
      observer.unobserve(el);
    });
  }, { threshold: 0.5 });

  statNumbers.forEach(el => observer.observe(el));
})();

/* ============================================================
   15. SECTION LABEL TYPING EFFECT
   ============================================================ */
(function initTypingLabels() {
  const labels = document.querySelectorAll('.section-label');
  if (!labels.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el   = entry.target;
      const text = el.textContent;
      el.textContent = '';

      let i = 0;
      const interval = setInterval(() => {
        el.textContent += text[i];
        i++;
        if (i >= text.length) clearInterval(interval);
      }, 28);

      observer.unobserve(el);
    });
  }, { threshold: 0.8 });

  labels.forEach(el => observer.observe(el));
})();
