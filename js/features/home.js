'use strict';

/* === HERO LOAD ANIMATIONS === */

  const HeroAnimations = {
    /** Play hero entrance animations with staggered delays */
    play() {
      const elements = document.querySelectorAll('.animate-on-load');
      elements.forEach((el) => {
        const delay = parseInt(el.dataset.delay || '0', 10);
        setTimeout(() => {
          el.classList.add('is-visible');
        }, delay);
      });
    },
  };

  
/* === ADDITIONAL VISUAL EFFECTS === */

  
  /** Smooth mouse-following glow effect on greeting cards */
  const CardGlowEffect = {
    init() {
      const cards = document.querySelectorAll('.greeting-card');
      cards.forEach((card) => {
        card.addEventListener('mousemove', (e) => {
          const rect = card.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          const glow = card.querySelector('.greeting-card__glow');
          if (glow) {
            glow.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(201, 168, 76, 0.08) 0%, transparent 50%)`;
            glow.style.opacity = '1';
          }
        });

        card.addEventListener('mouseleave', () => {
          const glow = card.querySelector('.greeting-card__glow');
          if (glow) {
            glow.style.opacity = '0';
          }
        });
      });
    },
  };

  /** Smooth counter animation for the year number */
  const YearCounter = {
    init() {
      const yearEl = document.querySelector('.hero__year-number');
      if (!yearEl) return;

      const target = 1447;
      const startFrom = 1400;
      const duration = 2000; // ms
      let startTime = null;

      const animate = (timestamp) => {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / duration, 1);
        // Ease out expo
        const eased = 1 - Math.pow(2, -10 * progress);
        const current = Math.floor(startFrom + (target - startFrom) * eased);
        yearEl.textContent = current;

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          yearEl.textContent = target;
        }
      };

      // Start counter when hero animations begin (after preloader)
      setTimeout(() => {
        requestAnimationFrame(animate);
      }, 2600); // Matches the hero year delay
    },
  };

  