/**
 * ============================================
 * IDUL FITRI 1447 H — GREETING WEBSITE
 * Main JavaScript
 *
 * Table of Contents:
 * 1. Preloader
 * 2. Confetti Animation
 * 3. Floating Elements
 * 4. Scroll Animations (Intersection Observer)
 * 5. Hero Load Animations
 * 6. Scroll Progress Bar
 * 7. Parallax Effects
 * 8. Audio Controller
 * 9. Initialization
 * ============================================
 */

(function () {
  'use strict';

  /* ============================================
     1. PRELOADER
     ============================================ */
  const Preloader = {
    el: document.getElementById('preloader'),
    minDisplayTime: 1800, // minimum ms to show preloader

    /** Hide the preloader and trigger page entry animations */
    hide() {
      setTimeout(() => {
        this.el.classList.add('is-hidden');
        // Trigger hero animations after preloader hides
        HeroAnimations.play();
        // Start confetti after a short delay
        setTimeout(() => Confetti.start(), 400);
      }, this.minDisplayTime);
    },

    init() {
      // Start hiding when page is fully loaded
      window.addEventListener('load', () => this.hide());
    }
  };

  /* ============================================
     2. CONFETTI ANIMATION
     ============================================ */
  const Confetti = {
    canvas: document.getElementById('confetti-canvas'),
    ctx: null,
    particles: [],
    animationId: null,
    duration: 5000, // ms

    /** Color palette for confetti */
    colors: [
      '#f0d27c', '#c9a84c', '#e8c255', // golds
      '#5cb585', '#3aa56e', '#2e8a5b', // greens
      '#ffffff', '#faefc5',             // whites/creams
    ],

    /** Initialize canvas and create particles */
    start() {
      this.ctx = this.canvas.getContext('2d');
      this.resize();
      this.createParticles(150);
      this.animate();

      // Stop confetti after duration
      setTimeout(() => this.stop(), this.duration);

      // Handle resize
      window.addEventListener('resize', () => this.resize());
    },

    /** Resize canvas to viewport */
    resize() {
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
    },

    /** Create N confetti particles */
    createParticles(count) {
      this.particles = [];
      for (let i = 0; i < count; i++) {
        this.particles.push({
          x: Math.random() * this.canvas.width,
          y: Math.random() * this.canvas.height - this.canvas.height,
          size: Math.random() * 8 + 3,
          speedX: (Math.random() - 0.5) * 4,
          speedY: Math.random() * 3 + 2,
          rotation: Math.random() * 360,
          rotationSpeed: (Math.random() - 0.5) * 10,
          color: this.colors[Math.floor(Math.random() * this.colors.length)],
          opacity: Math.random() * 0.7 + 0.3,
          shape: Math.random() > 0.5 ? 'rect' : 'circle',
          wobble: Math.random() * 10,
          wobbleSpeed: Math.random() * 0.05 + 0.02,
        });
      }
    },

    /** Animation loop */
    animate() {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

      this.particles.forEach((p) => {
        this.ctx.save();
        this.ctx.globalAlpha = p.opacity;
        this.ctx.translate(p.x, p.y);
        this.ctx.rotate((p.rotation * Math.PI) / 180);
        this.ctx.fillStyle = p.color;

        if (p.shape === 'rect') {
          this.ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
        } else {
          this.ctx.beginPath();
          this.ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
          this.ctx.fill();
        }

        this.ctx.restore();

        // Update position
        p.x += p.speedX + Math.sin(p.wobble) * 0.5;
        p.y += p.speedY;
        p.rotation += p.rotationSpeed;
        p.wobble += p.wobbleSpeed;

        // Gentle gravity and wind
        p.speedY += 0.02;
        p.speedX *= 0.999;

        // Fade out near bottom
        if (p.y > this.canvas.height * 0.8) {
          p.opacity -= 0.01;
        }
      });

      // Remove invisible particles
      this.particles = this.particles.filter((p) => p.opacity > 0 && p.y < this.canvas.height + 50);

      if (this.particles.length > 0) {
        this.animationId = requestAnimationFrame(() => this.animate());
      }
    },

    /** Stop the confetti animation */
    stop() {
      // Gradually fade remaining particles
      this.particles.forEach((p) => {
        p.opacity -= 0.02;
      });
    },
  };

  /* ============================================
     3. FLOATING ELEMENTS (Decorative particles)
     ============================================ */
  const FloatingElements = {
    container: document.getElementById('floating-elements'),

    /** Symbols to float */
    symbols: ['☪', '⭐', '✦', '✧', '◆', '🌙', '✨'],

    /** Create floating elements */
    init() {
      const count = window.innerWidth < 768 ? 8 : 15;
      for (let i = 0; i < count; i++) {
        this.createItem(i, count);
      }
    },

    /** Create a single floating element */
    createItem(index, total) {
      const el = document.createElement('span');
      el.classList.add('floating-el');
      el.textContent = this.symbols[Math.floor(Math.random() * this.symbols.length)];

      // Random positioning and timing
      const size = Math.random() * 1.2 + 0.6;
      const left = Math.random() * 100;
      const delay = (index / total) * 20; // Stagger start times
      const duration = Math.random() * 15 + 20; // 20-35 seconds

      el.style.cssText = `
        left: ${left}%;
        font-size: ${size}rem;
        animation-duration: ${duration}s;
        animation-delay: ${delay}s;
        color: rgba(201, 168, 76, ${Math.random() * 0.4 + 0.2});
      `;

      this.container.appendChild(el);
    },
  };

  /* ============================================
     4. SCROLL ANIMATIONS (Intersection Observer)
     ============================================ */
  const ScrollAnimations = {
    /** Initialize the observer for scroll-triggered animations */
    init() {
      const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px',
      };

      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target;
            const stagger = parseInt(el.dataset.stagger || '0', 10);
            const delay = stagger * 120; // 120ms stagger between items

            setTimeout(() => {
              el.classList.add('is-visible');
            }, delay);

            // Unobserve after animating
            observer.unobserve(el);
          }
        });
      }, observerOptions);

      // Observe all scroll-animate elements
      document.querySelectorAll('.scroll-animate').forEach((el) => {
        observer.observe(el);
      });
    },
  };

  /* ============================================
     5. HERO LOAD ANIMATIONS
     ============================================ */
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

  /* ============================================
     6. SCROLL PROGRESS BAR
     ============================================ */
  const ScrollProgress = {
    bar: document.querySelector('.scroll-progress__bar'),

    /** Update the progress bar width based on scroll position */
    update() {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      this.bar.style.width = `${progress}%`;
    },

    init() {
      window.addEventListener('scroll', () => this.update(), { passive: true });
    },
  };

  /* ============================================
     7. PARALLAX EFFECTS (Lightweight)
     ============================================ */
  const Parallax = {
    elements: [],

    init() {
      // Register parallax targets
      this.elements = [
        {
          el: document.querySelector('.hero__glow'),
          speed: 0.3,
          type: 'translate',
        },
        {
          el: document.querySelector('.hero__stars'),
          speed: 0.15,
          type: 'translate',
        },
        {
          el: document.querySelector('.hero__mosque'),
          speed: 0.1,
          type: 'translate',
        },
      ];

      // Use requestAnimationFrame for smooth updates
      let ticking = false;
      window.addEventListener(
        'scroll',
        () => {
          if (!ticking) {
            requestAnimationFrame(() => {
              this.update();
              ticking = false;
            });
            ticking = true;
          }
        },
        { passive: true }
      );
    },

    /** Update parallax positions */
    update() {
      const scrollY = window.scrollY;
      // Only apply parallax in the hero area (first 100vh)
      if (scrollY > window.innerHeight) return;

      this.elements.forEach(({ el, speed }) => {
        if (!el) return;
        const yOffset = scrollY * speed;
        el.style.transform = `translateY(${yOffset}px)`;
      });
    },
  };

  /* ============================================
     8. AUDIO CONTROLLER
     ============================================ */
  const AudioController = {
    toggleBtn: document.getElementById('audio-toggle'),
    audio: null,
    isMuted: true,

    /** Initialize audio with a takbiran sound */
    init() {
      // Create an audio element programmatically
      this.audio = new Audio();
      
      // Use a publicly available takbiran audio
      // If local file exists, use it; otherwise we handle gracefully
      this.audio.src = 'assets/audio/takbiran.mp3';
      this.audio.loop = true;
      this.audio.volume = 0.3;
      this.audio.preload = 'auto';

      // Start as muted
      this.toggleBtn.classList.add('is-muted');

      // Toggle handler
      this.toggleBtn.addEventListener('click', () => this.toggle());

      // Handle audio loading errors gracefully
      this.audio.addEventListener('error', () => {
        console.log('Audio file not found. Place takbiran.mp3 in assets/audio/ folder.');
      });
    },

    /** Toggle audio play/pause */
    toggle() {
      if (this.isMuted) {
        this.audio.play().then(() => {
          this.isMuted = false;
          this.toggleBtn.classList.remove('is-muted');
        }).catch((err) => {
          console.log('Audio playback error:', err.message);
        });
      } else {
        this.audio.pause();
        this.isMuted = true;
        this.toggleBtn.classList.add('is-muted');
      }
    },
  };

  /* ============================================
     9. ADDITIONAL VISUAL EFFECTS
     ============================================ */
  
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

  /* ============================================
     9.5. MAAFIN SAYA (Interactive Forgiveness)
     ============================================ */
  const MaafinSaya = {
    // DOM elements
    card: null,
    emoji: null,
    title: null,
    subtitle: null,
    btnYes: null,
    btnNo: null,
    buttons: null,
    success: null,
    counter: null,
    counterText: null,
    confettiContainer: null,

    // State
    attempt: 0,
    maxAttempts: 5,

    /** Messages that change with each "Tidak" click */
    stages: [
      {
        emoji: '🥺',
        title: 'Maafin Saya Ya?',
        subtitle: 'Kalau ada salah kata atau perbuatan, mohon dimaafkan ya 🙏',
        counter: '',
      },
      {
        emoji: '😢',
        title: 'Yakin Tidak Mau Maafin?',
        subtitle: 'Please... saya sudah menyesal. Maafin ya? 🥲',
        counter: 'Percobaan 1 dari 5... ayolah 🙏',
      },
      {
        emoji: '😭',
        title: 'Masih Tidak Mau?!',
        subtitle: 'Hatiku remuk redam... tolonglah maafkan saya 💔',
        counter: 'Percobaan 2 dari 5... kamu serius nih? 😰',
      },
      {
        emoji: '🥹',
        title: 'Seriusan Nih?!',
        subtitle: 'Lihat, tombol "Iya" nya makin gede tuh... mending pencet aja ya? 😅',
        counter: 'Percobaan 3 dari 5... tinggal 2 lagi loh! 😨',
      },
      {
        emoji: '😤',
        title: 'Ayolah Maafin!!',
        subtitle: 'Kamu tega banget sih! Tombol nya udah GEDE BANGET tuh! 😤',
        counter: 'Percobaan 4 dari 5... TERAKHIR NIH! 🚨',
      },
      {
        emoji: '🤗',
        title: 'Udah Ga Bisa Nolak!',
        subtitle: 'Hehehe... tombol "Tidak" nya udah hilang. Pencet yang ijo aja ya! 💚',
        counter: 'Sudah tidak bisa menolak lagi! 😏',
      },
    ],

    /** Mini confetti colors */
    confettiColors: ['#f0d27c', '#c9a84c', '#5cb585', '#3aa56e', '#ffffff', '#e8c255', '#ff6b9d', '#c084fc'],

    init() {
      // Get DOM elements
      this.card = document.querySelector('.maafin-card');
      this.emoji = document.getElementById('maafin-emoji');
      this.title = document.getElementById('maafin-title');
      this.subtitle = document.getElementById('maafin-subtitle');
      this.btnYes = document.getElementById('btn-maafin-yes');
      this.btnNo = document.getElementById('btn-maafin-no');
      this.buttons = document.getElementById('maafin-buttons');
      this.success = document.getElementById('maafin-success');
      this.counter = document.getElementById('maafin-counter');
      this.counterText = document.getElementById('maafin-counter-text');
      this.confettiContainer = document.getElementById('maafin-confetti');

      if (!this.btnYes || !this.btnNo) return;

      // Event listeners
      this.btnYes.addEventListener('click', () => this.handleYes());
      this.btnNo.addEventListener('click', () => this.handleNo());
    },

    /** Handle clicking "Iya, Saya Maafin" */
    handleYes() {
      // Hide buttons and interactive elements
      this.buttons.style.display = 'none';
      this.emoji.style.display = 'none';
      this.title.style.display = 'none';
      this.subtitle.style.display = 'none';
      this.counter.hidden = true;

      // Show success state
      this.success.hidden = false;

      // Spawn mini confetti inside the card
      this.spawnMiniConfetti();

      // Also trigger the global confetti!
      setTimeout(() => Confetti.start(), 200);
    },

    /** Handle clicking "Tidak Saya Maafin" */
    handleNo() {
      this.attempt++;

      // Don't exceed max attempts
      if (this.attempt > this.maxAttempts) return;

      // Shake the card
      this.card.classList.remove('shake');
      // Force reflow to restart animation
      void this.card.offsetWidth;
      this.card.classList.add('shake');

      // Get the stage data
      const stage = this.stages[this.attempt];

      // Update emoji, title, subtitle
      this.emoji.textContent = stage.emoji;
      this.emoji.style.fontSize = `${4 + this.attempt * 0.5}rem`;
      this.title.textContent = stage.title;
      this.subtitle.textContent = stage.subtitle;

      // Show and update counter
      this.counter.hidden = false;
      this.counterText.textContent = stage.counter;

      // Grow "Iya" button
      // Remove previous grow class, add new one
      for (let i = 1; i <= this.maxAttempts; i++) {
        this.btnYes.classList.remove(`grow-${i}`);
        this.btnNo.classList.remove(`shrink-${i}`);
      }
      this.btnYes.classList.add(`grow-${this.attempt}`);
      this.btnNo.classList.add(`shrink-${this.attempt}`);

      // At max attempts, the "Tidak" button becomes unclickable (handled by CSS pointer-events: none)
    },

    /** Spawn mini confetti particles inside the success card */
    spawnMiniConfetti() {
      const count = 40;
      for (let i = 0; i < count; i++) {
        const confetti = document.createElement('div');
        confetti.classList.add('mini-confetti');
        confetti.style.left = `${Math.random() * 100}%`;
        confetti.style.top = `${-10}px`;
        confetti.style.backgroundColor = this.confettiColors[Math.floor(Math.random() * this.confettiColors.length)];
        confetti.style.animationDuration = `${Math.random() * 1.5 + 1}s`;
        confetti.style.animationDelay = `${Math.random() * 0.5}s`;
        confetti.style.width = `${Math.random() * 6 + 4}px`;
        confetti.style.height = `${Math.random() * 6 + 4}px`;
        this.confettiContainer.appendChild(confetti);
      }

      // Clean up after animation
      setTimeout(() => {
        this.confettiContainer.innerHTML = '';
      }, 3000);
    },
  };

  /* ============================================
     10. INITIALIZATION
     ============================================ */
  function init() {
    Preloader.init();
    FloatingElements.init();
    ScrollAnimations.init();
    ScrollProgress.init();
    Parallax.init();
    AudioController.init();
    CardGlowEffect.init();
    YearCounter.init();
    MaafinSaya.init();
  }

  // Run when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
