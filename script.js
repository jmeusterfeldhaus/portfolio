// ============================================================
// Small, dependency-free interactions. No build step needed —
// this file just needs to load after the HTML.
// ============================================================

document.getElementById('year').textContent = new Date().getFullYear();

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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

/* ---------------- Spec HUD: tap-to-toggle on touch devices ---------------- */
document.querySelectorAll('.spec-point').forEach(btn => {
  btn.addEventListener('click', (e) => {
    const isOpen = btn.classList.contains('is-open');
    document.querySelectorAll('.spec-point.is-open').forEach(b => b.classList.remove('is-open'));
    if (!isOpen) btn.classList.add('is-open');
  });
});
