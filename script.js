document.addEventListener('DOMContentLoaded', () => {
  const sections = ['hero', 'about', 'skills', 'experience', 'projects', 'contact']
    .map(id => document.getElementById(id))
    .filter(Boolean);

  const ticks = Array.from(document.querySelectorAll('.tick'));
  const playhead = document.getElementById('playhead');
  const track = document.querySelector('.scrubber__track');
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Click-to-scroll for scrubber ticks
  ticks.forEach(tick => {
    tick.addEventListener('click', () => {
      const targetId = tick.getAttribute('data-target');
      const target = document.getElementById(targetId);
      if (target) target.scrollIntoView({ behavior: 'smooth' });
    });
  });

  // Move the playhead + highlight active tick based on scroll position
  function updateScrubber() {
    const scrollY = window.scrollY;
    const winH = window.innerHeight;
    const docH = document.documentElement.scrollHeight - winH;
    const progress = docH > 0 ? Math.min(Math.max(scrollY / docH, 0), 1) : 0;

    if (track && playhead) {
      const trackWidth = track.offsetWidth;
      playhead.style.left = `${progress * trackWidth}px`;
    }

    let activeIndex = 0;
    sections.forEach((sec, i) => {
      const rect = sec.getBoundingClientRect();
      if (rect.top <= winH * 0.4) activeIndex = i;
    });

    ticks.forEach((tick, i) => {
      tick.classList.toggle('is-active', i === activeIndex);
    });
  }

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        updateScrubber();
        ticking = false;
      });
      ticking = true;
    }
  });
  window.addEventListener('resize', updateScrubber);
  updateScrubber();

  // Reveal-on-scroll for cards and section heads
  const revealTargets = document.querySelectorAll(
    '.skillcard, .timeline__item, .projectcard, .section__head, .about__lead, .factlist'
  );
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if ('IntersectionObserver' in window && !prefersReducedMotion) {
    revealTargets.forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(16px)';
      el.style.transition = 'opacity .6s cubic-bezier(.22,.61,.36,1), transform .6s cubic-bezier(.22,.61,.36,1)';
    });

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

    revealTargets.forEach(el => observer.observe(el));
  }
});
