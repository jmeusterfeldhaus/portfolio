// ============================================================
// Small, dependency-free interactions. No build step needed —
// this file just needs to load after the HTML.
// ============================================================

document.getElementById('year').textContent = new Date().getFullYear();

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------------- Loading screen ----------------
   Brief full-screen intro that fades once the page has finished
   loading — skipped instantly for reduced-motion users so it never
   blocks content. A short timeout fallback guards against a slow
   'load' event (e.g. the hero video) holding the loader forever. */
const loader = document.getElementById('loader');
if (loader){
  if (prefersReducedMotion){
    loader.classList.add('is-hidden');
  } else {
    const hideLoader = () => loader.classList.add('is-hidden');
    window.addEventListener('load', hideLoader);
    setTimeout(hideLoader, 1800);
  }
}

/* ---------------- Scroll progress + nav background ---------------- */
const progressBar = document.getElementById('scrollProgress');
const nav = document.getElementById('mainNav');

function onScroll(){
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  progressBar.style.width = pct + '%';
  nav.classList.toggle('scrolled', scrollTop > window.innerHeight * 0.6);
}
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

/* ---------------- Mobile menu ---------------- */
const burger = document.getElementById('navBurger');
burger?.addEventListener('click', () => {
  const open = document.body.classList.toggle('nav-open');
  burger.setAttribute('aria-expanded', open ? 'true' : 'false');
});

/* ---------------- Scroll reveals ---------------- */
const revealTargets = document.querySelectorAll('.reveal, .reveal-up');
const io = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting){
      entry.target.classList.add('in-view');
      io.unobserve(entry.target);
    }
  });
}, { threshold: 0.18 });
revealTargets.forEach(el => io.observe(el));

/* ---------------- Hero name reveal on load ---------------- */
window.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.reveal-word').forEach((word, i) => {
    setTimeout(() => {
      word.style.transition = 'transform 0.9s cubic-bezier(.2,.8,.2,1)';
      word.style.transform = 'translateY(0)';
    }, 200 + i * 140);
  });
  document.querySelectorAll('.hero .reveal').forEach((el, i) => {
    setTimeout(() => el.classList.add('in-view'), 500 + i * 150);
  });
});

/* ---------------- Hero snow canvas ---------------- */
const canvas = document.getElementById('snowCanvas');
if (canvas && !prefersReducedMotion){
  const ctx = canvas.getContext('2d');
  let w, h, flakes;

  function resize(){
    w = canvas.width = canvas.offsetWidth * devicePixelRatio;
    h = canvas.height = canvas.offsetHeight * devicePixelRatio;
  }

  function makeFlakes(count){
    return Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: (Math.random() * 1.6 + 0.4) * devicePixelRatio,
      speed: (Math.random() * 0.5 + 0.15) * devicePixelRatio,
      drift: (Math.random() - 0.5) * 0.3,
      alpha: Math.random() * 0.5 + 0.2
    }));
  }

  function init(){
    resize();
    flakes = makeFlakes(Math.floor((w * h) / 9000000 * 140) + 60);
  }

  function tick(){
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = '#f4f6f8';
    flakes.forEach(f => {
      f.y += f.speed;
      f.x += f.drift;
      if (f.y > h){ f.y = -4; f.x = Math.random() * w; }
      if (f.x > w) f.x = 0;
      if (f.x < 0) f.x = w;
      ctx.globalAlpha = f.alpha;
      ctx.beginPath();
      ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.globalAlpha = 1;
    requestAnimationFrame(tick);
  }

  init();
  tick();
  window.addEventListener('resize', () => { init(); }, { passive: true });
}

/* ---------------- Work list: jacket recolors on row hover ----------------
   The jacket photo pinned behind the row list (see .work-bg in the CSS)
   shifts color per project via hue-rotate, echoing the hover-swap background
   trick used for the work list on danielspatzek.com. Plain CSS transition
   does the animating — this just sets the filter per row on hover/focus. */
const workBgImg = document.querySelector('.work-bg-img');
const projectHue = { '1': 0, '2': -75, '3': 150 };
if (workBgImg){
  document.querySelectorAll('.work-row').forEach(row => {
    const hue = projectHue[row.dataset.project] ?? 0;
    row.addEventListener('mouseenter', () => {
      workBgImg.style.filter = `hue-rotate(${hue}deg) saturate(1.4)`;
    });
    row.addEventListener('mouseleave', () => {
      workBgImg.style.filter = 'hue-rotate(0deg) saturate(1)';
    });
    row.addEventListener('focusin', () => {
      workBgImg.style.filter = `hue-rotate(${hue}deg) saturate(1.4)`;
    });
    row.addEventListener('focusout', () => {
      workBgImg.style.filter = 'hue-rotate(0deg) saturate(1)';
    });
  });
}

/* ---------------- Work list: click a row to expand its detail ---------------- */
document.querySelectorAll('.work-row-toggle').forEach(toggle => {
  toggle.addEventListener('click', () => {
    const isOpen = toggle.getAttribute('aria-expanded') === 'true';
    document.querySelectorAll('.work-row-toggle[aria-expanded="true"]').forEach(t => {
      if (t !== toggle) t.setAttribute('aria-expanded', 'false');
    });
    toggle.setAttribute('aria-expanded', isOpen ? 'false' : 'true');
  });
});

/* ---------------- Spec HUD: tap-to-toggle on touch devices ---------------- */
document.querySelectorAll('.spec-point').forEach(btn => {
  btn.addEventListener('click', (e) => {
    const isOpen = btn.classList.contains('is-open');
    document.querySelectorAll('.spec-point.is-open').forEach(b => b.classList.remove('is-open'));
    if (!isOpen) btn.classList.add('is-open');
  });
});

/* ============================================================
   GSAP-powered scroll interactions (progressive enhancement)
   Both effects below are purely additive — if the GSAP CDN
   fails to load, or the user prefers reduced motion, the page
   simply keeps its normal static/touch-swipe behavior.
============================================================ */
if (window.gsap && window.ScrollTrigger && !prefersReducedMotion) {
  gsap.registerPlugin(ScrollTrigger);

  /* ---- "My Process" horizontal-scroll pin (desktop only) ----
     Vertical scroll drives horizontal translateX on the strip
     while the section itself stays pinned in place, the same
     scroll-jack pattern used for the process rail on
     danielspatzek.com. Mobile keeps the native touch-swipe strip
     (CSS overflow-x:auto), since scroll-jacking fights touch
     gestures on phones. */
  const processSection = document.querySelector('.process');
  const processStrip = document.querySelector('.process-strip');

  function initProcessPin(){
    if (!processSection || !processStrip) return;

    ScrollTrigger.matchMedia({
      '(min-width: 861px)': function () {
        processStrip.classList.add('gsap-active');
        gsap.set(processStrip, { x: 0 });

        const getDistance = () => Math.max(0, processStrip.scrollWidth - processSection.clientWidth + 1);

        const tween = gsap.to(processStrip, {
          x: () => -getDistance(),
          ease: 'none',
          scrollTrigger: {
            trigger: processSection,
            start: 'top top',
            end: () => '+=' + getDistance(),
            scrub: 0.6,
            pin: true,
            invalidateOnRefresh: true,
          }
        });

        // Cleanup when leaving this breakpoint (ScrollTrigger.matchMedia
        // calls this automatically) — hand control back to native scroll.
        return () => {
          tween.scrollTrigger && tween.scrollTrigger.kill();
          tween.kill();
          processStrip.classList.remove('gsap-active');
          gsap.set(processStrip, { clearProps: 'transform' });
        };
      }
    });
  }

  // Wait for the strip's images to load so scrollWidth is measured
  // accurately before the pin distance is calculated.
  const processImages = processStrip ? Array.from(processStrip.querySelectorAll('img')) : [];
  Promise.all(processImages.map(img => img.complete
    ? Promise.resolve()
    : new Promise(res => { img.onload = img.onerror = res; })
  )).then(() => {
    initProcessPin();
    ScrollTrigger.refresh();
  });

  /* ---- Zoom-through transition (Work → About) ----
     A small bordered "viewfinder" frame scales up while pinned until
     it fills the viewport and fades to the ink background color,
     seamlessly revealing the dark About section next — the same
     "zoom into the screen" idea as the TV transition on
     danielspatzek.com. While it scales, the closed jacket shot
     crossfades to the open interior/lining shot, so the jacket visibly
     "opens" as you zoom into it. */
  const zoomSection = document.querySelector('.zoom');
  if (zoomSection) {
    const frame = zoomSection.querySelector('.zoom-frame');
    const caption = zoomSection.querySelector('.zoom-caption');
    const crosshairs = Array.from(zoomSection.querySelectorAll('.crosshair'));
    const fade = zoomSection.querySelector('.zoom-fade');
    const openShot = zoomSection.querySelector('.zoom-screen-open');

    gsap.timeline({
      scrollTrigger: {
        trigger: zoomSection,
        start: 'top top',
        end: '+=160%',
        scrub: 0.6,
        pin: true,
      }
    })
    .to(frame, { scale: 18, borderRadius: 0, borderWidth: 0, ease: 'power1.in' }, 0)
    .to([caption, ...crosshairs], { opacity: 0, duration: 0.15 }, 0.05)
    .to(openShot, { opacity: 1, ease: 'none' }, 0.28)
    .to(fade, { opacity: 1, ease: 'none' }, 0.6);
  }
}

// build trigger 1783070599
