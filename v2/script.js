// ============================================================
// Small, dependency-free interactions. No build step needed —
// this file just needs to load after the HTML.
// ============================================================

document.getElementById('year').textContent = new Date().getFullYear();

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------------- Loading screen ---------------- */
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

/* ---------------- Work list: TV screen crossfades on row hover ----------------
   The framed device sitting in the roadside illustration (see .work-tv in the
   CSS) swaps its screen content to the hovered project's photo, echoing the
   reference site's hover-swap preview for its work list. Falls back to
   showing project 1 (already marked is-active in the HTML) when nothing is
   hovered/focused. */
const tvFrames = document.querySelectorAll('.work-tv-frame');
if (tvFrames.length){
  const showFrame = (project) => {
    tvFrames.forEach(f => f.classList.toggle('is-active', f.dataset.project === project));
  };
  document.querySelectorAll('.work-row').forEach(row => {
    const project = row.dataset.project;
    row.addEventListener('mouseenter', () => showFrame(project));
    row.addEventListener('focusin', () => showFrame(project));
  });
  const workList = document.querySelector('.work-list');
  workList?.addEventListener('mouseleave', () => showFrame('1'));
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
  btn.addEventListener('click', () => {
    const isOpen = btn.classList.contains('is-open');
    document.querySelectorAll('.spec-point.is-open').forEach(b => b.classList.remove('is-open'));
    if (!isOpen) btn.classList.add('is-open');
  });
});

/* ============================================================
   GSAP-powered scroll interactions (progressive enhancement)
============================================================ */
if (window.gsap && window.ScrollTrigger && !prefersReducedMotion) {
  gsap.registerPlugin(ScrollTrigger);

  /* ---- "My Process" horizontal-scroll pin (desktop only) ---- */
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
        return () => {
          tween.scrollTrigger && tween.scrollTrigger.kill();
          tween.kill();
          processStrip.classList.remove('gsap-active');
          gsap.set(processStrip, { clearProps: 'transform' });
        };
      }
    });
  }

  const processImages = processStrip ? Array.from(processStrip.querySelectorAll('img')) : [];
  Promise.all(processImages.map(img => img.complete
    ? Promise.resolve()
    : new Promise(res => { img.onload = img.onerror = res; })
  )).then(() => {
    initProcessPin();
    ScrollTrigger.refresh();
  });

  /* ---- Zoom-through transition (Work → About) ---- */
  const zoomSection = document.querySelector('.zoom');
  if (zoomSection) {
    const frame = zoomSection.querySelector('.zoom-frame');
    const caption = zoomSection.querySelector('.zoom-caption');
    const crosshairs = Array.from(zoomSection.querySelectorAll('.crosshair'));
    const fade = zoomSection.querySelector('.zoom-fade');
    const openShot = zoomSection.querySelector('.zoom-screen-open');

    gsap.timeline({
      scrollTrigger: { trigger: zoomSection, start: 'top top', end: '+=160%', scrub: 0.6, pin: true }
    })
    .to(frame, { scale: 18, borderRadius: 0, borderWidth: 0, ease: 'power1.in' }, 0)
    .to([caption, ...crosshairs], { opacity: 0, duration: 0.15 }, 0.05)
    .to(openShot, { opacity: 1, ease: 'none' }, 0.28)
    .to(fade, { opacity: 1, ease: 'none' }, 0.6);
  }
}
